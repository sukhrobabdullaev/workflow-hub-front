import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Key, Mail } from 'lucide-react';
import { useState } from 'react';
import { PasswordStrengthInput } from './PasswordStrengthInput';

interface PasswordResetProps {
  onBack: () => void;
  onResetComplete: () => void;
}

export const PasswordReset = ({ onBack, onResetComplete }: PasswordResetProps) => {
  const [step, setStep] = useState<'request' | 'sent' | 'reset'>('request');
  const [email, setEmail] = useState('');
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
    setStep('reset');
    toast({
      title: 'Reset link clicked!',
      description: 'You can now set your new password.',
    });
  };

  if (step === 'request') {
    return (
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
            <Key className="h-8 w-8 text-orange-600" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Reset your password</CardTitle>
            <CardDescription className="mt-2">
              Enter your email address and we&apos;ll send you a reset link
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
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              className="bg-gradient-primary w-full hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Sending reset link...
                </div>
              ) : (
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
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
              <ArrowLeft className="mr-2 h-4 w-4" />
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
        <CardHeader className="space-y-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
          >
            <CheckCircle className="h-8 w-8 text-green-600" />
          </motion.div>
          <div>
            <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
            <CardDescription className="mt-2">
              We&apos;ve sent password reset instructions to{' '}
              <span className="font-medium text-foreground">{email}</span>
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start space-x-3">
              <Mail className="mt-0.5 h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">
                  Click the reset link in your email
                </p>
                <p className="mt-1 text-sm text-blue-700">
                  The link will expire in 1 hour for security.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button variant="outline" onClick={() => setStep('request')} className="w-full">
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
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-elevated">
      <CardHeader className="space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <Key className="h-8 w-8 text-blue-600" />
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
              onChange={e => setConfirmPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            className="bg-gradient-primary w-full hover:opacity-90"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
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
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
