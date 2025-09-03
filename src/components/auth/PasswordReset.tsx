import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { PasswordStrengthInput } from './PasswordStrengthInput';
import { Key, ArrowLeft, CheckCircle, Mail } from 'lucide-react';

interface PasswordResetProps {
    onBack: () => void;
    onResetComplete: () => void;
}

export const PasswordReset = ({ onBack, onResetComplete }: PasswordResetProps) => {
    const [step, setStep] = useState<'request' | 'sent' | 'reset'>('request');
    const [email, setEmail] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const requestReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Normalize user input
            const normalizedEmail = email.trim();
            if (normalizedEmail !== email) {
                setEmail(normalizedEmail);
            }
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            setStep('sent');
            toast({
                title: 'Reset email sent!',
                description: 'Check your inbox for password reset instructions.',
            });
        } catch (error) {
            toast({
                title: 'Failed to send reset email',
                description: 'Please check your email address and try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const resetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast({
                title: 'Passwords do not match',
                description: 'Please make sure both passwords are identical.',
                variant: 'destructive',
            });
            return;
        }

        if (newPassword.length < 8) {
            toast({
                title: 'Password too weak',
                description: 'Password must be at least 8 characters long.',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast({
                title: 'Password reset successful!',
                description: 'You can now sign in with your new password.',
            });

            onResetComplete();
        } catch (error) {
            toast({
                title: 'Reset failed',
                description: 'Invalid or expired reset token. Please request a new reset link.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Mock function to simulate clicking email link
    const simulateEmailClick = () => {
        setResetToken('demo-token-123');
        setStep('reset');
        toast({
            title: 'Reset link clicked!',
            description: 'You can now set your new password.',
        });
    };

    if (step === 'request') {
        return (
            <Card className="w-full max-w-md shadow-elevated">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                        <Key className="w-8 h-8 text-orange-600" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold">Reset your password</CardTitle>
                        <CardDescription className="mt-2">
                            Enter your email address and we'll send you a reset link
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <form onSubmit={requestReset} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="reset-email">Email address</Label>
                            <Input
                                id="reset-email"
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
                                    Sending reset link...
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Send reset link
                                </div>
                            )}
                        </Button>
                    </form>

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

    if (step === 'sent') {
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
                            We've sent password reset instructions to{' '}
                            <span className="font-medium text-foreground">{email}</span>
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start space-x-3">
                            <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-blue-900">
                                    Click the reset link in your email
                                </p>
                                <p className="text-sm text-blue-700 mt-1">
                                    The link will expire in 1 hour for security.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Button
                            variant="outline"
                            onClick={() => setStep('request')}
                            className="w-full"
                        >
                            Send another email
                        </Button>

                        {/* Demo button */}
                        <Button
                            variant="outline"
                            onClick={simulateEmailClick}
                            className="w-full border-green-200 text-green-700 hover:bg-green-50"
                        >
                            ✨ Simulate Email Click (Demo)
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
            <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Key className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                    <CardTitle className="text-2xl font-bold">Set new password</CardTitle>
                    <CardDescription className="mt-2">
                        Choose a strong password for your account
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                <form onSubmit={resetPassword} className="space-y-4">
                    <PasswordStrengthInput
                        value={newPassword}
                        onChange={setNewPassword}
                        placeholder="Enter new password"
                        required
                    />

                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm new password</Label>
                        <Input
                            id="confirm-password"
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                                Updating password...
                            </div>
                        ) : (
                            'Update password'
                        )}
                    </Button>
                </form>

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
};
