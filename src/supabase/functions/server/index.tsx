import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js'
import * as kv from './kv_store.tsx'

const app = new Hono()

// Middleware
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))

app.use('*', logger(console.log))

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

// Authentication middleware for protected routes
const requireAuth = async (c: any, next: any) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return c.json({ error: 'No authorization token provided' }, 401);
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user?.id) {
    return c.json({ error: 'Unauthorized access' }, 401);
  }
  
  c.set('user', user);
  await next();
}

// Routes

// Health check
app.get('/make-server-c7ad339a/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

// User signup
app.post('/make-server-c7ad339a/auth/signup', async (c) => {
  try {
    const body = await c.req.json()
    const { email, password, name, salonName } = body

    if (!email || !password || !name) {
      return c.json({ error: 'Missing required fields' }, 400)
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name,
        salonName,
        role: 'salon_owner',
        created_at: new Date().toISOString()
      },
      // Automatically confirm the user's email since email server hasn't been configured
      email_confirm: true
    })

    if (error) {
      console.log('Signup error:', error)
      return c.json({ error: error.message }, 400)
    }

    // Initialize salon data
    const salonId = `salon_${data.user.id}`
    await kv.set(`${salonId}_settings`, {
      salonName: salonName || `${name}'s Salon`,
      owner: name,
      created_at: new Date().toISOString(),
      subscription_tier: 'basic',
      features: ['appointments', 'clients', 'staff']
    })

    return c.json({ 
      success: true, 
      user: data.user,
      message: 'Account created successfully'
    })
  } catch (error) {
    console.log('Signup error:', error)
    return c.json({ error: 'Internal server error during signup' }, 500)
  }
})

// Get dashboard data
app.get('/make-server-c7ad339a/dashboard', requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const salonId = `salon_${user.id}`
    
    // Get salon settings
    const settings = await kv.get(`${salonId}_settings`) || {}
    
    // Get appointments
    const appointments = await kv.get(`${salonId}_appointments`) || []
    
    // Get staff
    const staff = await kv.get(`${salonId}_staff`) || []
    
    // Get clients
    const clients = await kv.get(`${salonId}_clients`) || []
    
    // Calculate statistics
    const todayAppointments = appointments.filter((apt: any) => {
      const today = new Date().toDateString()
      return new Date(apt.date).toDateString() === today
    })
    
    const todayRevenue = todayAppointments.reduce((sum: number, apt: any) => 
      sum + (apt.price || 0), 0
    )
    
    const activeClients = clients.filter((client: any) => {
      const lastVisit = new Date(client.lastVisit || 0)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      return lastVisit > thirtyDaysAgo
    }).length
    
    const staffUtilization = staff.length > 0 ? 
      Math.round((staff.filter((s: any) => s.availability === 'busy').length / staff.length) * 100) : 0

    return c.json({
      settings,
      stats: {
        todayRevenue,
        todayAppointments: todayAppointments.length,
        activeClients,
        staffUtilization
      },
      appointments: todayAppointments.slice(0, 10), // Recent appointments
      staff: staff.slice(0, 6), // Top staff
      clients: clients.slice(0, 8) // Top clients
    })
  } catch (error) {
    console.log('Dashboard error:', error)
    return c.json({ error: 'Failed to fetch dashboard data' }, 500)
  }
})

// Create appointment
app.post('/make-server-c7ad339a/appointments', requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const salonId = `salon_${user.id}`
    const body = await c.req.json()
    
    const appointment = {
      id: `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...body,
      status: 'confirmed',
      created_at: new Date().toISOString(),
      salon_id: salonId
    }
    
    const appointments = await kv.get(`${salonId}_appointments`) || []
    appointments.push(appointment)
    await kv.set(`${salonId}_appointments`, appointments)
    
    return c.json({ success: true, appointment })
  } catch (error) {
    console.log('Create appointment error:', error)
    return c.json({ error: 'Failed to create appointment' }, 500)
  }
})

// Update appointment
app.put('/make-server-c7ad339a/appointments/:id', requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const salonId = `salon_${user.id}`
    const appointmentId = c.req.param('id')
    const body = await c.req.json()
    
    const appointments = await kv.get(`${salonId}_appointments`) || []
    const appointmentIndex = appointments.findIndex((apt: any) => apt.id === appointmentId)
    
    if (appointmentIndex === -1) {
      return c.json({ error: 'Appointment not found' }, 404)
    }
    
    appointments[appointmentIndex] = {
      ...appointments[appointmentIndex],
      ...body,
      updated_at: new Date().toISOString()
    }
    
    await kv.set(`${salonId}_appointments`, appointments)
    
    return c.json({ success: true, appointment: appointments[appointmentIndex] })
  } catch (error) {
    console.log('Update appointment error:', error)
    return c.json({ error: 'Failed to update appointment' }, 500)
  }
})

// Get staff
app.get('/make-server-c7ad339a/staff', requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const salonId = `salon_${user.id}`
    
    const staff = await kv.get(`${salonId}_staff`) || []
    return c.json({ staff })
  } catch (error) {
    console.log('Get staff error:', error)
    return c.json({ error: 'Failed to fetch staff data' }, 500)
  }
})

// Add staff member
app.post('/make-server-c7ad339a/staff', requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const salonId = `salon_${user.id}`
    const body = await c.req.json()
    
    const staffMember = {
      id: `staff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...body,
      availability: 'available',
      created_at: new Date().toISOString(),
      salon_id: salonId
    }
    
    const staff = await kv.get(`${salonId}_staff`) || []
    staff.push(staffMember)
    await kv.set(`${salonId}_staff`, staff)
    
    return c.json({ success: true, staffMember })
  } catch (error) {
    console.log('Add staff error:', error)
    return c.json({ error: 'Failed to add staff member' }, 500)
  }
})

