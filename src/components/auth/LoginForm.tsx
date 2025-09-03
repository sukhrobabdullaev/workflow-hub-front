import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { SocialLogin } from './SocialLogin';
import { MagicLinkAuth } from './MagicLinkAuth';
import { Eye, EyeOff, Wand2, Building2 } from 'lucide-react';

interface LoginFormProps {
  onToggleMode: () => void;
  onForgotPassword?: () => void;
  onEnterpriseSSO?: () => void;
}

export const LoginForm = ({ onToggleMode, onForgotPassword, onEnterpriseSSO }: LoginFormProps) => {
  const [email, setEmail] = useState('john@workflowhub.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMagicLink, setShowMagicLink] = useState(false);
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: 'Welcome back!',
          description: "You've been successfully logged in.",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: 'Login failed',
          description:
            'Invalid email or password. Try: john@workflowhub.com / password',
          variant: 'destructive',
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'An unexpected error occurred.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (showMagicLink) {
    return <MagicLinkAuth onBack={() => setShowMagicLink(false)} />;
  }

  return (
    <Card className="w-full max-w-md shadow-elevated">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Welcome back
        </CardTitle>
        <CardDescription className="text-center">
          Sign in to your WorkflowHub account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Social Login */}
        <SocialLogin mode="login" />

        {/* Enterprise SSO Option */}
        {onEnterpriseSSO && (
          <div className="text-center">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={onEnterpriseSSO}
            >
              <Building2 className="w-4 h-4 mr-2" />
              Continue with Enterprise SSO
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@workflowhub.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button
                type="button"
                variant="link"
                className="px-0 font-normal text-sm text-primary hover:underline"
                onClick={() => onForgotPassword ? onForgotPassword() : setShowMagicLink(true)}
              >
                Forgot password?
              </Button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <Label
                htmlFor="remember"
                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </Label>
            </div>
            <Button
              type="button"
              variant="link"
              className="px-0 font-normal text-sm text-primary hover:underline"
              onClick={() => setShowMagicLink(true)}
            >
              <Wand2 className="w-3 h-3 mr-1" />
              Magic link
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-primary hover:opacity-90"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onToggleMode}
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
