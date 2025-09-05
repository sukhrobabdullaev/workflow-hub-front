import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  AlertTriangle,
  CheckCircle,
  Copy,
  Download,
  QrCode,
  Shield,
  Smartphone,
} from 'lucide-react';
import { useState } from 'react';

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
    '654987321',
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
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Shield className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Secure your account</CardTitle>
            <CardDescription className="mt-2">
              Enable two-factor authentication for enhanced security
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Extra security layer</h4>
                <p className="text-sm text-muted-foreground">
                  Protect your account even if your password is compromised
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                <Smartphone className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Use your phone</h4>
                <p className="text-sm text-muted-foreground">
                  Generate codes with apps like Google Authenticator or Authy
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                <Download className="h-4 w-4 text-green-600" />
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
              We recommend enabling 2FA to keep your workspace secure, especially if you&apos;re
              working with sensitive data.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Button
              onClick={() => setStep('qr')}
              className="bg-gradient-primary w-full hover:opacity-90"
            >
              <Shield className="mr-2 h-4 w-4" />
              Set up two-factor authentication
            </Button>

            <Button variant="outline" onClick={onSkip} className="w-full">
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
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <QrCode className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Scan QR code</CardTitle>
            <CardDescription className="mt-2">
              Use your authenticator app to scan this QR code
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Mock QR Code */}
          <div className="flex justify-center">
            <div className="flex h-48 w-48 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100">
              <div className="text-center">
                <QrCode className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                <p className="text-sm text-gray-500">QR Code</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg bg-muted p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Manual entry key</p>
                  <p className="text-xs text-muted-foreground">
                    Can&apos;t scan? Enter this key manually
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleCopySecret}>
                  <Copy className="mr-1 h-3 w-3" />
                  Copy
                </Button>
              </div>
              <p className="mt-2 rounded border bg-background p-2 font-mono text-sm">{secretKey}</p>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Popular authenticator apps:</p>
            <p className="mt-1">Google Authenticator • Microsoft Authenticator • Authy</p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => setStep('verify')}
              className="bg-gradient-primary w-full hover:opacity-90"
            >
              I&apos;ve scanned the QR code
            </Button>

            <Button variant="outline" onClick={() => setStep('intro')} className="w-full">
              Back
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
          <Smartphone className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <CardTitle className="text-2xl font-bold">Enter verification code</CardTitle>
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
            onChange={e => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="text-center text-lg tracking-widest"
            maxLength={6}
          />
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start space-x-3">
            <Download className="mt-0.5 h-5 w-5 text-amber-600" />
            <div className="flex-1">
              <h4 className="font-medium text-amber-900">Save your backup codes</h4>
              <p className="mb-3 mt-1 text-sm text-amber-800">
                Store these codes safely. You can use them to access your account if you lose your
                phone.
              </p>
              <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                {backupCodes.map((code, index) => (
                  <div key={index} className="rounded border bg-white p-2">
                    {code}
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={handleCopyBackupCodes} className="mt-3">
                <Copy className="mr-1 h-3 w-3" />
                Copy codes
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleVerify}
            disabled={verificationCode.length !== 6 || isVerifying}
            className="bg-gradient-primary w-full hover:opacity-90"
          >
            {isVerifying ? (
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Verifying...
              </div>
            ) : (
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4" />
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
