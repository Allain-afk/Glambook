import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { 
  Smartphone, 
  Download, 
  Sparkles, 
  Calendar, 
  Users, 
  BarChart3, 
  MapPin, 
  Heart,
  ArrowRight,
  Play,
  Apple,
  Zap,
  Shield,
  Globe,
  Star,
  Monitor,
  Tablet
} from 'lucide-react';
// MUI icons for reliable, filled glyphs in the App Download section
import { AppleLogo, AndroidLogo, DownloadSimple, DeviceMobile } from 'phosphor-react';
import { usePWA } from '../hooks/usePWA';
import { ImageWithFallback } from './figma/ImageWithFallback';
import CreativeEntryButton from './CreativeEntryButton';
import MorphingEntryButton from './MorphingEntryButton';
import HolographicEntryButton from './HolographicEntryButton';

interface LandingPageProps {
  onEnterDashboard: () => void;
}

export default function LandingPage({ onEnterDashboard }: LandingPageProps) {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "AI-Powered Scheduling",
      description: "Smart appointment optimization that maximizes your revenue and minimizes gaps."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Client Loyalty Engine",
      description: "Automated campaigns and rewards that keep clients coming back for more."
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Multi-Branch Management",
      description: "Seamlessly manage multiple salon locations from one unified dashboard."
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Real-Time Analytics",
      description: "Track performance, revenue, and trends with beautiful, actionable insights."
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "AR Virtual Try-On",
      description: "Let clients preview styles with cutting-edge augmented reality technology."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Dynamic Pricing",
      description: "Optimize pricing based on demand, time, and stylist availability."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-indigo-50/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-purple-50/30 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">GlamBook</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            {isInstallable && !isInstalled && (
              <Button 
                onClick={installApp}
                variant="outline" 
                size="sm"
                className="bg-gray-50/80 backdrop-blur-md border-gray-200/60 text-gray-700 hover:bg-gray-100/80 shadow-sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Install App
              </Button>
            )}
            <HolographicEntryButton onClick={onEnterDashboard} />
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-20 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7"
            >
              <Badge className="mb-6 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-indigo-200/60 shadow-sm">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered Salon Management
              </Badge>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Transform Your
                <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text">
                  {" "}Salon Business
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                The only platform you need to manage appointments, engage clients, 
                and grow your beauty business with AI-driven insights and automation.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <HolographicEntryButton 
                  onClick={onEnterDashboard}
                  size="large"
                >
                  Start Free Trial
                </HolographicEntryButton>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="bg-gray-50/80 backdrop-blur-md border-gray-200/60 text-gray-700 hover:bg-gray-100/80 text-lg px-8 py-4 shadow-sm"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span>4.9/5 Rating</span>
                </div>
                <div>
                  <span>10,000+ Salons</span>
                </div>
                <div>
                  <span>99.9% Uptime</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative lg:col-span-5"
            >
              <div className="relative max-w-md mx-auto">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1736580602029-78afd910cbf8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzYWxvbiUyMGludGVyaW9yJTIwbHV4dXJ5fGVufDF8fHx8MTc1Njg3OTk3M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Modern salon interior"
                    className="w-full h-72 object-cover rounded-2xl"
                  />
                </div>

                {/* Floating cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="absolute -top-4 -left-4"
                >
                  <Card className="bg-gradient-to-r from-rose-500 to-pink-600 backdrop-blur-md border-white/20 shadow-xl rounded-xl">
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-2 text-white">
                        <Heart className="h-4 w-4" />
                        <span className="font-medium text-xs">Client Satisfaction</span>
                      </div>
                      <div className="text-xl font-bold text-white mt-1">98%</div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="absolute -bottom-4 -right-4"
                >
                  <Card className="bg-gradient-to-r from-emerald-500 to-green-600 backdrop-blur-md border-white/20 shadow-xl rounded-xl">
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-2 text-white">
                        <BarChart3 className="h-4 w-4" />
                        <span className="font-medium text-xs">Revenue Growth</span>
                      </div>
                      <div className="text-xl font-bold text-white mt-1">+127%</div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-32">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200/60 shadow-sm">
              <Zap className="h-3 w-3 mr-1" />
              Powerful Features
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text">Succeed</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From AI scheduling to AR try-ons, GlamBook brings the future of salon management to your fingertips.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Card className="bg-white/95 backdrop-blur-xl border-gray-200/60 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="text-indigo-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* App Download Section */}
      <section className="relative z-10 px-6 py-32">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Badge className="mb-6 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200/60 shadow-sm">
              <Smartphone className="h-3 w-3 mr-1" />
              Mobile First
            </Badge>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Take GlamBook Everywhere
            </h2>
            
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Download our mobile app or install the progressive web app for a native experience on any device.
            </p>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {/* PWA Install */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <Card className="bg-white border-gray-200/60 hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200">
                  <CardContent className="p-8">
                    <div className="bg-gray-900 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <DeviceMobile size={28} color="#fff" weight="duotone" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 opacity-100">Progressive Web App</h3>
                    <p className="text-gray-600 mb-6 opacity-100">Install directly from your browser for instant access.</p>
                    {isInstallable && !isInstalled ? (
                      <Button 
                        onClick={installApp}
                        className="w-full bg-gray-900 hover:bg-black text-white shadow-sm"
                      >
                        <DownloadSimple size={18} className="mr-2" />
                        Install Now
                      </Button>
                    ) : (
                      <Button 
                        disabled
                        className="w-full bg-gray-300 text-gray-600"
                      >
                        {isInstalled ? 'Already Installed' : 'Available in Browser'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* App Store */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <Card className="bg-white border-gray-200/60 hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200">
                  <CardContent className="p-8">
                    <div className="bg-gray-900 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <AppleLogo size={28} color="#fff" weight="fill" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 opacity-100">iOS App Store</h3>
                    <p className="text-gray-600 mb-6 opacity-100">Native iOS app with full device integration.</p>
                    <Button 
                      className="w-full bg-gray-900 hover:bg-black text-white shadow-sm"
                      onClick={() => window.open('https://apps.apple.com/app/glambook', '_blank')}
                    >
                      <AppleLogo size={18} weight="fill" className="mr-2" />
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Google Play */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <Card className="bg-white border-gray-200/60 hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200">
                  <CardContent className="p-8">
                    <div className="bg-gray-900 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <AndroidLogo size={28} color="#fff" weight="fill" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 opacity-100">Google Play Store</h3>
                    <p className="text-gray-600 mb-6 opacity-100">Native Android app with system integration.</p>
                    <Button 
                      className="w-full bg-gray-900 hover:bg-black text-white shadow-sm"
                      onClick={() => window.open('https://play.google.com/store/apps/details?id=com.glambook.app', '_blank')}
                    >
                      <AndroidLogo size={18} weight="fill" className="mr-2" />
                      Download Android App
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.0 }}
              className="mt-16"
            >
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-green-600 mr-2" />
                  <span>Enterprise Security</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-4 w-4 text-yellow-600 mr-2" />
                  <span>Offline Support</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 text-blue-600 mr-2" />
                  <span>Cross-Platform Sync</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-r from-rose-100/80 to-purple-100/80 backdrop-blur-xl border-rose-200/60 shadow-2xl">
              <CardContent className="p-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Ready to Transform Your Salon?
                </h2>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Join thousands of salon owners who have revolutionized their business with GlamBook. 
                  Start your free trial today.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <HolographicEntryButton 
                    onClick={onEnterDashboard}
                    size="large"
                  >
                    Start Free Trial
                  </HolographicEntryButton>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="bg-gray-50/80 backdrop-blur-md border-gray-200/60 text-gray-700 hover:bg-gray-100/80 text-lg px-12 py-4 shadow-sm"
                  >
                    Schedule Demo
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-6">
                  No credit card required • 14-day free trial • Cancel anytime
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-gray-200/60">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">GlamBook</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2025 GlamBook. All rights reserved. • The future of salon management.
          </p>
        </div>
      </footer>
    </div>
  );
}