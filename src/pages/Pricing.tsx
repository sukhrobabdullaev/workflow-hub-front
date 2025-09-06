import { AppFooter } from '@/components/layout/AppFooter';
import { LandingNavbar } from '@/components/layout/LandingNavbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  Globe,
  Headphones,
  MessageCircle,
  Shield,
  Sparkles,
  Star,
  Video,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const Pricing = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      yearlyPrice: '$0',
      period: 'forever',
      description: 'Perfect for small teams getting started',
      features: [
        { text: 'Up to 5 team members', included: true },
        { text: 'Up to 3 projects', included: true },
        { text: 'Basic task management', included: true },
        { text: 'Simple kanban boards', included: true },
        { text: 'Basic AI task suggestions', included: true },
        { text: 'Email support', included: true },
        { text: '10MB storage', included: true },
        { text: 'Basic reporting', included: true },
        { text: 'Mobile app access', included: true },
        { text: 'Real-time collaboration', included: false },
        { text: 'Advanced AI features', included: false },
        { text: 'Video recording', included: false },
      ],
      popular: false,
      buttonText: 'Get Started Free',
      buttonVariant: 'outline' as const,
    },
    {
      name: 'Professional',
      price: '$8',
      yearlyPrice: '$6',
      period: 'per user/month',
      description: 'AI-powered features for growing teams',
      features: [
        { text: 'Everything in Free', included: true },
        { text: 'Unlimited team members', included: true },
        { text: 'Unlimited projects', included: true },
        { text: 'Advanced kanban boards', included: true },
        { text: 'AI Project Assistant', included: true },
        { text: 'Smart task prioritization', included: true },
        { text: 'AI-powered time estimation', included: true },
        { text: 'Automated reporting', included: true },
        { text: 'Real-time team chat', included: true },
        { text: 'Video recording', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Time tracking', included: true },
        { text: '1GB storage per user', included: true },
        { text: 'Priority support', included: true },
      ],
      popular: true,
      buttonText: 'Start Free Trial',
      buttonVariant: 'default' as const,
    },
    {
      name: 'Enterprise',
      price: '$18',
      yearlyPrice: '$15',
      period: 'per user/month',
      description: 'Full AI suite for large organizations',
      features: [
        { text: 'Everything in Professional', included: true },
        { text: 'Advanced AI insights & predictions', included: true },
        { text: 'Burnout prevention AI', included: true },
        { text: 'Custom AI models', included: true },
        { text: 'AI meeting transcription', included: true },
        { text: 'Smart code review (dev teams)', included: true },
        { text: 'Auto-documentation generation', included: true },
        { text: 'Advanced security & compliance', included: true },
        { text: 'Single Sign-On (SSO)', included: true },
        { text: 'Custom integrations', included: true },
        { text: 'API access', included: true },
        { text: 'White-label options', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'Unlimited storage', included: true },
        { text: '24/7 phone support', included: true },
        { text: 'SLA guarantee', included: true },
      ],
      popular: false,
      buttonText: 'Contact Sales',
      buttonVariant: 'outline' as const,
    },
  ];

  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Automation',
      description: 'Smart task creation, automatic prioritization, and intelligent scheduling.',
      plans: ['Pro', 'Enterprise'],
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Deep insights into team performance and project health.',
      plans: ['Pro', 'Enterprise'],
    },
    {
      icon: MessageCircle,
      title: 'Team Collaboration',
      description: 'Real-time chat, comments, and seamless communication.',
      plans: ['Pro', 'Enterprise'],
    },
    {
      icon: Video,
      title: 'Video Recording',
      description: 'Screen recording and video messages for better communication.',
      plans: ['Pro', 'Enterprise'],
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'SOC 2 compliance, SSO, and advanced security features.',
      plans: ['Enterprise'],
    },
    {
      icon: Globe,
      title: 'Global Deployment',
      description: 'Multi-region hosting and custom deployment options.',
      plans: ['Enterprise'],
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      company: 'TechCorp',
      role: 'Product Manager',
      content:
        'WorkflowHub&apos;s Pro plan transformed our productivity. The AI features save us hours every week.',
      avatar: '/api/placeholder/48/48',
    },
    {
      name: 'Marcus Rodriguez',
      company: 'StartupXYZ',
      role: 'CEO',
      content: 'Best value for money in project management. More features than tools 3x the price.',
      avatar: '/api/placeholder/48/48',
    },
  ];

  const faqs = [
    {
      question: 'Can I change plans anytime?',
      answer:
        'Yes! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately, and we&apos;ll prorate any billing adjustments.',
    },
    {
      question: 'Is there a free trial?',
      answer:
        'Absolutely! All paid plans come with a 14-day free trial. No credit card required to start.',
    },
    {
      question: 'What happens to my data if I cancel?',
      answer:
        'Your data remains accessible for 30 days after cancellation. You can export everything during this period.',
    },
    {
      question: 'Do you offer discounts for nonprofits?',
      answer:
        'Yes! We offer 50% discounts for qualified nonprofits and educational institutions. Contact us for details.',
    },
    {
      question: 'Can I get a custom enterprise plan?',
      answer:
        'Definitely! We work with enterprise customers to create custom plans that fit their specific needs and scale.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar isScrolled={isScrolled} />

      {/* Hero Section */}
      <section className="px-4 pb-20 pt-32">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-4xl"
          >
            <Badge className="mb-6 border-primary/20 bg-primary/10 px-4 py-2 text-primary">
              <Sparkles className="mr-2 h-4 w-4" />
              Transparent Pricing
            </Badge>

            <h1 className="mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
              More AI features,
              <span className="text-primary"> better pricing</span>
            </h1>

            <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-muted-foreground">
              Get advanced AI-powered project management at a fraction of the cost of competitors.
              Start free, scale smart.
            </p>

            {/* Billing Toggle */}
            <div className="mb-12 flex items-center justify-center gap-4">
              <span
                className={billingCycle === 'monthly' ? 'font-semibold' : 'text-muted-foreground'}
              >
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-primary transition ${
                    billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span
                className={billingCycle === 'yearly' ? 'font-semibold' : 'text-muted-foreground'}
              >
                Yearly
              </span>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Save 25%
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 pb-20">
        <div className="container mx-auto">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  className={`relative h-full ${plan.popular ? 'scale-105 border-primary shadow-xl ring-1 ring-primary/20' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                      <Badge className="bg-gradient-to-r from-primary to-primary/80 px-4 py-1 text-white">
                        <Star className="mr-1 h-3 w-3" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pb-4 text-center">
                    <CardTitle className="mb-2 text-2xl">{plan.name}</CardTitle>
                    <div className="mb-4">
                      <span className="text-4xl font-bold">
                        {billingCycle === 'yearly' ? plan.yearlyPrice : plan.price}
                      </span>
                      {plan.price !== '$0' && (
                        <>
                          <span className="text-muted-foreground">/{plan.period}</span>
                          {billingCycle === 'yearly' && (
                            <div className="mt-1 text-sm text-green-600">
                              Save $
                              {parseInt(plan.price.slice(1)) - parseInt(plan.yearlyPrice.slice(1))}
                              /month
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <ul className="mb-8 space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <CheckCircle
                            className={`mt-0.5 h-5 w-5 flex-shrink-0 ${
                              feature.included ? 'text-green-500' : 'text-muted-foreground/30'
                            }`}
                          />
                          <span
                            className={feature.included ? '' : 'text-muted-foreground line-through'}
                          >
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Link to="/auth" className="block">
                      <Button
                        className={`w-full ${plan.popular ? 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70' : ''}`}
                        variant={plan.buttonVariant}
                        size="lg"
                      >
                        {plan.buttonText}
                        {plan.buttonText.includes('Trial') && (
                          <ArrowRight className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="bg-muted/30 px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">Feature Highlights</h2>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
              See what makes WorkflowHub the smartest choice for modern teams.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="mb-4 flex items-center gap-4">
                      <div className="rounded-xl bg-primary/10 p-3">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex gap-2">
                        {feature.plans.map(planName => (
                          <Badge key={planName} variant="secondary" className="text-xs">
                            {planName}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">Loved by teams worldwide</h2>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
              Join thousands of teams who have made the smart choice.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
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
                    <p className="mb-6 text-lg">&quot;{testimonial.content}&quot;</p>
                    <div className="flex items-center gap-3">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="h-12 w-12 rounded-full"
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

      {/* FAQ Section */}
      <section className="bg-muted/30 px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">Frequently Asked Questions</h2>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
              Everything you need to know about our pricing and plans.
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
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
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Ready to supercharge your workflow?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
              Start your free trial today. No credit card required, cancel anytime.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/auth">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline">
                  <Headphones className="mr-2 h-4 w-4" />
                  Talk to Sales
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <AppFooter />
    </div>
  );
};
