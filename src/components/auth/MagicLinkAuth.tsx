import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

interface MagicLinkAuthProps {
    onBack: () => void;
}

export const MagicLinkAuth = ({ onBack }: MagicLinkAuthProps) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const { toast } = useToast();

    const handleSendMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            setIsEmailSent(true);
            toast({
                title: 'Magic link sent!',
                description: 'Check your email for a secure sign-in link.',
            });
        } catch (error) {
            toast({
                title: 'Failed to send magic link',
                description: 'Please try again or use a different sign-in method.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendLink = async () => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast({
                title: 'Magic link resent!',
                description: 'A new sign-in link has been sent to your email.',
            });
        } catch (error) {
            toast({
                title: 'Failed to resend link',
                description: 'Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isEmailSent) {
        return (
            <Card className="w-full max-w-md shadow-elevated">
                <CardHeader className="text-center space-y-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', duration: 0.6 }}
                        className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
                    >
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </motion.div>
                    <div>
                        <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
                        <CardDescription className="mt-2">
                            We've sent a secure sign-in link to{' '}
                            <span className="font-medium text-foreground">{email}</span>
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start space-x-3">
                            <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-blue-900">
                                    Click the link in your email to sign in
                                </p>
                                <p className="text-sm text-blue-700 mt-1">
                                    The link will expire in 15 minutes for security.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center space-y-3">
                        <p className="text-sm text-muted-foreground">
                            Didn't receive the email? Check your spam folder or
                        </p>
                        <Button
                            variant="outline"
                            onClick={handleResendLink}
                            disabled={isLoading}
                            className="w-full"
                        >
                            {isLoading ? 'Sending...' : 'Resend magic link'}
                        </Button>
                    </div>

                    <div className="text-center">
                        <Button
                            variant="ghost"
                            onClick={onBack}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to sign in
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md shadow-elevated">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">
                    Sign in with magic link
                </CardTitle>
                <CardDescription className="text-center">
                    We'll send a secure link to your email - no password needed
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSendMagicLink} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="magic-email">Email address</Label>
                        <Input
                            id="magic-email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-primary hover:opacity-90"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Sending magic link...
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <Mail className="w-4 h-4 mr-2" />
                                Send magic link
                            </div>
                        )}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to sign in
                    </Button>
                </div>

                <div className="mt-4 p-3 bg-amber-50 rounded-md border border-amber-200">
                    <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                        <div className="text-sm text-amber-800">
                            <p className="font-medium">Why magic links?</p>
                            <p className="mt-1">More secure than passwords, no need to remember anything, and faster sign-in.</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
