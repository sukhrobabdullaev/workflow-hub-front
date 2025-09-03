import { useState } from 'react';
import { Check, X, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PasswordStrengthInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    id?: string;
    required?: boolean;
    showStrength?: boolean;
}

interface PasswordRequirement {
    id: string;
    label: string;
    test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
    {
        id: 'length',
        label: 'At least 8 characters',
        test: (password) => password.length >= 8,
    },
    {
        id: 'uppercase',
        label: 'One uppercase letter',
        test: (password) => /[A-Z]/.test(password),
    },
    {
        id: 'lowercase',
        label: 'One lowercase letter',
        test: (password) => /[a-z]/.test(password),
    },
    {
        id: 'number',
        label: 'One number',
        test: (password) => /\d/.test(password),
    },
    {
        id: 'special',
        label: 'One special character',
        test: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
];

export const PasswordStrengthInput = ({
    value,
    onChange,
    placeholder = 'Enter your password',
    id = 'password',
    required = false,
    showStrength = true,
}: PasswordStrengthInputProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const getPasswordStrength = (password: string) => {
        const passedRequirements = passwordRequirements.filter(req => req.test(password));
        return {
            score: passedRequirements.length,
            requirements: passwordRequirements.map(req => ({
                ...req,
                passed: req.test(password),
            })),
        };
    };

    const getStrengthColor = (score: number) => {
        if (score < 2) return 'text-red-500';
        if (score < 3) return 'text-orange-500';
        if (score < 4) return 'text-yellow-500';
        if (score < 5) return 'text-blue-500';
        return 'text-green-500';
    };

    const getStrengthLabel = (score: number) => {
        if (score < 2) return 'Weak';
        if (score < 3) return 'Fair';
        if (score < 4) return 'Good';
        if (score < 5) return 'Strong';
        return 'Excellent';
    };

    const getStrengthBarColor = (score: number) => {
        if (score < 2) return 'bg-red-500';
        if (score < 3) return 'bg-orange-500';
        if (score < 4) return 'bg-yellow-500';
        if (score < 5) return 'bg-blue-500';
        return 'bg-green-500';
    };

    const strength = getPasswordStrength(value);
    const showRequirements = showStrength && (isFocused || value.length > 0);

    return (
        <div className="space-y-2">
            <Label htmlFor={id}>Password</Label>
            <div className="relative">
                <Input
                    id={id}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    required={required}
                    className="pr-10"
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

            {showRequirements && (
                <div className="space-y-3 p-3 bg-muted/30 rounded-lg border">
                    {/* Strength Bar */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Password strength</span>
                            <span className={`font-medium ${getStrengthColor(strength.score)}`}>
                                {getStrengthLabel(strength.score)}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all duration-300 ${getStrengthBarColor(strength.score)}`}
                                style={{ width: `${(strength.score / 5) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Requirements List */}
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground mb-2">Password must contain:</p>
                        {strength.requirements.map((requirement) => (
                            <div key={requirement.id} className="flex items-center space-x-2 text-sm">
                                <div
                                    className={`flex items-center justify-center w-4 h-4 rounded-full transition-colors ${requirement.passed
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-200 text-gray-400'
                                        }`}
                                >
                                    {requirement.passed ? (
                                        <Check className="w-3 h-3" />
                                    ) : (
                                        <X className="w-3 h-3" />
                                    )}
                                </div>
                                <span
                                    className={
                                        requirement.passed ? 'text-green-600' : 'text-muted-foreground'
                                    }
                                >
                                    {requirement.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
