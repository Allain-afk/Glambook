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
  Star
} from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-pink-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">GlamBook</span>
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
                className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-6 bg-gradient-to-r from-pink-500/20 to-purple-600/20 text-pink-300 border-pink-500/30">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered Salon Management
              </Badge>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Transform Your
                <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  {" "}Salon Business
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
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
                  className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 text-lg px-8 py-4"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-gray-400">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
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
              className="relative"
            >
              <div className="relative">
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 overflow-hidden">
                  <CardContent className="p-0">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1736580602029-78afd910cbf8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzYWxvbiUyMGludGVyaW9yJTIwbHV4dXJ5fGVufDF8fHx8MTc1Njg3OTk3M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Modern salon interior"
                      className="w-full h-96 object-cover"
                    />
                  </CardContent>
                </Card>

                {/* Floating cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="absolute -top-4 -left-4"
                >
                  <Card className="bg-gradient-to-r from-pink-500/90 to-purple-600/90 backdrop-blur-md border-white/20">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 text-white">
                        <Heart className="h-5 w-5" />
                        <span className="font-medium">Client Satisfaction</span>
                      </div>
                      <div className="text-2xl font-bold text-white mt-1">98%</div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="absolute -bottom-4 -right-4"
                >
                  <Card className="bg-gradient-to-r from-blue-500/90 to-indigo-600/90 backdrop-blur-md border-white/20">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 text-white">
                        <BarChart3 className="h-5 w-5" />
                        <span className="font-medium">Revenue Growth</span>
                      </div>
                      <div className="text-2xl font-bold text-white mt-1">+127%</div>
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
            <Badge className="mb-4 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 text-blue-300 border-blue-500/30">
              <Zap className="h-3 w-3 mr-1" />
              Powerful Features
            </Badge>
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need to <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Succeed</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
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
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="text-pink-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Badge className="mb-6 bg-gradient-to-r from-green-500/20 to-emerald-600/20 text-green-300 border-green-500/30">
              <Smartphone className="h-3 w-3 mr-1" />
              Mobile First
            </Badge>
            
            <h2 className="text-4xl font-bold text-white mb-6">
              Take GlamBook <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Everywhere</span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Download our mobile app or install the progressive web app for a native experience on any device.
            </p>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {/* PWA Install */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Globe className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">Progressive Web App</h3>
                    <p className="text-gray-300 mb-6">Install directly from your browser for instant access.</p>
                    {isInstallable && !isInstalled ? (
                      <Button 
                        onClick={installApp}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Install Now
                      </Button>
                    ) : (
                      <Button 
                        disabled
                        className="w-full bg-gray-600 text-gray-300"
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
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Apple className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">iOS App Store</h3>
                    <p className="text-gray-300 mb-6">Native iOS app with full device integration.</p>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                      onClick={() => window.open('https://apps.apple.com/app/glambook', '_blank')}
                    >
                      <Apple className="h-4 w-4 mr-2" />
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
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Smartphone className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">Google Play Store</h3>
                    <p className="text-gray-300 mb-6">Native Android app with system integration.</p>
                    <Button 
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                      onClick={() => window.open('https://play.google.com/store/apps/details?id=com.glambook.app', '_blank')}
                    >
                      <Smartphone className="h-4 w-4 mr-2" />
                      Download Android App
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-16"
            >
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-400">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-green-400 mr-2" />
                  <span>Enterprise Security</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-4 w-4 text-yellow-400 mr-2" />
                  <span>Offline Support</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 text-blue-400 mr-2" />
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
            <Card className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 backdrop-blur-xl border-pink-500/30">
              <CardContent className="p-12">
                <h2 className="text-4xl font-bold text-white mb-6">
                  Ready to Transform Your Salon?
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
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
                    className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 text-lg px-12 py-4"
                  >
                    Schedule Demo
                  </Button>
                </div>
                <p className="text-sm text-gray-400 mt-6">
                  No credit card required • 14-day free trial • Cancel anytime
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">GlamBook</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 GlamBook. All rights reserved. • The future of salon management.
          </p>
        </div>
      </footer>
    </div>
  );
}