import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
    </svg>
);

const GitHubIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
);

const MicrosoftIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#f25022" d="M1 1h10v10H1z" />
        <path fill="#00a4ef" d="M13 1h10v10H13z" />
        <path fill="#7fba00" d="M1 13h10v10H1z" />
        <path fill="#ffb900" d="M13 13h10v10H13z" />
    </svg>
);

interface SocialLoginProps {
    mode: 'login' | 'register';
}

export const SocialLogin = ({ mode }: SocialLoginProps) => {
    const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
    const { toast } = useToast();
    const login = useAuthStore(state => state.login);
    const register = useAuthStore(state => state.register);
    const navigate = useNavigate();

    const handleSocialAuth = async (provider: string) => {
        setLoadingProvider(provider);

        try {
            // Simulate social auth API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock successful social auth
            const mockEmail = `user@${provider}.com`;
            const mockName = `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`;

            if (mode === 'login') {
                const success = await login(mockEmail, 'social-auth');
                if (success) {
                    toast({
                        title: 'Welcome back!',
                        description: `Successfully signed in with ${provider}.`,
                    });
                    navigate('/dashboard');
                }
            } else {
                const success = await register(mockName, mockEmail, 'social-auth');
                if (success) {
                    toast({
                        title: 'Account created!',
                        description: `Your account has been created with ${provider}.`,
                    });
                    navigate('/onboarding');
                }
            }
        } catch (error) {
            toast({
                title: 'Authentication failed',
                description: `Failed to authenticate with ${provider}. Please try again.`,
                variant: 'destructive',
            });
        } finally {
            setLoadingProvider(null);
        }
    };

    const socialProviders = [
        {
            id: 'google',
            name: 'Google',
            icon: GoogleIcon,
            className: 'hover:bg-red-50 border-gray-200',
        },
        {
            id: 'github',
            name: 'GitHub',
            icon: GitHubIcon,
            className: 'hover:bg-gray-50 border-gray-200',
        },
        {
            id: 'microsoft',
            name: 'Microsoft',
            icon: MicrosoftIcon,
            className: 'hover:bg-blue-50 border-gray-200',
        },
    ];

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
                {socialProviders.map((provider) => {
                    const Icon = provider.icon;
                    const isLoading = loadingProvider === provider.id;

                    return (
                        <Button
                            key={provider.id}
                            variant="outline"
                            onClick={() => handleSocialAuth(provider.id)}
                            disabled={!!loadingProvider}
                            className={`w-full h-11 ${provider.className} transition-all duration-200`}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                            ) : (
                                <Icon />
                            )}
                            <span className="ml-2 font-medium">
                                {isLoading
                                    ? 'Connecting...'
                                    : `Continue with ${provider.name}`
                                }
                            </span>
                        </Button>
                    );
                })}
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with email
                    </span>
                </div>
            </div>
        </div>
    );
};
