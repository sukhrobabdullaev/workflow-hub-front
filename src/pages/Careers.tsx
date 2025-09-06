import { AppFooter } from '@/components/layout/AppFooter';
import { LandingNavbar } from '@/components/layout/LandingNavbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Briefcase,
  Clock,
  Coffee,
  DollarSign,
  GraduationCap,
  Heart,
  Laptop,
  MapPin,
  Plane,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const Careers = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openPositions = [
    {
      title: 'Senior Frontend Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA / Remote',
      type: 'Full-time',
      salary: '$140k - $180k',
      description:
        'Build beautiful, responsive user interfaces using React, TypeScript, and modern web technologies.',
      requirements: ['5+ years React experience', 'TypeScript proficiency', 'UI/UX sensibility'],
      posted: '2 days ago',
    },
    {
      title: 'AI/ML Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      salary: '$160k - $220k',
      description:
        'Develop and deploy machine learning models to power our intelligent project management features.',
      requirements: ['ML/AI expertise', 'Python/TensorFlow', 'Production ML systems'],
      posted: '1 week ago',
    },
    {
      title: 'Product Designer',
      department: 'Design',
      location: 'New York, NY / Remote',
      type: 'Full-time',
      salary: '$120k - $160k',
      description:
        'Create intuitive, delightful user experiences that help teams collaborate more effectively.',
      requirements: ['5+ years product design', 'Figma expertise', 'Design systems experience'],
      posted: '3 days ago',
    },
    {
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Remote',
      type: 'Full-time',
      salary: '$80k - $120k',
      description:
        'Help our customers achieve success with WorkflowHub and drive product adoption.',
      requirements: ['SaaS experience', 'Customer-first mindset', 'Strong communication'],
      posted: '1 week ago',
    },
    {
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'London, UK / Remote',
      type: 'Full-time',
      salary: '£80k - £120k',
      description:
        'Build and maintain scalable infrastructure to support millions of users worldwide.',
      requirements: ['AWS/GCP experience', 'Kubernetes', 'Infrastructure as Code'],
      posted: '4 days ago',
    },
    {
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time',
      salary: '$90k - $130k',
      description:
        'Drive growth through content marketing, demand generation, and strategic partnerships.',
      requirements: ['B2B SaaS marketing', 'Content strategy', 'Growth marketing'],
      posted: '5 days ago',
    },
  ];

  const benefits = [
    {
      icon: Heart,
      title: 'Health & Wellness',
      description:
        'Comprehensive health, dental, and vision insurance. Mental health support and wellness stipends.',
    },
    {
      icon: Coffee,
      title: 'Flexible Work',
      description:
        'Work from anywhere with flexible hours. We care about results, not when or where you work.',
    },
    {
      icon: Laptop,
      title: 'Equipment & Setup',
      description:
        'Top-of-the-line equipment and a $2,000 home office setup budget to create your ideal workspace.',
    },
    {
      icon: Plane,
      title: 'Time Off & Travel',
      description:
        'Unlimited PTO, sabbatical program, and annual team retreats in amazing locations.',
    },
    {
      icon: GraduationCap,
      title: 'Learning & Growth',
      description:
        '$3,000 annual learning budget for courses, conferences, books, and professional development.',
    },
    {
      icon: Shield,
      title: 'Financial Security',
      description:
        'Competitive equity package, 401(k) matching, and life insurance to secure your future.',
    },
  ];

  const values = [
    {
      title: 'Customer Obsession',
      description:
        'We start with the customer and work backwards. Every decision we make should benefit our users.',
    },
    {
      title: 'Ownership',
      description:
        'We act like owners. We take responsibility, think long-term, and never say "that\'s not my job."',
    },
    {
      title: 'Innovation',
      description:
        "We embrace new ideas and aren't afraid to fail. The best solutions often come from unexpected places.",
    },
    {
      title: 'Inclusion',
      description:
        'We believe diverse teams build better products. Everyone should feel valued and heard.',
    },
  ];

  const departments = [
    'All',
    'Engineering',
    'Design',
    'Product',
    'Marketing',
    'Customer Success',
    'Sales',
  ];
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  const filteredPositions =
    selectedDepartment === 'All'
      ? openPositions
      : openPositions.filter(position => position.department === selectedDepartment);

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
              We&apos;re Hiring!
            </Badge>

            <h1 className="mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
              Build the future of
              <span className="text-primary"> teamwork</span>
            </h1>

            <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-muted-foreground">
              Join our mission to revolutionize how teams collaborate. We&apos;re building
              intelligent tools that help millions of people work better together.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                <a href="#positions">
                  View Open Positions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Link to="/about">
                <Button size="lg" variant="outline">
                  Learn About Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {[
              { number: '50+', label: 'Team Members' },
              { number: '15+', label: 'Countries' },
              { number: '$50M', label: 'Series A Funding' },
              { number: '4.9/5', label: 'Employee Rating' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
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

      {/* Values Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">Our Values</h2>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
              These principles guide everything we do and help us build an amazing place to work.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
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
                    <CardTitle className="text-xl">{value.title}</CardTitle>
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

      {/* Benefits Section */}
      <section className="bg-muted/30 px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Why You&apos;ll Love Working Here
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
              We believe in taking care of our team so they can do their best work.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 bg-card/50 text-center backdrop-blur-sm">
                  <CardHeader>
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                      <benefit.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="positions" className="px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">Open Positions</h2>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
              Find your next opportunity and help us build the future of collaboration.
            </p>
          </div>

          {/* Department Filter */}
          <div className="mb-12 flex flex-wrap justify-center gap-2">
            {departments.map(dept => (
              <Button
                key={dept}
                variant={selectedDepartment === dept ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDepartment(dept)}
                className="transition-all duration-200"
              >
                {dept}
              </Button>
            ))}
          </div>

          {/* Position Cards */}
          <div className="grid gap-6">
            {filteredPositions.map((position, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <h3 className="text-xl font-semibold">{position.title}</h3>
                          <Badge variant="secondary">{position.department}</Badge>
                          <span className="text-sm text-muted-foreground">• {position.posted}</span>
                        </div>
                        <p className="mb-4 text-muted-foreground">{position.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {position.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {position.type}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {position.salary}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Button variant="outline" size="sm">
                          Learn More
                        </Button>
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          <Briefcase className="mr-2 h-4 w-4" />
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredPositions.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-lg text-muted-foreground">
                No positions found for {selectedDepartment}. Check back soon or view all positions.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/30 px-4 py-20">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl"
          >
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Don&apos;t see the perfect role?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
              We&apos;re always looking for talented people to join our team. Send us your resume
              and let&apos;s start a conversation.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/contact">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  Get in Touch
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" asChild>
                <a href="mailto:careers@workflowhub.com">Send Resume</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <AppFooter />
    </div>
  );
};
