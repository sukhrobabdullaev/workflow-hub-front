import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, BarChart3, Menu, Rocket, Shield, Sparkles, Users, X, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface LandingNavbarProps {
  isScrolled?: boolean;
}

export const LandingNavbar = ({ isScrolled = false }: LandingNavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const features = [
    {
      title: 'Project Management',
      description: 'Advanced project tracking with AI insights',
      icon: BarChart3,
      href: '/features/projects',
    },
    {
      title: 'Team Collaboration',
      description: 'Real-time collaboration tools',
      icon: Users,
      href: '/features/collaboration',
    },
    {
      title: 'Security & Compliance',
      description: 'Enterprise-grade security',
      icon: Shield,
      href: '/features/security',
    },
    {
      title: 'Analytics & Reporting',
      description: 'Powerful insights and reporting',
      icon: BarChart3,
      href: '/features/analytics',
    },
  ];

  const company = [
    {
      title: 'About Us',
      description: 'Learn about our mission and team',
      href: '/about',
    },
    {
      title: 'Careers',
      description: 'Join our growing team',
      href: '/careers',
      badge: "We're hiring!",
    },
    {
      title: 'Blog',
      description: 'Latest news and insights',
      href: '/blog',
    },
    {
      title: 'Contact',
      description: 'Get in touch with us',
      href: '/contact',
    },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={cn(
          'fixed left-0 right-0 top-0 z-50 transition-all duration-300',
          isScrolled
            ? 'border-b border-border/40 bg-background/80 shadow-sm backdrop-blur-xl'
            : 'bg-transparent'
        )}
      >
        <nav className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="group flex items-center space-x-3">
              <div className="relative">
                <motion.div
                  className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 shadow-lg transition-all duration-300 group-hover:shadow-xl"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Zap className="h-5 w-5 text-primary-foreground" />
                </motion.div>
                <div className="absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 blur-sm transition-all duration-300 group-hover:blur-md" />
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-xl font-bold text-transparent">
                  WorkflowHub
                </span>
                <Badge
                  variant="secondary"
                  className="hidden border-primary/20 bg-gradient-to-r from-primary/20 to-primary/10 text-xs text-primary sm:inline-flex"
                >
                  <Sparkles className="mr-1 h-3 w-3" />
                  Beta
                </Badge>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent transition-colors hover:bg-accent/50">
                    Features
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {features.map(feature => (
                        <li key={feature.title}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={feature.href}
                              className="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="mb-2 flex items-center gap-2">
                                <feature.icon className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
                                <div className="text-sm font-medium leading-none">
                                  {feature.title}
                                </div>
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {feature.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent transition-colors hover:bg-accent/50">
                    Solutions
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            to="/enterprise"
                            className="group flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/20 via-primary/10 to-primary/5 p-6 no-underline outline-none focus:shadow-md"
                          >
                            <div className="mb-2 flex items-center gap-2">
                              <Rocket className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
                              <div className="mb-2 mt-4 text-lg font-medium">Enterprise</div>
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Powerful solutions for large organizations with advanced security and
                              compliance.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/startups"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">For Startups</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Get started quickly with our startup-friendly plans
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/agencies"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">For Agencies</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Manage multiple client projects efficiently
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/freelancers"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">For Freelancers</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Perfect tools for independent professionals
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link
                    to="/pricing"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    Pricing
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent transition-colors hover:bg-accent/50">
                    Company
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[300px] gap-3 p-4">
                      {company.map(item => (
                        <li key={item.title}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={item.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="flex items-center gap-2">
                                <div className="text-sm font-medium leading-none">{item.title}</div>
                                {item.badge && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-green-100 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                  >
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/auth')}
                className="hidden transition-colors hover:bg-accent/50 sm:inline-flex"
              >
                Sign In
              </Button>
              <Button
                size="sm"
                onClick={() => navigate('/auth')}
                className="hidden bg-gradient-to-r from-primary to-primary/80 shadow-lg transition-all duration-300 hover:from-primary/90 hover:to-primary/70 hover:shadow-xl sm:inline-flex"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="fixed inset-0 bg-background/80 backdrop-blur-xl" />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-80 overflow-y-auto border-l border-border/40 bg-background p-6"
            >
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80">
                    <Zap className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="text-lg font-bold">WorkflowHub</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Features
                  </h3>
                  <div className="space-y-2">
                    {features.map(feature => (
                      <Link
                        key={feature.title}
                        to={feature.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent"
                      >
                        <feature.icon className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">{feature.title}</div>
                          <div className="text-sm text-muted-foreground">{feature.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Company
                  </h3>
                  <div className="space-y-2">
                    {company.map(item => (
                      <Link
                        key={item.title}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-accent"
                      >
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-muted-foreground">{item.description}</div>
                        </div>
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 border-t border-border/40 pt-6">
                  <Button
                    variant="outline"
                    className="w-full justify-center"
                    onClick={() => {
                      navigate('/auth');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="w-full justify-center bg-gradient-to-r from-primary to-primary/80"
                    onClick={() => {
                      navigate('/auth');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
