import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowUp,
  Github,
  Globe,
  Heart,
  Linkedin,
  Mail,
  Shield,
  Sparkles,
  Twitter,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export const AppFooter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/40 bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Background Pattern */}
      <div className="bg-grid-pattern absolute inset-0 opacity-5" />

      {/* Scroll to top button */}
      <div className="absolute -top-6 right-8">
        <Button
          onClick={scrollToTop}
          size="sm"
          className="h-12 w-12 rounded-full bg-primary/90 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-primary hover:shadow-xl"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </div>

      <div className="container relative mx-auto px-4 py-16">
        {/* Newsletter Section */}
        <div className="mb-16 text-center">
          <div className="mx-auto max-w-2xl">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-2xl font-bold text-transparent">
                Stay in the Loop
              </h3>
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <p className="mb-6 text-muted-foreground">
              Get the latest updates, tips, and insights delivered straight to your inbox.
            </p>
            <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1"
                disabled={isSubscribed}
              />
              <Button
                onClick={handleSubscribe}
                disabled={!email || isSubscribed}
                className="bg-gradient-to-r from-primary to-primary/80 transition-all duration-300 hover:from-primary/90 hover:to-primary/70"
              >
                {isSubscribed ? (
                  <>
                    <Heart className="mr-2 h-4 w-4" />
                    Subscribed!
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Subscribe
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center space-x-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 shadow-lg">
                  <Zap className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 blur-sm" />
              </div>
              <div>
                <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-2xl font-bold text-transparent">
                  WorkflowHub
                </span>
              </div>
            </div>
            <p className="mb-6 max-w-md leading-relaxed text-muted-foreground">
              Revolutionizing team collaboration with AI-powered project management. Build faster,
              collaborate smarter, and achieve more together.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-green-500" />
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4 text-blue-500" />
                <span>99.9% Uptime</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="mb-6 flex items-center gap-2 font-semibold text-foreground">
              <div className="h-1 w-8 rounded-full bg-gradient-to-r from-primary to-primary/50" />
              Product
            </h4>
            <ul className="space-y-4 text-sm">
              {[
                { name: 'Features', href: '/features' },
                { name: 'Pricing', href: '/pricing' },
                { name: 'Integrations', href: '/integrations' },
                { name: 'API Documentation', href: '/docs' },
                { name: 'Changelog', href: '/changelog' },
                { name: 'Roadmap', href: '/roadmap' },
              ].map(link => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground underline-offset-4 transition-colors duration-200 hover:text-primary hover:underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="mb-6 flex items-center gap-2 font-semibold text-foreground">
              <div className="h-1 w-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-300" />
              Company
            </h4>
            <ul className="space-y-4 text-sm">
              {[
                { name: 'About Us', href: '/about' },
                { name: 'Careers', href: '/careers', badge: "We're hiring!" },
                { name: 'Blog', href: '/blog' },
                { name: 'Press Kit', href: '/press' },
                { name: 'Contact', href: '/contact' },
                { name: 'Partners', href: '/partners' },
              ].map(link => (
                <li key={link.name} className="flex items-center gap-2">
                  <Link
                    to={link.href}
                    className="text-muted-foreground underline-offset-4 transition-colors duration-200 hover:text-primary hover:underline"
                  >
                    {link.name}
                  </Link>
                  {link.badge && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    >
                      {link.badge}
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="mb-6 flex items-center gap-2 font-semibold text-foreground">
              <div className="h-1 w-8 rounded-full bg-gradient-to-r from-purple-500 to-purple-300" />
              Support
            </h4>
            <ul className="space-y-4 text-sm">
              {[
                { name: 'Help Center', href: '/help' },
                { name: 'Documentation', href: '/docs' },
                { name: 'Community', href: '/community' },
                { name: 'Status Page', href: '/status' },
                { name: 'Bug Reports', href: '/bugs' },
                { name: 'Feature Requests', href: '/features' },
              ].map(link => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground underline-offset-4 transition-colors duration-200 hover:text-primary hover:underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 border-t border-border/40 pt-8">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            {/* Copyright */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <p>&copy; {currentYear} WorkflowHub. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <Link to="/privacy" className="transition-colors hover:text-primary">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="transition-colors hover:text-primary">
                  Terms of Service
                </Link>
                <Link to="/cookies" className="transition-colors hover:text-primary">
                  Cookie Policy
                </Link>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              <span className="mr-3 text-sm text-muted-foreground">Follow us:</span>
              {[
                { icon: Twitter, href: 'https://twitter.com/workflowhub', label: 'Twitter' },
                { icon: Github, href: 'https://github.com/workflowhub', label: 'GitHub' },
                {
                  icon: Linkedin,
                  href: 'https://linkedin.com/company/workflowhub',
                  label: 'LinkedIn',
                },
                { icon: Globe, href: '/blog', label: 'Blog' },
              ].map(({ icon: Icon, href, label }) => (
                <Button
                  key={label}
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 transition-all duration-300 hover:scale-110 hover:bg-primary/10 hover:text-primary"
                  asChild
                >
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : '_self'}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Animated gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
    </footer>
  );
};
