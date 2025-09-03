import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { TwoFactorSetup } from '@/components/auth/TwoFactorSetup';
import { EmailVerification } from '@/components/auth/EmailVerification';
import { PasswordReset } from '@/components/auth/PasswordReset';
import { EnterpriseSSO } from '@/components/auth/EnterpriseSSO';
import { Layers, ArrowLeft, Shield, Users, Zap, Award, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

type AuthFlow = 'login' | 'register' | 'email-verification' | 'password-reset' | 'two-factor' | 'enterprise-sso';

export const Auth = () => {
  const [currentFlow, setCurrentFlow] = useState<AuthFlow>('login');
  const [userEmail, setUserEmail] = useState('');
  const [currentFeature, setCurrentFeature] = useState(0);

  // Helper functions for flow navigation
  const toggleMode = () => setCurrentFlow(currentFlow === 'login' ? 'register' : 'login');
  const showPasswordReset = () => setCurrentFlow('password-reset');
  const showEmailVerification = (email: string) => {
    setUserEmail(email);
    setCurrentFlow('email-verification');
  };
  const showTwoFactor = () => setCurrentFlow('two-factor');
  const showEnterpriseSSO = () => setCurrentFlow('enterprise-sso');
  const backToLogin = () => setCurrentFlow('login');

  // Rotating features for the left panel
  const features = [
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level encryption, SSO, SAML, and compliance features to keep your data safe.',
      stats: '99.9% uptime'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Real-time collaboration tools that bring your team together, wherever they are.',
      stats: '50% faster delivery'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance with instant loading and real-time updates.',
      stats: '<100ms response'
    },
    {
      icon: Award,
      title: 'Industry Leading',
      description: 'Trusted by Fortune 500 companies and growing startups worldwide.',
      stats: '100k+ teams'
    }
  ];

  // Auto-rotate features every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentFeatureData = features[currentFeature];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Enhanced Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary to-primary/80 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl"
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl"
            animate={{
              x: [0, -20, 0],
              y: [0, 15, 0],
              scale: [1, 0.9, 1]
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-1/2 right-1/3 w-24 h-24 bg-white/20 rounded-full blur-lg"
            animate={{
              x: [0, 15, 0],
              y: [0, -10, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 flex flex-col justify-center items-start p-12 text-primary-foreground w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-lg"
          >
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-primary-foreground/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Layers className="w-7 h-7 text-primary-foreground" />
              </div>
              <span className="text-3xl font-bold">WorkflowHub</span>
            </div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Transform your team's
                <br />
                <span className="text-primary-foreground/80">productivity</span>
              </h1>
            </motion.div>

            {/* Rotating Feature */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <div className="flex items-start space-x-4 p-6 bg-primary-foreground/10 backdrop-blur-sm rounded-2xl border border-primary-foreground/20">
                  <div className="w-12 h-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
                    <currentFeatureData.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-primary-foreground">
                        {currentFeatureData.title}
                      </h3>
                      <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
                        {currentFeatureData.stats}
                      </Badge>
                    </div>
                    <p className="text-primary-foreground/80 leading-relaxed">
                      {currentFeatureData.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Feature dots indicator */}
            <div className="flex space-x-2 mb-8">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFeature(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentFeature
                    ? 'bg-primary-foreground w-6'
                    : 'bg-primary-foreground/40 hover:bg-primary-foreground/60'
                    }`}
                />
              ))}
            </div>

            {/* Trust indicators */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-800" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-primary-foreground/80">Free 14-day trial</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-800" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-primary-foreground/80">No credit card required</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-800" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-primary-foreground/80">Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-background/95">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md mx-auto"
        >
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <motion.div
              className="flex items-center justify-center space-x-2 mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Layers className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">WorkflowHub</span>
            </motion.div>
            <div className="space-y-1">
              <p className="text-muted-foreground">
                Transform your team's productivity
              </p>
              {currentFlow !== 'login' && currentFlow !== 'register' && (
                <p className="text-xs text-muted-foreground/70 capitalize">
                  {currentFlow.replace('-', ' ')}
                </p>
              )}
            </div>
          </div>

          {/* Back to Landing Link */}
          <div className="mb-6 flex items-center justify-between">
            <Link to="/landing">
              <Button variant="ghost" size="sm" className="p-0 h-auto font-normal text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to home
              </Button>
            </Link>

            {/* Back to Login/Register for sub-flows */}
            {!['login', 'register'].includes(currentFlow) && (
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto font-normal text-muted-foreground hover:text-foreground transition-colors"
                onClick={backToLogin}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to sign in
              </Button>
            )}
          </div>

          {/* Form Container */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFlow}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentFlow === 'login' && (
                <LoginForm
                  onToggleMode={toggleMode}
                  onForgotPassword={showPasswordReset}
                  onEnterpriseSSO={showEnterpriseSSO}
                />
              )}

              {currentFlow === 'register' && (
                <RegisterForm
                  onToggleMode={toggleMode}
                  onRegistrationComplete={showEmailVerification}
                  onEnterpriseSSO={showEnterpriseSSO}
                />
              )}

              {currentFlow === 'email-verification' && (
                <EmailVerification
                  email={userEmail}
                  onBack={backToLogin}
                  onVerificationComplete={() => setCurrentFlow('two-factor')}
                />
              )}

              {currentFlow === 'password-reset' && (
                <PasswordReset
                  onBack={backToLogin}
                  onResetComplete={backToLogin}
                />
              )}

              {currentFlow === 'two-factor' && (
                <TwoFactorSetup
                  onComplete={backToLogin}
                  onSkip={backToLogin}
                />
              )}

              {currentFlow === 'enterprise-sso' && (
                <EnterpriseSSO
                  onBack={backToLogin}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};