// Get clients
app.get('/make-server-c7ad339a/clients', requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const salonId = `salon_${user.id}`
    
    const clients = await kv.get(`${salonId}_clients`) || []
    return c.json({ clients })
  } catch (error) {
    console.log('Get clients error:', error)
    return c.json({ error: 'Failed to fetch clients data' }, 500)
  }
})

// Add client
app.post('/make-server-c7ad339a/clients', requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const salonId = `salon_${user.id}`
    const body = await c.req.json()
    
    const client = {
      id: `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...body,
      loyaltyTier: 'Bronze',
      visits: 0,
      totalSpent: 0,
      created_at: new Date().toISOString(),
      salon_id: salonId
    }
    
    const clients = await kv.get(`${salonId}_clients`) || []
    clients.push(client)
    await kv.set(`${salonId}_clients`, clients)
    
    return c.json({ success: true, client })
  } catch (error) {
    console.log('Add client error:', error)
    return c.json({ error: 'Failed to add client' }, 500)
  }
})

// Analytics endpoint
app.get('/make-server-c7ad339a/analytics', requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const salonId = `salon_${user.id}`
    
    const appointments = await kv.get(`${salonId}_appointments`) || []
    const clients = await kv.get(`${salonId}_clients`) || []
    const staff = await kv.get(`${salonId}_staff`) || []
    
    // Calculate monthly revenue
    const now = new Date()
    const monthlyRevenue = appointments
      .filter((apt: any) => {
        const aptDate = new Date(apt.date)
        return aptDate.getMonth() === now.getMonth() && 
               aptDate.getFullYear() === now.getFullYear()
      })
      .reduce((sum: number, apt: any) => sum + (apt.price || 0), 0)
    
    // Client retention rate
    const returningClients = clients.filter((client: any) => client.visits > 1).length
    const retentionRate = clients.length > 0 ? 
      Math.round((returningClients / clients.length) * 100) : 0
    
    // Popular services
    const services = appointments.reduce((acc: any, apt: any) => {
      acc[apt.service] = (acc[apt.service] || 0) + 1
      return acc
    }, {})
    
    const popularServices = Object.entries(services)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([service, count]) => ({ service, count }))
    
    return c.json({
      monthlyRevenue,
      retentionRate,
      popularServices,
      totalAppointments: appointments.length,
      totalClients: clients.length,
      totalStaff: staff.length
    })
  } catch (error) {
    console.log('Analytics error:', error)
    return c.json({ error: 'Failed to fetch analytics data' }, 500)
  }
})

// Marketing campaigns
app.get('/make-server-c7ad339a/campaigns', requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const salonId = `salon_${user.id}`
    
    const campaigns = await kv.get(`${salonId}_campaigns`) || []
    return c.json({ campaigns })
  } catch (error) {
    console.log('Get campaigns error:', error)
    return c.json({ error: 'Failed to fetch campaigns' }, 500)
  }
})

// Create marketing campaign
app.post('/make-server-c7ad339a/campaigns', requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const salonId = `salon_${user.id}`
    const body = await c.req.json()
    
    const campaign = {
      id: `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...body,
      status: 'draft',
      created_at: new Date().toISOString(),
      salon_id: salonId
    }
    
    const campaigns = await kv.get(`${salonId}_campaigns`) || []
    campaigns.push(campaign)
    await kv.set(`${salonId}_campaigns`, campaigns)
    
    return c.json({ success: true, campaign })
  } catch (error) {
    console.log('Create campaign error:', error)
    return c.json({ error: 'Failed to create campaign' }, 500)
  }
})

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err)
  return c.json({ error: 'Internal server error' }, 500)
})

// Start server
Deno.serve(app.fetch)