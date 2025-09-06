import { DemoVideo } from '@/components/DemoVideo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  Layers,
  MessageCircle,
  Shield,
  Star,
  Video,
  Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const Landing = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const pricingRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const featuresInView = useInView(featuresRef, { once: true });
  const pricingInView = useInView(pricingRef, { once: true });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Product Manager',
      company: 'TechCorp',
      content:
        "WorkflowHub transformed how our team collaborates. We've increased productivity by 40%.",
      avatar: '/api/placeholder/48/48',
    },
    {
      name: 'David Rodriguez',
      role: 'Engineering Lead',
      company: 'StartupXYZ',
      content: "The best project management tool we've used. Clean interface, powerful features.",
      avatar: '/api/placeholder/48/48',
    },
    {
      name: 'Emily Watson',
      role: 'Operations Director',
      company: 'GlobalInc',
      content: 'Finally, a tool that scales with our growing team. Excellent support and features.',
      avatar: '/api/placeholder/48/48',
    },
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for small teams getting started',
      features: [
        'Up to 5 team members',
        'Up to 3 projects',
        'Basic task management',
        'Simple kanban boards',
        'Basic AI task suggestions',
        'Email support',
        '10MB storage',
        'Basic reporting',
      ],
      popular: false,
      buttonText: 'Get Started Free',
    },
    {
      name: 'Professional',
      price: '$8',
      period: 'per user/month',
      description: 'AI-powered features for growing teams',
      features: [
        'Unlimited team members',
        'Unlimited projects',
        'Unlimited tasks',
        'Advanced kanban boards',
        'AI Project Assistant',
        'Smart task prioritization',
        'AI-powered time estimation',
        'Automated reporting',
        'Real-time team chat',
        'Video recording',
        'Live updates & notifications',
        'Advanced analytics with AI insights',
        'Time tracking',
        '1GB storage per user',
        'Priority support',
      ],
      popular: true,
      buttonText: 'Start Free Trial',
    },
    {
      name: 'Enterprise',
      price: '$18',
      period: 'per user/month',
      description: 'Full AI suite for large organizations',
      features: [
        'Everything in Professional',
        'Advanced AI insights & predictions',
        'Burnout prevention AI',
        'Custom AI models',
        'AI meeting transcription',
        'Smart code review (for dev teams)',
        'Auto-documentation generation',
        'Advanced security & compliance',
        'Single Sign-On (SSO)',
        'Custom integrations',
        'API access',
        'White-label options',
        'Advanced user permissions',
        'Dedicated account manager',
        'Custom deployment',
        'Unlimited storage',
        '24/7 phone support',
        'SLA guarantee',
      ],
      popular: false,
      buttonText: 'Contact Sales',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? 'border-b bg-background/95 backdrop-blur-sm' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Layers className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">WorkflowHub</span>
          </div>

          <div className="hidden items-center space-x-8 md:flex">
            <a
              href="#features"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Testimonials
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-primary text-primary-foreground hover:bg-primary-hover">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section ref={heroRef} className="px-4 pb-20 pt-32">
        <div className="container mx-auto text-center">
          <motion.div
            initial="initial"
            animate={heroInView ? 'animate' : 'initial'}
            variants={staggerContainer}
            className="mx-auto max-w-4xl"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-6 border-primary/20 bg-primary/10 px-4 py-2 text-primary">
                🚀 Smart Workflow: Intelligent project management that adapts to your team
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="mb-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-4xl font-bold text-transparent dark:from-gray-100 dark:via-gray-200 dark:to-gray-400 md:text-6xl lg:text-7xl"
            >
              Project management
              <br />
              <span className="text-primary">reimagined</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-muted-foreground md:text-2xl"
            >
              The smartest project management platform with intelligent features that predict,
              optimize, and automate your workflow. More powerful features at competitive pricing.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link to="/auth">
                <Button
                  size="lg"
                  className="bg-primary px-8 py-6 text-lg text-primary-foreground hover:bg-primary-hover"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <DemoVideo />
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex items-center justify-center space-x-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                14-day free trial
              </div>
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Cancel anytime
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Demo Animation */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="container mx-auto mt-16"
        >
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-3xl"></div>
            <div className="relative overflow-hidden rounded-2xl border bg-card shadow-2xl">
              <div className="flex items-center space-x-2 border-b bg-muted/50 p-4">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <div className="ml-4 text-sm text-muted-foreground">WorkflowHub Dashboard</div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="space-y-4"
                  >
                    <div className="h-4 w-3/4 rounded bg-primary/30"></div>
                    <div className="h-20 rounded-lg border border-primary/20 bg-primary/10"></div>
                    <div className="h-4 w-1/2 rounded bg-green-300"></div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                    className="space-y-4"
                  >
                    <div className="h-4 w-2/3 rounded bg-primary/40"></div>
                    <div className="h-20 rounded-lg border border-primary/25 bg-primary/15"></div>
                    <div className="h-4 w-3/4 rounded bg-orange-300"></div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="space-y-4"
                  >
                    <div className="h-4 w-1/2 rounded bg-primary/20"></div>
                    <div className="h-20 rounded-lg border border-primary/15 bg-primary/5"></div>
                    <div className="h-4 w-2/3 rounded bg-pink-300"></div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Smart Features Banner */}
      <section className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 px-4 py-16 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-purple-950/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="mb-6 flex items-center justify-center gap-2">
              <Zap className="h-8 w-8 text-primary" />
              <h2 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
                Intelligent Project Management
              </h2>
            </div>
            <p className="mx-auto mb-12 max-w-3xl text-lg text-muted-foreground">
              Advanced features that help your team work smarter, not harder. Powerful automation
              and insights at an affordable price.
            </p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="rounded-xl bg-white/60 p-6 backdrop-blur-sm dark:bg-gray-800/60"
              >
                <Zap className="mx-auto mb-4 h-12 w-12 text-blue-600" />
                <h3 className="mb-2 text-xl font-semibold">Smart Project Assistant</h3>
                <p className="text-muted-foreground">
                  Intelligent suggestions and auto-generated templates
                </p>
                <div className="mt-3 text-sm font-medium text-blue-600">Pro: $8/user</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="rounded-xl bg-white/60 p-6 backdrop-blur-sm dark:bg-gray-800/60"
              >
                <BarChart3 className="mx-auto mb-4 h-12 w-12 text-purple-600" />
                <h3 className="mb-2 text-xl font-semibold">Predictive Analytics</h3>
                <p className="text-muted-foreground">
                  Smart insights and proactive recommendations
                </p>
                <div className="mt-3 text-sm font-medium text-purple-600">Pro: $8/user</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="rounded-xl bg-white/60 p-6 backdrop-blur-sm dark:bg-gray-800/60"
              >
                <MessageCircle className="mx-auto mb-4 h-12 w-12 text-green-600" />
                <h3 className="mb-2 text-xl font-semibold">Smart Communication</h3>
                <p className="text-muted-foreground">
                  Auto-summarize discussions into action items
                </p>
                <div className="mt-3 text-sm font-medium text-green-600">Pro: $8/user</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="rounded-xl bg-white/60 p-6 backdrop-blur-sm dark:bg-gray-800/60"
              >
                <CheckCircle className="mx-auto mb-4 h-12 w-12 text-orange-600" />
                <h3 className="mb-2 text-xl font-semibold">Intelligent Automation</h3>
                <p className="text-muted-foreground">
                  Auto-prioritize tasks and estimate timelines
                </p>
                <div className="mt-3 text-sm font-medium text-orange-600">Pro: $8/user</div>
              </motion.div>
            </div>

            {/* Value Proposition */}
            <div className="mt-12 rounded-xl bg-white/80 p-6 backdrop-blur-sm dark:bg-gray-800/80">
              <h3 className="mb-4 text-xl font-semibold">Everything Your Team Needs</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-lg font-semibold text-primary">Advanced Features</div>
                  <div className="text-sm text-muted-foreground">
                    Intelligent automation & insights
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-primary">Fair Pricing</div>
                  <div className="text-sm text-muted-foreground">No hidden fees or surprises</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-primary">Great Support</div>
                  <div className="text-sm text-muted-foreground">
                    Dedicated team to help you succeed
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="px-4 py-20">
        <div className="container mx-auto">
          <motion.div
            initial="initial"
            animate={featuresInView ? 'animate' : 'initial'}
            variants={staggerContainer}
            className="mb-16 text-center"
          >
            <motion.h2 variants={fadeInUp} className="mb-6 text-3xl font-bold md:text-5xl">
              Intelligent Features That Set Us Apart
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mx-auto max-w-3xl text-xl text-muted-foreground"
            >
              Advanced intelligent capabilities at a fraction of the cost. More smart insights than
              competitors, better pricing than the rest.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate={featuresInView ? 'animate' : 'initial'}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            <motion.div variants={fadeInUp}>
              <Card className="h-full border-0 bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg dark:from-blue-950/50 dark:to-indigo-950/50">
                <CardHeader>
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white">
                    <BarChart3 className="h-8 w-8" />
                  </div>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Smart Kanban Boards</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      Free
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    AI-enhanced kanban boards with automatic task prioritization and smart
                    suggestions for workflow optimization.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="h-full border-0 bg-gradient-to-br from-green-50 to-emerald-50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg dark:from-green-950/50 dark:to-emerald-950/50">
                <CardHeader>
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-600 text-white">
                    <MessageCircle className="h-8 w-8" />
                  </div>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">AI-Powered Team Chat</CardTitle>
                    <Badge variant="default" className="bg-primary text-xs">
                      Pro
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    Smart chat that auto-summarizes discussions, extracts action items, and suggests
                    relevant team members.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="h-full border-0 bg-gradient-to-br from-purple-50 to-pink-50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg dark:from-purple-950/50 dark:to-pink-950/50">
                <CardHeader>
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600 text-white">
                    <Video className="h-8 w-8" />
                  </div>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Smart Recording</CardTitle>
                    <Badge variant="default" className="bg-primary text-xs">
                      Pro
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    AI-enhanced video recording with automatic transcription and action item
                    extraction from meetings.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="h-full border-0 bg-gradient-to-br from-orange-50 to-red-50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg dark:from-orange-950/50 dark:to-red-950/50">
                <CardHeader>
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-600 text-white">
                    <Zap className="h-8 w-8" />
                  </div>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Predictive Insights</CardTitle>
                    <Badge variant="default" className="bg-primary text-xs">
                      Pro
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    AI predicts project timelines, identifies bottlenecks, and warns about potential
                    burnout before it happens.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="h-full border-0 bg-gradient-to-br from-cyan-50 to-blue-50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg dark:from-cyan-950/50 dark:to-blue-950/50">
                <CardHeader>
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-600 text-white">
                    <BarChart3 className="h-8 w-8" />
                  </div>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">AI Analytics</CardTitle>
                    <Badge variant="default" className="bg-primary text-xs">
                      Pro
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    Advanced AI-driven analytics that auto-generate insights, reports, and
                    recommendations for team performance.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="h-full border-0 bg-gradient-to-br from-emerald-50 to-teal-50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg dark:from-emerald-950/50 dark:to-teal-950/50">
                <CardHeader>
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                    <Shield className="h-8 w-8" />
                  </div>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Smart Automation</CardTitle>
                    <Badge variant="default" className="bg-primary text-xs">
                      Pro
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    AI-powered automation that learns your team&apos;s patterns and suggests optimal
                    workflows and task assignments.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-5xl">Loved by teams worldwide</h2>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
              Join thousands of teams who have transformed their workflow with WorkflowHub.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="mb-4 flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="mb-6 text-lg leading-relaxed">
                      &quot;{testimonial.content}&quot;
                    </p>
                    <div className="flex items-center">
                      <img
                        src={`${testimonial.avatar}`}
                        alt={`${testimonial.name} avatar`}
                        className="mr-4 h-12 w-12 rounded-full"
                      />
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role} at {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" ref={pricingRef} className="bg-muted/30 px-4 py-20">
        <div className="container mx-auto">
          <motion.div
            initial="initial"
            animate={pricingInView ? 'animate' : 'initial'}
            variants={staggerContainer}
            className="mb-16 text-center"
          >
            <motion.h2 variants={fadeInUp} className="mb-6 text-3xl font-bold md:text-5xl">
              Better AI, Better Price
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mx-auto max-w-3xl text-xl text-muted-foreground"
            >
              More AI features than Jira or ClickUp at a lower price. Start free, scale smart.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate={pricingInView ? 'animate' : 'initial'}
            className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3"
          >
            {pricingPlans.map((plan, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card
                  className={`relative h-full ${plan.popular ? 'scale-105 border-primary shadow-xl' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 transform">
                      <Badge className="bg-primary px-4 py-1 text-primary-foreground">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.price !== 'Custom' && (
                        <span className="text-muted-foreground">/{plan.period}</span>
                      )}
                    </div>
                    <CardDescription className="mt-2">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="mr-3 h-5 w-5 flex-shrink-0 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/auth" className="mt-8 block">
                      <Button
                        className={`w-full ${plan.popular ? 'bg-primary text-primary-foreground hover:bg-primary-hover' : ''}`}
                        variant={plan.popular ? 'default' : 'outline'}
                        size="lg"
                      >
                        {plan.buttonText}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl"
          >
            <h2 className="mb-6 text-3xl font-bold md:text-5xl">
              Ready to transform your workflow?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
              Start with our free plan and scale up as your team grows. Join thousands of teams
              already using WorkflowHub to boost productivity.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/auth">
                <Button
                  size="lg"
                  className="bg-primary px-8 py-6 text-lg text-primary-foreground hover:bg-primary-hover"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                View Pricing
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted px-4 py-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Layers className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">WorkflowHub</span>
              </div>
              <p className="text-muted-foreground">
                The future of team collaboration and project management.
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 WorkflowHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
