import { AppFooter } from '@/components/layout/AppFooter';
import { LandingNavbar } from '@/components/layout/LandingNavbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export const Contact = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us an email and we&apos;ll respond within 24 hours',
      contact: 'hello@workflowhub.com',
      action: 'mailto:hello@workflowhub.com',
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our team in real-time',
      contact: 'Available 9 AM - 6 PM EST',
      action: '#',
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Speak directly with our sales team',
      contact: '+1 (555) 123-4567',
      action: 'tel:+15551234567',
    },
  ];

  const offices = [
    {
      city: 'San Francisco',
      address: '123 Innovation Drive, Suite 400',
      timezone: 'PST',
      hours: '9 AM - 6 PM',
    },
    {
      city: 'New York',
      address: '456 Business Plaza, Floor 25',
      timezone: 'EST',
      hours: '9 AM - 6 PM',
    },
    {
      city: 'London',
      address: '789 Tech Square, Level 10',
      timezone: 'GMT',
      hours: '9 AM - 5 PM',
    },
  ];

  const supportOptions = [
    {
      icon: Users,
      title: 'Sales Inquiries',
      description: 'Questions about pricing, features, or custom solutions',
      email: 'sales@workflowhub.com',
    },
    {
      icon: Headphones,
      title: 'Customer Support',
      description: 'Technical help, account issues, or general questions',
      email: 'support@workflowhub.com',
    },
    {
      icon: MessageCircle,
      title: 'Partnerships',
      description: 'Integration partnerships, reseller opportunities',
      email: 'partners@workflowhub.com',
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
              Get in Touch
            </Badge>

            <h1 className="mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
              Let&apos;s build something
              <span className="text-primary"> amazing together</span>
            </h1>

            <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-muted-foreground">
              Have questions? Want to see a demo? Ready to transform your team&apos;s workflow?
              We&apos;re here to help every step of the way.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="px-4 pb-20">
        <div className="container mx-auto">
          <div className="mb-20 grid gap-8 md:grid-cols-3">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 bg-card/50 text-center backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                      <method.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{method.title}</CardTitle>
                    <CardDescription className="text-base">{method.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <a
                      href={method.action}
                      className="inline-flex items-center gap-2 font-medium text-primary transition-colors hover:text-primary/80"
                    >
                      {method.contact}
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Contact Form & Info */}
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we&apos;ll get back to you within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="company">Company (Optional)</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Your company"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="What can we help you with?"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us more about your needs..."
                        rows={5}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                      disabled={isSubmitted}
                    >
                      {isSubmitted ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Message Sent!
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Support Options */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="mb-6 text-2xl font-bold">How can we help?</h3>
                <div className="space-y-4">
                  {supportOptions.map((option, index) => (
                    <Card key={index} className="border-0 bg-muted/30">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="rounded-lg bg-primary/10 p-2">
                            <option.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="mb-1 font-semibold">{option.title}</h4>
                            <p className="mb-2 text-sm text-muted-foreground">
                              {option.description}
                            </p>
                            <a
                              href={`mailto:${option.email}`}
                              className="text-sm text-primary transition-colors hover:text-primary/80"
                            >
                              {option.email}
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Office Locations */}
              <div>
                <h3 className="mb-6 text-2xl font-bold">Our Offices</h3>
                <div className="space-y-4">
                  {offices.map((office, index) => (
                    <Card key={index} className="border-0 bg-muted/30">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="rounded-lg bg-primary/10 p-2">
                            <MapPin className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="mb-1 font-semibold">{office.city}</h4>
                            <p className="mb-2 text-sm text-muted-foreground">{office.address}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {office.hours} {office.timezone}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-muted/30 px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">Quick Answers</h2>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
              Common questions about WorkflowHub and how we can help your team.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {[
              {
                question: 'How quickly can we get started?',
                answer:
                  'You can sign up and start using WorkflowHub in under 5 minutes. Our onboarding guides will have your team productive on day one.',
              },
              {
                question: 'Do you offer training and support?',
                answer:
                  'Yes! We provide comprehensive training materials, video tutorials, and dedicated customer support to ensure your success.',
              },
              {
                question: 'Can WorkflowHub integrate with our existing tools?',
                answer:
                  'Absolutely. We integrate with 100+ popular tools including Slack, Google Workspace, Microsoft 365, and many more.',
              },
              {
                question: 'Is my data secure with WorkflowHub?',
                answer:
                  'Security is our top priority. We&apos;re SOC 2 compliant with enterprise-grade encryption and regular security audits.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
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
              Ready to see WorkflowHub in action?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
              Schedule a personalized demo and see how WorkflowHub can transform your team&apos;s
              productivity.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                Schedule a Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Start Free Trial
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <AppFooter />
    </div>
  );
};
