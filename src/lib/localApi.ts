// Local API to replace Supabase integration for auth and data storage
// Data is persisted in localStorage for now.

export type AuthMode = 'signin' | 'signup';

export interface LocalUser {
  id: string;
  email: string;
  name?: string;
  salonName?: string;
}

export interface LocalSession {
  user: LocalUser;
  access_token: string;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  service: string;
  stylist: string;
  date?: string;
  time: string;
  duration: string;
  price: number;
  notes?: string;
  status: 'confirmed' | 'pending' | 'completed';
}

export interface Stylist {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  availability: 'available' | 'busy' | 'break';
  nextAppointment: string;
  avatar: string;
}

export interface Client {
  id: string;
  name: string;
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  visits: number;
  lastVisit: string;
  avatar: string;
}

export interface DashboardData {
  stats: {
    todayRevenue: number;
    todayAppointments: number;
    activeClients: number;
    staffUtilization: number;
  };
  appointments: Appointment[];
  staff: Stylist[];
  clients: Client[];
  settings?: {
    salonName?: string;
  };
}

const USERS_KEY = 'glam_users';
const SESSION_KEY = 'glam_session';
const DASHBOARD_KEY = 'glam_dashboard';

interface StoredUser extends LocalUser {
  password: string;
}

function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function ensureSeedData(): void {
  // Seed users store if missing
  const users = readJson<StoredUser[]>(USERS_KEY, []);
  if (users.length === 0) {
    const defaultUser: StoredUser = {
      id: generateId('user'),
      email: 'owner@example.com',
      password: 'password',
      name: 'Salon Owner',
      salonName: 'My Salon',
    };
    writeJson(USERS_KEY, [defaultUser]);
  }

  // Seed dashboard store if missing
  const dashboard = readJson<DashboardData | null>(DASHBOARD_KEY, null);
  if (!dashboard) {
    const initial: DashboardData = {
      stats: {
        todayRevenue: 18420,
        todayAppointments: 26,
        activeClients: 142,
        staffUtilization: 85,
      },
      appointments: [
        { id: '1', clientName: 'Sarah Johnson', service: 'Hair Color & Cut', stylist: 'Emma Wilson', time: '10:00', duration: '2h', price: 180, status: 'confirmed' },
        { id: '2', clientName: 'Michael Chen', service: 'Beard Trim', stylist: 'Carlos Rodriguez', time: '11:30', duration: '45m', price: 45, status: 'pending' },
        { id: '3', clientName: 'Lisa Anderson', service: 'Facial Treatment', stylist: 'Sophia Kim', time: '14:00', duration: '1h 30m', price: 120, status: 'confirmed' },
        { id: '4', clientName: 'David Wilson', service: 'Full Hair Styling', stylist: 'Emma Wilson', time: '16:00', duration: '1h 15m', price: 85, status: 'completed' },
      ],
      staff: [
        { id: '1', name: 'Emma Wilson', specialization: 'Hair Color Expert', rating: 4.9, availability: 'available', nextAppointment: '10:00 AM', avatar: 'https://images.unsplash.com/photo-1624981015149-e01395f1d774?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwc3R5bGlzdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTY4MDIzNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
        { id: '2', name: 'Carlos Rodriguez', specialization: "Men's Grooming", rating: 4.8, availability: 'busy', nextAppointment: '11:30 AM', avatar: 'EW' },
        { id: '3', name: 'Sophia Kim', specialization: 'Skincare Specialist', rating: 4.9, availability: 'available', nextAppointment: '2:00 PM', avatar: 'SK' },
        { id: '4', name: 'Marcus Thompson', specialization: 'Barber & Stylist', rating: 4.7, availability: 'break', nextAppointment: '3:30 PM', avatar: 'MT' },
      ],
      clients: [
        { id: '1', name: 'Sarah Johnson', loyaltyTier: 'Platinum', visits: 24, lastVisit: '2 days ago', avatar: 'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBzYWxvbiUyMGNsaWVudHxlbnwxfHx8fDE3NTY4NzYwNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
        { id: '2', name: 'Lisa Anderson', loyaltyTier: 'Gold', visits: 18, lastVisit: '1 week ago', avatar: 'LA' },
        { id: '3', name: 'Michael Chen', loyaltyTier: 'Silver', visits: 12, lastVisit: '3 days ago', avatar: 'MC' },
        { id: '4', name: 'David Wilson', loyaltyTier: 'Gold', visits: 16, lastVisit: 'Today', avatar: 'DW' },
      ],
      settings: {
        salonName: 'My Salon',
      },
    };
    writeJson(DASHBOARD_KEY, initial);
  }
}

export const localAuth = {
  async getSession(): Promise<{ data: { session: LocalSession | null } }> {
    ensureSeedData();
    const session = readJson<LocalSession | null>(SESSION_KEY, null);
    return { data: { session } };
  },
  async signInWithPassword({ email, password }: { email: string; password: string; }): Promise<{ data: { session: LocalSession | null }; error: { message: string } | null }> {
    ensureSeedData();
    const users = readJson<StoredUser[]>(USERS_KEY, []);
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) {
      return { data: { session: null }, error: { message: 'Invalid email or password' } };
    }
    const user: LocalUser = { id: found.id, email: found.email, name: found.name, salonName: found.salonName };
    const session: LocalSession = { user, access_token: generateId('token') };
    writeJson(SESSION_KEY, session);
    return { data: { session }, error: null };
  },
  async signOut(): Promise<void> {
    localStorage.removeItem(SESSION_KEY);
  },
  async signUp({ email, password, name, salonName }: { email: string; password: string; name?: string; salonName?: string; }): Promise<{ ok: true } | { ok: false; error: string }> {
    ensureSeedData();
    const users = readJson<StoredUser[]>(USERS_KEY, []);
    if (users.some(u => u.email === email)) {
      return { ok: false, error: 'User already exists' };
    }
    const newUser: StoredUser = { id: generateId('user'), email, password, name, salonName };
    users.push(newUser);
    writeJson(USERS_KEY, users);
    // Update dashboard settings salon name if provided
    if (salonName) {
      const dashboard = readJson<DashboardData>(DASHBOARD_KEY, undefined as unknown as DashboardData);
      if (dashboard) {
        dashboard.settings = dashboard.settings || {};
        dashboard.settings.salonName = salonName;
        writeJson(DASHBOARD_KEY, dashboard);
      }
    }
    return { ok: true };
  },
};

export const localData = {
  async getDashboardData(): Promise<DashboardData> {
    ensureSeedData();
    return readJson<DashboardData>(DASHBOARD_KEY, undefined as unknown as DashboardData);
  },
  async createAppointment(input: Omit<Appointment, 'id' | 'status' | 'duration' | 'price'> & { duration: string; price: number; }): Promise<Appointment> {
    ensureSeedData();
    const dashboard = readJson<DashboardData>(DASHBOARD_KEY, undefined as unknown as DashboardData);
    const appointment: Appointment = {
      id: generateId('appt'),
      clientName: input.clientName,
      clientEmail: input.clientEmail,
      clientPhone: input.clientPhone,
      service: input.service,
      stylist: input.stylist,
      date: input.date,
      time: input.time,
      duration: input.duration,
      price: input.price,
      notes: input.notes,
      status: 'confirmed',
    };
    dashboard.appointments.unshift(appointment);
    // Update stats
    dashboard.stats.todayAppointments = (dashboard.stats.todayAppointments || 0) + 1;
    dashboard.stats.todayRevenue = (dashboard.stats.todayRevenue || 0) + appointment.price;
    writeJson(DASHBOARD_KEY, dashboard);
    return appointment;
  },
};


