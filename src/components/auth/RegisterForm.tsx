import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { SocialLogin } from './SocialLogin';
import { PasswordStrengthInput } from './PasswordStrengthInput';
import { Building2 } from 'lucide-react';

interface RegisterFormProps {
  onToggleMode: () => void;
  onRegistrationComplete?: (email: string) => void;
  onEnterpriseSSO?: () => void;
}

export const RegisterForm = ({
  onToggleMode,
  onRegistrationComplete,
  onEnterpriseSSO,
}: RegisterFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptMarketing, setAcceptMarketing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const register = useAuthStore(state => state.register);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptTerms) {
      toast({
        title: 'Terms required',
        description: 'Please accept the Terms of Service to continue.',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Password mismatch',
        description: 'Passwords do not match. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: 'Weak password',
        description: 'Password must be at least 8 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await register(name, email, password);
      if (success) {
        if (onRegistrationComplete) {
          toast({
            title: 'Account created!',
            description: 'Please check your email to verify your account.',
          });
          onRegistrationComplete(email);
        } else {
          toast({
            title: 'Account created!',
            description: "Welcome to WorkflowHub! Let's set up your workspace.",
          });
          navigate('/onboarding');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration failed',
        description: 'An error occurred while creating your account.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-elevated">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl font-bold">Create account</CardTitle>
        <CardDescription className="text-center">
          Join thousands of teams using WorkflowHub
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Social Login */}
        <SocialLogin mode="register" />

        {/* Enterprise SSO Option */}
        {onEnterpriseSSO && (
          <div className="text-center">
            <Button type="button" variant="outline" className="w-full" onClick={onEnterpriseSSO}>
              <Building2 className="mr-2 h-4 w-4" />
              Continue with Enterprise SSO
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Smith"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <PasswordStrengthInput
            value={password}
            onChange={setPassword}
            placeholder="Create a strong password"
            required
          />

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={checked => setAcceptTerms(checked === true)}
                className="mt-1"
              />
              <Label htmlFor="terms" className="text-sm leading-5">
                I agree to the{' '}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </Label>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="marketing"
                checked={acceptMarketing}
                onCheckedChange={checked => setAcceptMarketing(checked === true)}
                className="mt-1"
              />
              <Label htmlFor="marketing" className="text-sm leading-5 text-muted-foreground">
                Send me product updates and announcements (optional)
              </Label>
            </div>
          </div>

          <Button
            type="submit"
            className="bg-gradient-primary w-full hover:opacity-90"
            disabled={isLoading || !acceptTerms}
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onToggleMode}
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
