import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, ArrowLeft, CheckCircle, Clock, RefreshCw } from 'lucide-react';

interface EmailVerificationProps {
    email: string;
    onBack: () => void;
    onVerificationComplete: () => void;
}

export const EmailVerification = ({ email, onBack, onVerificationComplete }: EmailVerificationProps) => {
    const [isResending, setIsResending] = useState(false);
    const [resendCount, setResendCount] = useState(0);
    const [cooldownEnd, setCooldownEnd] = useState<number | null>(null);
    const { toast } = useToast();

    const sendVerificationEmail = async () => {
        if (cooldownEnd && Date.now() < cooldownEnd) {
            const remainingTime = Math.ceil((cooldownEnd - Date.now()) / 1000);
            toast({
                title: 'Please wait',
                description: `You can resend in ${remainingTime} seconds`,
                variant: 'destructive',
            });
            return;
        }

        setIsResending(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            setResendCount(prev => prev + 1);
            // Set cooldown period with max cap of 5 minutes
            const baseMs = 30000;
            const maxMs = 300000; // 5 minutes
            const cooldownMs = Math.min(baseMs * Math.pow(2, resendCount), maxMs);
            setCooldownEnd(Date.now() + cooldownMs);

            toast({
                title: 'Verification email sent!',
                description: 'Check your inbox and spam folder.',
            });
        } catch (error) {
            toast({
                title: 'Failed to send email',
                description: 'Please try again later.',
                variant: 'destructive',
            });
        } finally {
            setIsResending(false);
        }
    };

    // Mock email verification (in real app, this would be handled by a link click)
    const handleMockVerification = () => {
        toast({
            title: 'Email verified!',
            description: 'Your account has been successfully verified.',
        });
        onVerificationComplete();
    };

    return (
        <Card className="w-full max-w-md shadow-elevated">
            <CardHeader className="text-center space-y-4">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.6 }}
                    className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center"
                >
                    <Mail className="w-8 h-8 text-blue-600" />
                </motion.div>
                <div>
                    <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
                    <CardDescription className="mt-2">
                        We've sent a verification link to{' '}
                        <span className="font-medium text-foreground">{email}</span>
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-blue-900">
                                Click the verification link in your email
                            </p>
                            <p className="text-sm text-blue-700 mt-1">
                                The link will expire in 24 hours for security.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-sm text-muted-foreground text-center">
                        Didn't receive the email? Check your spam folder or
                    </p>

                    <Button
                        variant="outline"
                        onClick={sendVerificationEmail}
                        disabled={isResending || (cooldownEnd && Date.now() < cooldownEnd)}
                        className="w-full"
                    >
                        {isResending ? (
                            <div className="flex items-center">
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Sending...
                            </div>
                        ) : cooldownEnd && Date.now() < cooldownEnd ? (
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                Wait {Math.ceil((cooldownEnd - Date.now()) / 1000)}s
                            </div>
                        ) : (
                            'Resend verification email'
                        )}
                    </Button>

                    {/* Demo button for testing */}
                    <Button
                        variant="outline"
                        onClick={handleMockVerification}
                        className="w-full border-green-200 text-green-700 hover:bg-green-50"
                    >
                        ✨ Simulate Email Verification (Demo)
                    </Button>
                </div>

                <div className="text-center">
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to sign up
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
