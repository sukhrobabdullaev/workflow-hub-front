import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import {
    Shield,
    Smartphone,
    Copy,
    CheckCircle,
    AlertTriangle,
    QrCode,
    Download
} from 'lucide-react';

interface TwoFactorSetupProps {
    onComplete: () => void;
    onSkip: () => void;
}

export const TwoFactorSetup = ({ onComplete, onSkip }: TwoFactorSetupProps) => {
    const [step, setStep] = useState<'intro' | 'qr' | 'verify'>('intro');
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [secretKey] = useState('JBSWY3DPEHPK3PXP'); // Mock secret key
    const [backupCodes] = useState([
        '123456789',
        '987654321',
        '456789123',
        '789123456',
        '321654987',
        '654987321'
    ]);
    const { toast } = useToast();

    const handleCopySecret = async () => {
        try {
            if (!navigator?.clipboard?.writeText) throw new Error('Clipboard unavailable');
            await navigator.clipboard.writeText(secretKey);
            toast({
                title: 'Copied!',
                description: 'Secret key copied to clipboard.',
            });
        } catch {
            toast({
                title: 'Copy failed',
                description: 'Your browser blocked clipboard access. Copy the key manually.',
                variant: 'destructive',
            });
        }
    };
    const handleCopyBackupCodes = () => {
        navigator.clipboard.writeText(backupCodes.join('\n'));
        toast({
            title: 'Copied!',
            description: 'Backup codes copied to clipboard.',
        });
    };

    const handleVerify = async () => {
        if (!/^\d{6}$/.test(verificationCode)) {
            toast({
                title: 'Invalid code',
                description: 'Enter a 6-digit numeric verification code.',
                variant: 'destructive',
            });
            return;
        }

        setIsVerifying(true);
        try {
            // Simulate verification
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock successful verification (accept any 6-digit code)
            toast({
                title: 'Two-factor authentication enabled!',
                description: 'Your account is now more secure.',
            });

            onComplete();
        } catch (error) {
            toast({
                title: 'Verification failed',
                description: 'Invalid verification code. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsVerifying(false);
        }
    };

    if (step === 'intro') {
        return (
            <Card className="w-full max-w-md shadow-elevated">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <Shield className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold">
                            Secure your account
                        </CardTitle>
                        <CardDescription className="mt-2">
                            Enable two-factor authentication for enhanced security
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                                <h4 className="font-medium">Extra security layer</h4>
                                <p className="text-sm text-muted-foreground">
                                    Protect your account even if your password is compromised
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                                <Smartphone className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                                <h4 className="font-medium">Use your phone</h4>
                                <p className="text-sm text-muted-foreground">
                                    Generate codes with apps like Google Authenticator or Authy
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                                <Download className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                                <h4 className="font-medium">Backup codes</h4>
                                <p className="text-sm text-muted-foreground">
                                    Get backup codes in case you lose access to your phone
                                </p>
                            </div>
                        </div>
                    </div>

                    <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            We recommend enabling 2FA to keep your workspace secure, especially if you're working with sensitive data.
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-3">
                        <Button
                            onClick={() => setStep('qr')}
                            className="w-full bg-gradient-primary hover:opacity-90"
                        >
                            <Shield className="w-4 h-4 mr-2" />
                            Set up two-factor authentication
                        </Button>

                        <Button
                            variant="outline"
                            onClick={onSkip}
                            className="w-full"
                        >
                            Skip for now
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (step === 'qr') {
        return (
            <Card className="w-full max-w-md shadow-elevated">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <QrCode className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold">
                            Scan QR code
                        </CardTitle>
                        <CardDescription className="mt-2">
                            Use your authenticator app to scan this QR code
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Mock QR Code */}
                    <div className="flex justify-center">
                        <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">QR Code</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="p-3 bg-muted rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Manual entry key</p>
                                    <p className="text-xs text-muted-foreground">
                                        Can't scan? Enter this key manually
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCopySecret}
                                >
                                    <Copy className="w-3 h-3 mr-1" />
                                    Copy
                                </Button>
                            </div>
                            <p className="text-sm font-mono mt-2 bg-background p-2 rounded border">
                                {secretKey}
                            </p>
                        </div>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                        <p>Popular authenticator apps:</p>
                        <p className="mt-1">Google Authenticator • Microsoft Authenticator • Authy</p>
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={() => setStep('verify')}
                            className="w-full bg-gradient-primary hover:opacity-90"
                        >
                            I've scanned the QR code
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => setStep('intro')}
                            className="w-full"
                        >
                            Back
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
                    <Smartphone className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                    <CardTitle className="text-2xl font-bold">
                        Enter verification code
                    </CardTitle>
                    <CardDescription className="mt-2">
                        Enter the 6-digit code from your authenticator app
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="verification-code">Verification code</Label>
                    <Input
                        id="verification-code"
                        placeholder="123456"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="text-center text-lg tracking-widest"
                        maxLength={6}
                    />
                </div>

                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-start space-x-3">
                        <Download className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div className="flex-1">
                            <h4 className="font-medium text-amber-900">Save your backup codes</h4>
                            <p className="text-sm text-amber-800 mt-1 mb-3">
                                Store these codes safely. You can use them to access your account if you lose your phone.
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                                {backupCodes.map((code, index) => (
                                    <div key={index} className="bg-white p-2 rounded border">
                                        {code}
                                    </div>
                                ))}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCopyBackupCodes}
                                className="mt-3"
                            >
                                <Copy className="w-3 h-3 mr-1" />
                                Copy codes
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <Button
                        onClick={handleVerify}
                        disabled={verificationCode.length !== 6 || isVerifying}
                        className="w-full bg-gradient-primary hover:opacity-90"
                    >
                        {isVerifying ? (
                            <div className="flex items-center">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Verifying...
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Enable two-factor authentication
                            </div>
                        )}
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => setStep('qr')}
                        className="w-full"
                        disabled={isVerifying}
                    >
                        Back
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
