import { AppFooter } from '@/components/layout/AppFooter';
import { LandingNavbar } from '@/components/layout/LandingNavbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Globe,
  Heart,
  Rocket,
  Shield,
  Sparkles,
  Target,
  Users,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const About = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const values = [
    {
      icon: Heart,
      title: 'People First',
      description:
        'We believe great products come from happy, empowered teams. Every feature we build starts with understanding real human needs.',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description:
        "We push the boundaries of what's possible with AI and automation to create genuinely helpful tools that save time and reduce stress.",
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description:
        'Your data and privacy are sacred. We maintain the highest standards of security and transparency in everything we do.',
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description:
        "We're building tools that help teams around the world collaborate better, regardless of timezone, language, or location.",
    },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Co-founder',
      bio: 'Former VP of Product at Slack. Led teams of 200+ people across 15 countries.',
      image: '/api/placeholder/300/300',
      linkedin: '#',
    },
    {
      name: 'Marcus Chen',
      role: 'CTO & Co-founder',
      bio: 'Ex-Google AI researcher. 10+ years building scalable systems and ML infrastructure.',
      image: '/api/placeholder/300/300',
      linkedin: '#',
    },
    {
      name: 'Elena Rodriguez',
      role: 'Head of Design',
      bio: 'Former Design Lead at Figma. Passionate about creating intuitive, beautiful experiences.',
      image: '/api/placeholder/300/300',
      linkedin: '#',
    },
    {
      name: 'David Kim',
      role: 'Head of Engineering',
      bio: 'Previously at Microsoft Azure. Expert in distributed systems and cloud infrastructure.',
      image: '/api/placeholder/300/300',
      linkedin: '#',
    },
  ];

  const stats = [
    { number: '50K+', label: 'Active Teams' },
    { number: '2M+', label: 'Projects Managed' },
    { number: '99.9%', label: 'Uptime' },
    { number: '150+', label: 'Countries' },
  ];

  const milestones = [
    {
      year: '2023',
      title: 'Founded',
      description:
        'Started with a simple idea: make project management actually helpful, not overwhelming.',
    },
    {
      year: '2024',
      title: 'AI-Powered',
      description:
        'Launched our first AI features, helping teams predict and prevent project bottlenecks.',
    },
    {
      year: '2024',
      title: 'Global Scale',
      description: 'Reached 50,000+ teams across 150+ countries using WorkflowHub daily.',
    },
    {
      year: '2025',
      title: 'Enterprise Ready',
      description:
        'Launched enterprise features with advanced security and compliance capabilities.',
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
              Our Story
            </Badge>

            <h1 className="mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
              Building the future of
              <span className="text-primary"> teamwork</span>
            </h1>

            <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-muted-foreground">
              We&apos;re on a mission to eliminate the chaos of project management and replace it
              with intelligent, human-centered tools that actually help teams thrive.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/careers">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Join Our Team
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="mb-2 text-3xl font-bold text-primary md:text-4xl">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="mb-6 flex items-center gap-2">
                <Target className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold md:text-4xl">Our Mission</h2>
              </div>
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                Project management shouldn&apos;t feel like a chore. It should feel like having a
                smart assistant that anticipates your needs, prevents problems before they happen,
                and helps your team focus on what they do best.
              </p>
              <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                We&apos;re building AI-powered tools that understand the nuances of teamwork – the
                deadlines, the personalities, the unexpected changes – and help teams navigate them
                with confidence.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Eliminate busywork with intelligent automation</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Predict and prevent project bottlenecks</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Foster genuine team collaboration</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 blur-3xl"></div>
              <div className="relative rounded-3xl border bg-card p-8 shadow-lg">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <Rocket className="mx-auto mb-3 h-12 w-12 text-primary" />
                    <h3 className="mb-2 font-semibold">Innovation</h3>
                    <p className="text-sm text-muted-foreground">Pushing boundaries with AI</p>
                  </div>
                  <div className="text-center">
                    <Users className="mx-auto mb-3 h-12 w-12 text-primary" />
                    <h3 className="mb-2 font-semibold">People</h3>
                    <p className="text-sm text-muted-foreground">Human-centered design</p>
                  </div>
                  <div className="text-center">
                    <Shield className="mx-auto mb-3 h-12 w-12 text-primary" />
                    <h3 className="mb-2 font-semibold">Security</h3>
                    <p className="text-sm text-muted-foreground">Enterprise-grade protection</p>
                  </div>
                  <div className="text-center">
                    <Globe className="mx-auto mb-3 h-12 w-12 text-primary" />
                    <h3 className="mb-2 font-semibold">Global</h3>
                    <p className="text-sm text-muted-foreground">Worldwide collaboration</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-muted/30 px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">Our Values</h2>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
              These principles guide every decision we make and every feature we build.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="rounded-xl bg-primary/10 p-3">
                        <value.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{value.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">Our Journey</h2>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
              From a simple idea to helping teams worldwide collaborate better.
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-6 pb-12 last:pb-0"
              >
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {milestone.year}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="mt-4 h-16 w-0.5 bg-border"></div>
                  )}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="mb-2 text-xl font-semibold">{milestone.title}</h3>
                  <p className="leading-relaxed text-muted-foreground">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-muted/30 px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">Meet Our Team</h2>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
              We&apos;re a diverse group of designers, engineers, and product people who believe
              great tools come from great teams.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 bg-card/50 text-center backdrop-blur-sm">
                  <CardHeader>
                    <div className="relative mx-auto mb-4 h-24 w-24">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    </div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription className="font-medium text-primary">
                      {member.role}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
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
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">Ready to join our mission?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
              Whether you&apos;re looking to use our product or join our team, we&apos;d love to
              hear from you.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/auth">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Try WorkflowHub Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/careers">
                <Button size="lg" variant="outline">
                  View Open Positions
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
