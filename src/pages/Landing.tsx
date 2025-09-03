import { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, CheckCircle, Star, Users, Zap, Shield, BarChart3, Layers, PlayCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { DemoVideo } from '@/components/DemoVideo';

const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
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

    const features = [
        {
            icon: <Layers className="w-8 h-8" />,
            title: "Project Management",
            description: "Organize your work with powerful project boards, timelines, and task management."
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Team Collaboration",
            description: "Work together seamlessly with real-time updates, comments, and file sharing."
        },
        {
            icon: <BarChart3 className="w-8 h-8" />,
            title: "Advanced Analytics",
            description: "Get insights into your team's performance with detailed reports and metrics."
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: "Automation",
            description: "Streamline repetitive tasks with custom workflows and smart automation rules."
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Enterprise Security",
            description: "Keep your data safe with enterprise-grade security and compliance features."
        },
        {
            icon: <CheckCircle className="w-8 h-8" />,
            title: "Custom Workflows",
            description: "Create workflows that match your team's unique processes and requirements."
        }
    ];

    const testimonials = [
        {
            name: "Sarah Chen",
            role: "Product Manager",
            company: "TechCorp",
            content: "WorkflowHub transformed how our team collaborates. We've increased productivity by 40%.",
            avatar: "/api/placeholder/48/48"
        },
        {
            name: "David Rodriguez",
            role: "Engineering Lead",
            company: "StartupXYZ",
            content: "The best project management tool we've used. Clean interface, powerful features.",
            avatar: "/api/placeholder/48/48"
        },
        {
            name: "Emily Watson",
            role: "Operations Director",
            company: "GlobalInc",
            content: "Finally, a tool that scales with our growing team. Excellent support and features.",
            avatar: "/api/placeholder/48/48"
        }
    ];

    const pricingPlans = [
        {
            name: "Starter",
            price: "$0",
            period: "forever",
            description: "Perfect for small teams getting started",
            features: [
                "Up to 5 team members",
                "3 projects",
                "Basic task management",
                "Email support",
                "1GB storage"
            ],
            popular: false,
            buttonText: "Get Started Free"
        },
        {
            name: "Professional",
            price: "$12",
            period: "per user/month",
            description: "Advanced features for growing teams",
            features: [
                "Unlimited team members",
                "Unlimited projects",
                "Advanced analytics",
                "Priority support",
                "100GB storage",
                "Custom workflows",
                "Time tracking"
            ],
            popular: true,
            buttonText: "Start Free Trial"
        },
        {
            name: "Enterprise",
            price: "Custom",
            period: "contact sales",
            description: "Full control and security for large organizations",
            features: [
                "Everything in Professional",
                "Advanced security",
                "Single Sign-On (SSO)",
                "Dedicated account manager",
                "Unlimited storage",
                "Custom integrations",
                "24/7 phone support"
            ],
            popular: false,
            buttonText: "Contact Sales"
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <motion.nav
                className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-sm border-b' : 'bg-transparent'
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Layers className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold">WorkflowHub</span>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
                        <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
                        <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link to="/auth">
                            <Button variant="ghost">Sign In</Button>
                        </Link>
                        <Link to="/auth">
                            <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                                Get Started
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <section ref={heroRef} className="pt-32 pb-20 px-4">
                <div className="container mx-auto text-center">
                    <motion.div
                        initial="initial"
                        animate={heroInView ? "animate" : "initial"}
                        variants={staggerContainer}
                        className="max-w-4xl mx-auto"
                    >
                        <motion.div variants={fadeInUp}>
                            <Badge className="mb-6 px-4 py-2 bg-primary/10 text-primary border-primary/20">
                                ✨ New: AI-powered project insights now available
                            </Badge>
                        </motion.div>

                        <motion.h1
                            variants={fadeInUp}
                            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent dark:from-gray-100 dark:via-gray-200 dark:to-gray-400"
                        >
                            The future of team
                            <br />
                            <span className="text-primary">
                                collaboration
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={fadeInUp}
                            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
                        >
                            Streamline your workflow, boost productivity, and bring your team together with our powerful project management platform.
                        </motion.p>

                        <motion.div
                            variants={fadeInUp}
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
                        >
                            <Link to="/auth">
                                <Button size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground text-lg px-8 py-6">
                                    Start Free Trial
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                            <DemoVideo />
                        </motion.div>

                        <motion.div
                            variants={fadeInUp}
                            className="flex items-center justify-center space-x-6 text-sm text-muted-foreground"
                        >
                            <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                Free 14-day trial
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                No credit card required
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
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
                    <div className="relative max-w-5xl mx-auto">
                        <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-3xl"></div>
                        <div className="relative bg-card border rounded-2xl shadow-2xl overflow-hidden">
                            <div className="bg-muted/50 p-4 border-b flex items-center space-x-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <div className="ml-4 text-sm text-muted-foreground">WorkflowHub Dashboard</div>
                            </div>
                            <div className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                                        transition={{ duration: 0.6, delay: 0.8 }}
                                        className="space-y-4"
                                    >
                                        <div className="h-4 bg-primary/30 rounded w-3/4"></div>
                                        <div className="h-20 bg-primary/10 rounded-lg border border-primary/20"></div>
                                        <div className="h-4 bg-green-300 rounded w-1/2"></div>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                        transition={{ duration: 0.6, delay: 1.0 }}
                                        className="space-y-4"
                                    >
                                        <div className="h-4 bg-primary/40 rounded w-2/3"></div>
                                        <div className="h-20 bg-primary/15 rounded-lg border border-primary/25"></div>
                                        <div className="h-4 bg-orange-300 rounded w-3/4"></div>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                                        transition={{ duration: 0.6, delay: 1.2 }}
                                        className="space-y-4"
                                    >
                                        <div className="h-4 bg-primary/20 rounded w-1/2"></div>
                                        <div className="h-20 bg-primary/5 rounded-lg border border-primary/15"></div>
                                        <div className="h-4 bg-pink-300 rounded w-2/3"></div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section id="features" ref={featuresRef} className="py-20 px-4 bg-muted/30">
                <div className="container mx-auto">
                    <motion.div
                        initial="initial"
                        animate={featuresInView ? "animate" : "initial"}
                        variants={staggerContainer}
                        className="text-center mb-16"
                    >
                        <motion.h2
                            variants={fadeInUp}
                            className="text-3xl md:text-5xl font-bold mb-6"
                        >
                            Everything you need to succeed
                        </motion.h2>
                        <motion.p
                            variants={fadeInUp}
                            className="text-xl text-muted-foreground max-w-3xl mx-auto"
                        >
                            Powerful features designed to help teams of all sizes collaborate better and achieve more.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate={featuresInView ? "animate" : "initial"}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {features.map((feature, index) => (
                            <motion.div key={index} variants={fadeInUp}>
                                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-background/60 backdrop-blur-sm">
                                    <CardHeader>
                                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 text-primary-foreground">
                                            {feature.icon}
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
                    </motion.div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-20 px-4">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Loved by teams worldwide
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Join thousands of teams who have transformed their workflow with WorkflowHub.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                                        <div className="flex mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                        <p className="text-lg mb-6 leading-relaxed">"{testimonial.content}"</p>
                                        <div className="flex items-center">
                                            <img
                                                src={testimonial.avatar}
                                                alt={testimonial.name}
                                                className="w-12 h-12 rounded-full mr-4"
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
            <section id="pricing" ref={pricingRef} className="py-20 px-4 bg-muted/30">
                <div className="container mx-auto">
                    <motion.div
                        initial="initial"
                        animate={pricingInView ? "animate" : "initial"}
                        variants={staggerContainer}
                        className="text-center mb-16"
                    >
                        <motion.h2
                            variants={fadeInUp}
                            className="text-3xl md:text-5xl font-bold mb-6"
                        >
                            Simple, transparent pricing
                        </motion.h2>
                        <motion.p
                            variants={fadeInUp}
                            className="text-xl text-muted-foreground max-w-3xl mx-auto"
                        >
                            Choose the plan that's right for your team. Always know what you'll pay.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate={pricingInView ? "animate" : "initial"}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
                    >
                        {pricingPlans.map((plan, index) => (
                            <motion.div key={index} variants={fadeInUp}>
                                <Card className={`h-full relative ${plan.popular ? 'border-primary shadow-xl scale-105' : ''}`}>
                                    {plan.popular && (
                                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                            <Badge className="bg-primary text-primary-foreground px-4 py-1">
                                                Most Popular
                                            </Badge>
                                        </div>
                                    )}
                                    <CardHeader className="text-center">
                                        <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                        <div className="mt-4">
                                            <span className="text-4xl font-bold">{plan.price}</span>
                                            {plan.price !== "Custom" && <span className="text-muted-foreground">/{plan.period}</span>}
                                        </div>
                                        <CardDescription className="mt-2">{plan.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <ul className="space-y-3">
                                            {plan.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-center">
                                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <Link to="/auth" className="block mt-8">
                                            <Button
                                                className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary-hover text-primary-foreground' : ''}`}
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
            <section className="py-20 px-4">
                <div className="container mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Ready to transform your workflow?
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Join thousands of teams who are already using WorkflowHub to collaborate better and achieve more.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/auth">
                                <Button size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground text-lg px-8 py-6">
                                    Start Your Free Trial
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                                Schedule a Demo
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-muted py-12 px-4">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                    <Layers className="w-5 h-5 text-primary-foreground" />
                                </div>
                                <span className="text-xl font-bold">WorkflowHub</span>
                            </div>
                            <p className="text-muted-foreground">
                                The future of team collaboration and project management.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Product</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Integrations</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Company</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Support</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Community</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
                        <p>&copy; 2025 WorkflowHub. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};
