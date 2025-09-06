import { EmailVerification } from '@/components/auth/EmailVerification';
import { EnterpriseSSO } from '@/components/auth/EnterpriseSSO';
import { LoginForm } from '@/components/auth/LoginForm';
import { PasswordReset } from '@/components/auth/PasswordReset';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { TwoFactorSetup } from '@/components/auth/TwoFactorSetup';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Award, Layers, Shield, Users, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type AuthFlow =
  | 'login'
  | 'register'
  | 'email-verification'
  | 'password-reset'
  | 'two-factor'
  | 'enterprise-sso';

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
  const showEnterpriseSSO = () => setCurrentFlow('enterprise-sso');
  const backToLogin = () => setCurrentFlow('login');

  // Rotating features for the left panel - Updated for Free Plan
  const features = [
    {
      icon: Shield,
      title: 'Free Plan Features',
      description: 'Get started with essential project management tools at no cost.',
      stats: 'Forever free',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description:
        'Up to 5 team members can collaborate on up to 3 projects with basic task management.',
      stats: '3 projects • 5 members',
    },
    {
      icon: Zap,
      title: 'AI-Powered Suggestions',
      description: 'Get 10 AI suggestions per month to boost your productivity.',
      stats: '10 AI suggestions/month',
    },
    {
      icon: Award,
      title: 'Upgrade Anytime',
      description: 'Need more? Upgrade to Professional for unlimited everything.',
      stats: 'Start at $8/month',
    },
  ];

  // Auto-rotate features every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  const currentFeatureData = features[currentFeature];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Side - Enhanced Branding */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80 lg:flex lg:w-1/2">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute left-1/4 top-1/4 h-32 w-32 rounded-full bg-white/10 blur-xl"
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/4 h-48 w-48 rounded-full bg-white/5 blur-2xl"
            animate={{
              x: [0, -20, 0],
              y: [0, 15, 0],
              scale: [1, 0.9, 1],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute right-1/3 top-1/2 h-24 w-24 rounded-full bg-white/20 blur-lg"
            animate={{
              x: [0, 15, 0],
              y: [0, -10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 flex w-full flex-col items-start justify-center p-12 text-primary-foreground">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-lg"
          >
            {/* Logo and Brand */}
            <div className="mb-8 flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-foreground/20 backdrop-blur-sm">
                <Layers className="h-7 w-7 text-primary-foreground" />
              </div>
              <span className="text-3xl font-bold">WorkflowHub</span>
            </div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="mb-6 text-4xl font-bold leading-tight lg:text-5xl">
                Transform your team&apos;s
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
                <div className="flex items-start space-x-4 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-6 backdrop-blur-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/20">
                    <currentFeatureData.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-primary-foreground">
                        {currentFeatureData.title}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="border-primary-foreground/30 bg-primary-foreground/20 text-primary-foreground"
                      >
                        {currentFeatureData.stats}
                      </Badge>
                    </div>
                    <p className="leading-relaxed text-primary-foreground/80">
                      {currentFeatureData.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Feature dots indicator */}
            <div className="mb-8 flex space-x-2">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFeature(index)}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    index === currentFeature
                      ? 'w-6 bg-primary-foreground'
                      : 'bg-primary-foreground/40 hover:bg-primary-foreground/60'
                  }`}
                />
              ))}
            </div>

            {/* Trust indicators - Updated for Free Plan */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-400">
                  <svg className="h-3 w-3 text-green-800" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-primary-foreground/80">Always free plan available</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-400">
                  <svg className="h-3 w-3 text-green-800" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-primary-foreground/80">No credit card required</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-400">
                  <svg className="h-3 w-3 text-green-800" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-primary-foreground/80">
                  Upgrade anytime for more features
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex flex-1 flex-col justify-center bg-gradient-to-b from-background to-background/95 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto w-full max-w-md"
        >
          {/* Mobile Header */}
          <div className="mb-8 text-center lg:hidden">
            <motion.div
              className="mb-4 flex items-center justify-center space-x-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Layers className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">WorkflowHub</span>
            </motion.div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Transform your team&apos;s productivity</p>
              {currentFlow !== 'login' && currentFlow !== 'register' && (
                <p className="text-xs capitalize text-muted-foreground/70">
                  {currentFlow.replace('-', ' ')}
                </p>
              )}
            </div>
          </div>

          {/* Back to Landing Link */}
          <div className="mb-6 flex items-center justify-between">
            <Link to="/landing">
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 font-normal text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to home
              </Button>
            </Link>

            {/* Back to Login/Register for sub-flows */}
            {!['login', 'register'].includes(currentFlow) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 font-normal text-muted-foreground transition-colors hover:text-foreground"
                onClick={backToLogin}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
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
                <PasswordReset onBack={backToLogin} onResetComplete={backToLogin} />
              )}

              {currentFlow === 'two-factor' && (
                <TwoFactorSetup onComplete={backToLogin} onSkip={backToLogin} />
              )}

              {currentFlow === 'enterprise-sso' && <EnterpriseSSO onBack={backToLogin} />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};
