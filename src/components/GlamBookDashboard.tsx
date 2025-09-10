import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Users, TrendingUp, Star, Bell, Settings, Search, Plus, BarChart3, Clock, MapPin, Sparkles, Brain, DollarSign, MessageSquare, Smartphone, Gift, LogOut, ArrowLeft, User, Bot, Megaphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import AppointmentDialog from './AppointmentDialog';
import { localAuth, localData } from '../lib/localApi';

// Local-only mode: no external services

interface Appointment {
  id: string;
  clientName: string;
  service: string;
  stylist: string;
  time: string;
  duration: string;
  price: number;
  status: 'confirmed' | 'pending' | 'completed';
}

interface Stylist {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  availability: 'available' | 'busy' | 'break';
  nextAppointment: string;
  avatar: string;
}

interface Client {
  id: string;
  name: string;
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  visits: number;
  lastVisit: string;
  avatar: string;
}

interface GlamBookDashboardProps {
  onBackToLanding?: () => void;
}

export default function GlamBookDashboard({ onBackToLanding }: GlamBookDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    name: '',
    salonName: ''
  });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value || 0);

  // Check for existing session on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data: { session } } = await localAuth.getSession();
      if (session?.user) {
        setUser({ ...session.user, access_token: session.access_token });
        await fetchDashboardData();
      } else {
        setLoading(false);
        setShowAuthDialog(true);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setLoading(false);
      setShowAuthDialog(true);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const data = await localData.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (authMode === 'signup') {
        const result = await localAuth.signUp({
          email: authForm.email,
          password: authForm.password,
          name: authForm.name,
          salonName: authForm.salonName,
        });
        if (result.ok) {
          toast.success('Account created successfully! Please sign in.');
          setAuthMode('signin');
        } else {
          toast.error(result.error || 'Failed to create account');
        }
      } else {
        const { data: { session }, error } = await localAuth.signInWithPassword({
          email: authForm.email,
          password: authForm.password,
        });
        if (error) {
          toast.error(error.message);
        } else if (session) {
          setUser({ ...session.user, access_token: session.access_token });
          setShowAuthDialog(false);
          await fetchDashboardData();
          toast.success('Welcome back!');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await localAuth.signOut();
      setUser(null);
      setDashboardData(null);
      setShowAuthDialog(true);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  // Show authentication dialog if not authenticated
  if (!user || showAuthDialog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md backdrop-blur-sm bg-white/80 border-white/20">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome to GlamBook
            </CardTitle>
            <p className="text-gray-600">
              {authMode === 'signin' ? 'Sign in to your salon management dashboard' : 'Create your salon management account'}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'signup' && (
                <>
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={authForm.name}
                      onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="salonName">Salon Name</Label>
                    <Input
                      id="salonName"
                      type="text"
                      value={authForm.salonName}
                      onChange={(e) => setAuthForm({...authForm, salonName: e.target.value})}
                      placeholder="Optional"
                    />
                  </div>
                </>
              )}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                disabled={loading}
              >
                {loading ? 'Please wait...' : authMode === 'signin' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>
            <div className="text-center mt-4">
              <Button
                variant="link"
                onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
              >
                {authMode === 'signin' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading your salon dashboard...</p>
        </div>
      </div>
    );
  }

  const todayAppointments: Appointment[] = [
    { id: '1', clientName: 'Sarah Johnson', service: 'Hair Color & Cut', stylist: 'Emma Wilson', time: '10:00', duration: '2h', price: 180, status: 'confirmed' },
    { id: '2', clientName: 'Michael Chen', service: 'Beard Trim', stylist: 'Carlos Rodriguez', time: '11:30', duration: '45m', price: 45, status: 'pending' },
    { id: '3', clientName: 'Lisa Anderson', service: 'Facial Treatment', stylist: 'Sophia Kim', time: '14:00', duration: '1h 30m', price: 120, status: 'confirmed' },
    { id: '4', clientName: 'David Wilson', service: 'Full Hair Styling', stylist: 'Emma Wilson', time: '16:00', duration: '1h 15m', price: 85, status: 'completed' },
  ];

  const stylists: Stylist[] = [
    { id: '1', name: 'Emma Wilson', specialization: 'Hair Color Expert', rating: 4.9, availability: 'available', nextAppointment: '10:00 AM', avatar: 'https://images.unsplash.com/photo-1624981015149-e01395f1d774?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwc3R5bGlzdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTY4MDIzNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: '2', name: 'Carlos Rodriguez', specialization: 'Men\'s Grooming', rating: 4.8, availability: 'busy', nextAppointment: '11:30 AM', avatar: 'EW' },
    { id: '3', name: 'Sophia Kim', specialization: 'Skincare Specialist', rating: 4.9, availability: 'available', nextAppointment: '2:00 PM', avatar: 'SK' },
    { id: '4', name: 'Marcus Thompson', specialization: 'Barber & Stylist', rating: 4.7, availability: 'break', nextAppointment: '3:30 PM', avatar: 'MT' },
  ];

  const topClients: Client[] = [
    { id: '1', name: 'Sarah Johnson', loyaltyTier: 'Platinum', visits: 24, lastVisit: '2 days ago', avatar: 'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBzYWxvbiUyMGNsaWVudHxlbnwxfHx8fDE3NTY4NzYwNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: '2', name: 'Lisa Anderson', loyaltyTier: 'Gold', visits: 18, lastVisit: '1 week ago', avatar: 'LA' },
    { id: '3', name: 'Michael Chen', loyaltyTier: 'Silver', visits: 12, lastVisit: '3 days ago', avatar: 'MC' },
    { id: '4', name: 'David Wilson', loyaltyTier: 'Gold', visits: 16, lastVisit: 'Today', avatar: 'DW' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/95 border-b border-gray-200/60 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onBackToLanding && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onBackToLanding}
                  className="bg-gray-50/80 backdrop-blur-sm border-gray-200/60 shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  GlamBook
                </h1>
                <p className="text-sm text-gray-600">Intelligent Salon Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search clients, appointments..."
                  className="w-80 pl-10 bg-white/70 backdrop-blur-sm border-white/20"
                />
              </div>
              <Button variant="outline" size="icon" className="relative bg-white/70 backdrop-blur-sm border-white/20">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              
              {/* User Menu */}
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user?.name || 'Salon Owner'}</p>
                  <p className="text-gray-500">{dashboardData?.settings?.salonName || 'My Salon'}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleSignOut}
                  className="bg-gray-50/80 backdrop-blur-sm border-gray-200/60 shadow-sm"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 sm:mb-8 bg-gray-50/80 backdrop-blur-sm rounded-2xl p-2 shadow-sm overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'appointments', label: 'Appointments', icon: Calendar },
            { id: 'clients', label: 'Clients', icon: Users },
            { id: 'staff', label: 'Staff', icon: Clock },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'marketing', label: 'Marketing', icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                className={`flex-1 min-w-[140px] ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100/70'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* AI Insights Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 shadow-xl"
            >
              <div className="relative z-10 flex items-center justify-between text-white">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-6 h-6" />
                    <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">AI Insights</span>
                  </div>
                  <h2 className="text-2xl font-bold">Today's Optimization Suggestions</h2>
                  <p className="text-purple-100">Your salon is running at 85% capacity. Consider promoting services during 2-4 PM slot.</p>
                </div>
                <div className="flex space-x-4">
                  <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/20">
                    View Details
                  </Button>
                  <Button variant="outline" className="bg-white/20 hover:bg-white/30 text-white border-white/20">
                    Dismiss
                  </Button>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-transparent"></div>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  title: 'Today\'s Revenue', 
                  value: formatCurrency(dashboardData?.stats?.todayRevenue || 0), 
                  change: '+12%', 
                  icon: DollarSign, 
                  color: 'from-green-500 to-emerald-600' 
                },
                { 
                  title: 'Appointments', 
                  value: dashboardData?.stats?.todayAppointments || 0, 
                  change: '+8%', 
                  icon: Calendar, 
                  color: 'from-blue-500 to-cyan-600' 
                },
                { 
                  title: 'Active Clients', 
                  value: dashboardData?.stats?.activeClients || 0, 
                  change: '+24%', 
                  icon: Users, 
                  color: 'from-purple-500 to-pink-600' 
                },
                { 
                  title: 'Staff Utilization', 
                  value: `${dashboardData?.stats?.staffUtilization || 0}%`, 
                  change: '+5%', 
                  icon: Clock, 
                  color: 'from-orange-500 to-red-600' 
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="relative overflow-hidden backdrop-blur-sm bg-white/95 border-gray-200/60 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                          <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                          <p className="text-sm text-green-600 mt-1">{stat.change} from yesterday</p>
                        </div>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Today's Appointments */}
              <div className="lg:col-span-2">
                <Card className="backdrop-blur-sm bg-white/95 border-gray-200/60 shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                      <span>Today's Appointments</span>
                    </CardTitle>
                    <AppointmentDialog
                      trigger={
                        <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
                          <Plus className="w-4 h-4 mr-2" />
                          New Booking
                        </Button>
                      }
                      onAppointmentCreated={() => fetchDashboardData()}
                    />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(dashboardData?.appointments || todayAppointments).map((appointment: any, index: number) => (
                      <motion.div
                        key={appointment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-white/50 to-white/30 hover:from-white/70 hover:to-white/50 transition-all duration-300"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium">
                            {appointment.clientName.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{appointment.clientName}</p>
                            <p className="text-sm text-gray-600">{appointment.service} • {appointment.stylist}</p>
                            <p className="text-xs text-gray-500">{appointment.time} • {appointment.duration}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold text-gray-900">{formatCurrency(appointment.price)}</span>
                          <Badge 
                            variant={appointment.status === 'confirmed' ? 'default' : appointment.status === 'pending' ? 'secondary' : 'outline'}
                            className={
                              appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                              appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }
                          >
                            {appointment.status}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Staff Status */}
              <div className="space-y-8">
                <Card className="backdrop-blur-sm bg-white/95 border-gray-200/60 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-indigo-600" />
                      <span>Staff Status</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(dashboardData?.staff || stylists).map((stylist: any, index: number) => (
                      <motion.div
                        key={stylist.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/50 transition-all duration-300"
                      >
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={stylist.avatar} />
                          <AvatarFallback>{stylist.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{stylist.name}</p>
                          <p className="text-xs text-gray-600">{stylist.specialization}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-gray-600">{stylist.rating}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant="outline"
                            className={
                              stylist.availability === 'available' ? 'border-green-500 text-green-700 bg-green-50' :
                              stylist.availability === 'busy' ? 'border-red-500 text-red-700 bg-red-50' :
                              'border-yellow-500 text-yellow-700 bg-yellow-50'
                            }
                          >
                            {stylist.availability}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">Next: {stylist.nextAppointment}</p>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="backdrop-blur-sm bg-white/70 border-white/20">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { label: 'AI Chatbot', icon: Bot, color: 'from-purple-500 to-pink-500' },
                      { label: 'Send Promotions', icon: Gift, color: 'from-green-500 to-emerald-500' },
                      { label: 'Mobile Check-in', icon: Smartphone, color: 'from-blue-500 to-cyan-500' },
                      { label: 'Loyalty Rewards', icon: Star, color: 'from-yellow-500 to-orange-500' },
                    ].map((action, index) => (
                      <Button
                        key={action.label}
                        variant="outline"
                        className="w-full justify-start bg-white/50 hover:bg-white/70 border-white/20"
                      >
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mr-3`}>
                          <action.icon className="w-4 h-4 text-white" />
                        </div>
                        {action.label}
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="backdrop-blur-sm bg-white/70 border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Revenue Trends</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">This Week</span>
                      <span className="font-semibold">{formatCurrency(18420)}</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-semibold text-green-600">+15%</p>
                        <p className="text-xs text-gray-600">vs Last Week</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-blue-600">{formatCurrency(307)}</p>
                        <p className="text-xs text-gray-600">Avg per Day</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-purple-600">92%</p>
                        <p className="text-xs text-gray-600">Goal Progress</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/70 border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5" />
                    <span>Top Clients</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(dashboardData?.clients || topClients).map((client: any, index: number) => (
                    <div key={client.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/50 transition-all duration-300">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={client.avatar} />
                          <AvatarFallback>{client.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{client.name}</p>
                          <p className="text-xs text-gray-600">{client.visits} visits • {client.lastVisit}</p>
                        </div>
                      </div>
                      <Badge 
                        className={
                          client.loyaltyTier === 'Platinum' ? 'bg-purple-100 text-purple-700' :
                          client.loyaltyTier === 'Gold' ? 'bg-yellow-100 text-yellow-700' :
                          client.loyaltyTier === 'Silver' ? 'bg-gray-100 text-gray-700' :
                          'bg-orange-100 text-orange-700'
                        }
                      >
                        {client.loyaltyTier}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-semibold">Appointments</h2>
              </div>
              <AppointmentDialog
                trigger={<Button className="bg-gradient-to-r from-indigo-600 to-purple-600"><Plus className="w-4 h-4 mr-2"/>New Booking</Button>}
                onAppointmentCreated={() => fetchDashboardData()}
              />
            </div>
            <Card className="backdrop-blur-sm bg-white/95 border-gray-200/60 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(dashboardData?.appointments || todayAppointments).map((a: any) => (
                    <div key={a.id} className="p-4 rounded-xl border border-gray-200/60 hover:bg-gray-50 transition">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-gray-900">{a.clientName}</div>
                        <Badge className="bg-indigo-100 text-indigo-700" variant="outline">{a.status}</Badge>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{a.service} • {a.stylist}</div>
                      <div className="text-xs text-gray-500 mt-1">{a.time} • {a.duration}</div>
                      <div className="text-right font-semibold mt-2">${a.price}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Clients Tab */}
        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-semibold">Clients</h2>
            </div>
            <Card className="backdrop-blur-sm bg-white/95 border-gray-200/60 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(dashboardData?.clients || topClients).map((client: any) => (
                    <div key={client.id} className="p-4 rounded-xl border border-gray-200/60 hover:bg-gray-50 transition">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={client.avatar} />
                          <AvatarFallback>{client.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-xs text-gray-500">{client.visits} visits • {client.lastVisit}</div>
                        </div>
                        <div className="ml-auto">
                          <Badge>{client.loyaltyTier}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Staff Tab */}
        {activeTab === 'staff' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-semibold">Staff</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(dashboardData?.staff || stylists).map((s: any) => (
                <Card key={s.id} className="backdrop-blur-sm bg-white/95 border-gray-200/60 shadow-lg">
                  <CardContent className="p-6 flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={s.avatar} />
                      <AvatarFallback>{s.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{s.name}</div>
                      <div className="text-xs text-gray-600">{s.specialization}</div>
                      <div className="text-xs text-gray-500">Next: {s.nextAppointment}</div>
                    </div>
                    <Badge variant="outline">{s.availability}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-semibold">Analytics</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="backdrop-blur-sm bg-white/95 border-gray-200/60 shadow-lg">
                <CardHeader>
                  <CardTitle>Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-600"><span>Monthly</span><span>{formatCurrency(24320)}</span></div>
                    <Progress value={68} className="h-2" />
                    <div className="flex justify-between text-sm text-gray-600"><span>Target</span><span>80%</span></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="backdrop-blur-sm bg-white/95 border-gray-200/60 shadow-lg">
                <CardHeader>
                  <CardTitle>Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-600"><span>This Week</span><span>126</span></div>
                    <Progress value={54} className="h-2" />
                    <div className="flex justify-between text-sm text-gray-600"><span>Show-ups</span><span>92%</span></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Marketing Tab */}
        {activeTab === 'marketing' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-semibold">Marketing</h2>
            </div>
            <Card className="backdrop-blur-sm bg-white/95 border-gray-200/60 shadow-lg">
              <CardHeader>
                <CardTitle>Create Campaign</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="channel">Channel</Label>
                    <Select>
                      <SelectTrigger id="channel"><SelectValue placeholder="Choose channel" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="push">Push</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="segment">Segment</Label>
                    <Select>
                      <SelectTrigger id="segment"><SelectValue placeholder="All clients" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Clients</SelectItem>
                        <SelectItem value="loyal">Loyalty: Gold/Platinum</SelectItem>
                        <SelectItem value="inactive">Inactive (30+ days)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Write your promotion…" />
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => toast.success('Campaign scheduled!')} className="bg-gradient-to-r from-indigo-600 to-purple-600">Send Campaign</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}