import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import {
    Building2,
    ArrowLeft,
    Shield,
    Globe,
    CheckCircle,
    ExternalLink,
    Loader2
} from 'lucide-react';

interface EnterpriseSSOProps {
    onBack: () => void;
}

const popularProviders = [
    { id: 'okta', name: 'Okta', logo: '🔵' },
    { id: 'azure', name: 'Azure AD', logo: '🟦' },
    { id: 'google-workspace', name: 'Google Workspace', logo: '🟨' },
    { id: 'onelogin', name: 'OneLogin', logo: '🟢' },
    { id: 'auth0', name: 'Auth0', logo: '🟠' },
    { id: 'ping', name: 'PingIdentity', logo: '🔴' },
];

export const EnterpriseSSO = ({ onBack }: EnterpriseSSOProps) => {
    const [method, setMethod] = useState<'domain' | 'provider' | 'manual'>('domain');
    const [domain, setDomain] = useState('');
    const [selectedProvider, setSelectedProvider] = useState('');
    const [ssoUrl, setSsoUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [discoveredSSO, setDiscoveredSSO] = useState<any>(null);

    const { toast } = useToast();
    const socialAuth = useAuthStore(state => state.socialAuth);
    const navigate = useNavigate();

    const discoverSSO = async () => {
        if (!domain) return;

        setIsLoading(true);
        try {
            // Simulate SSO discovery
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock discovery result
            const mockSSO = {
                hasSSO: true,
                provider: 'Azure AD',
                ssoUrl: `https://login.microsoftonline.com/${domain}/saml2`,
                entityId: `https://${domain}/workflowhub`,
                logo: '🟦'
            };

            setDiscoveredSSO(mockSSO);
            toast({
                title: 'SSO configuration found!',
                description: `Found ${mockSSO.provider} configuration for ${domain}`,
            });
        } catch (error) {
            toast({
                title: 'No SSO configuration found',
                description: 'This domain does not have SSO configured. Try a different method.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const initiateSSOLogin = async (provider?: string, url?: string) => {
        setIsLoading(true);
        try {
            // Simulate SSO redirect and callback
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock successful SSO authentication
            const mockUser = {
                name: 'John Enterprise User',
                email: `john@${domain}`,
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                companyName: domain.split('.')[0].toUpperCase(),
                role: 'member' as const,
            };

            const success = await socialAuth('enterprise-sso', mockUser);

            if (success) {
                toast({
                    title: 'Welcome!',
                    description: `Successfully signed in with ${provider || 'Enterprise SSO'}`,
                });
                navigate('/onboarding');
            }
        } catch (error) {
            toast({
                title: 'SSO authentication failed',
                description: 'Unable to authenticate with your enterprise identity provider.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleProviderLogin = (providerId: string) => {
        const provider = popularProviders.find(p => p.id === providerId);
        if (provider) {
            initiateSSOLogin(provider.name, `https://demo-sso.${providerId}.com/saml2`);
        }
    };

    return (
        <Card className="w-full max-w-md shadow-elevated">
            <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                    <CardTitle className="text-2xl font-bold">Enterprise Sign-On</CardTitle>
                    <CardDescription className="mt-2">
                        Sign in with your organization's identity provider
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Method Selection */}
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { id: 'domain', label: 'Domain', icon: Globe },
                        { id: 'provider', label: 'Provider', icon: Shield },
                        { id: 'manual', label: 'Manual', icon: ExternalLink }
                    ].map(({ id, label, icon: Icon }) => (
                        <Button
                            key={id}
                            variant={method === id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setMethod(id as any)}
                            className="flex flex-col h-auto py-3"
                        >
                            <Icon className="w-4 h-4 mb-1" />
                            <span className="text-xs">{label}</span>
                        </Button>
                    ))}
                </div>

                {/* Domain Discovery */}
                {method === 'domain' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="domain">Company Domain</Label>
                            <div className="flex space-x-2">
                                <Input
                                    id="domain"
                                    placeholder="company.com"
                                    value={domain}
                                    onChange={(e) => setDomain(e.target.value)}
                                    className="flex-1"
                                />
                                <Button
                                    onClick={discoverSSO}
                                    disabled={!domain || isLoading}
                                    size="sm"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Find'}
                                </Button>
                            </div>
                        </div>

                        {discoveredSSO && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-green-50 rounded-lg border border-green-200"
                            >
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="text-2xl">{discoveredSSO.logo}</div>
                                    <div>
                                        <p className="font-medium text-green-900">{discoveredSSO.provider}</p>
                                        <p className="text-sm text-green-700">SSO configured for {domain}</p>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => initiateSSOLogin(discoveredSSO.provider, discoveredSSO.ssoUrl)}
                                    disabled={isLoading}
                                    className="w-full bg-green-600 hover:bg-green-700"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center">
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Signing in...
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <Shield className="w-4 h-4 mr-2" />
                                            Sign in with {discoveredSSO.provider}
                                        </div>
                                    )}
                                </Button>
                            </motion.div>
                        )}
                    </div>
                )}

                {/* Popular Providers */}
                {method === 'provider' && (
                    <div className="space-y-4">
                        <Label>Choose your identity provider</Label>
                        <div className="grid grid-cols-2 gap-3">
                            {popularProviders.map((provider) => (
                                <Button
                                    key={provider.id}
                                    variant="outline"
                                    onClick={() => handleProviderLogin(provider.id)}
                                    disabled={isLoading}
                                    className="flex items-center justify-start h-12 p-3"
                                >
                                    <span className="text-lg mr-3">{provider.logo}</span>
                                    <span className="text-sm font-medium">{provider.name}</span>
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Manual SSO URL */}
                {method === 'manual' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="sso-url">SSO Login URL</Label>
                            <Input
                                id="sso-url"
                                placeholder="https://your-company.okta.com/app/workflowhub"
                                value={ssoUrl}
                                onChange={(e) => setSsoUrl(e.target.value)}
                            />
                        </div>
                        <Button
                            onClick={() => initiateSSOLogin('Custom SSO', ssoUrl)}
                            disabled={!ssoUrl || isLoading}
                            className="w-full"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Redirecting...
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Sign in with SSO
                                </div>
                            )}
                        </Button>
                    </div>
                )}

                {/* Benefits */}
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-medium text-blue-900">Enterprise Security</p>
                            <p className="text-blue-700">
                                Single sign-on provides enhanced security and simplified access management.
                            </p>
                        </div>
                    </div>
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
};
