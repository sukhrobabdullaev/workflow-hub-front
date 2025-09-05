import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
    User,
    Shield,
    Bell,
    Eye,
    Camera,
    Save,
    Users,
    Crown,
    UserCheck,
} from 'lucide-react';

const getRoleIcon = (role: string) => {
    switch (role) {
        case 'admin':
            return <Crown className="w-4 h-4" />;
        case 'manager':
            return <Users className="w-4 h-4" />;
        case 'member':
            return <UserCheck className="w-4 h-4" />;
        default:
            return <User className="w-4 h-4" />;
    }
};

const getRoleColor = (role: string) => {
    switch (role) {
        case 'admin':
            return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
        case 'manager':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
        case 'member':
            return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
};

export const Profile = () => {
    const { user, updateProfile, completeOnboarding } = useAuthStore();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        avatar: user?.avatar || '',
        companyName: user?.companyName || '',
        companySize: user?.companySize || '',
        industry: user?.industry || '',
        goals: user?.goals || [],
        bio: '',
        location: '',
        phone: '',
        website: '',
    });

    // Notification settings
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        pushNotifications: true,
        taskUpdates: true,
        projectUpdates: true,
        teamActivity: false,
        weeklyReports: true,
    });

    // Privacy settings
    const [privacy, setPrivacy] = useState({
        profileVisibility: true,
        activityStatus: true,
        showEmail: false,
        showPhone: false,
    });

    const handleSave = () => {
        updateProfile(formData);
        setIsEditing(false);
        toast({
            title: 'Profile Updated',
            description: 'Your profile has been successfully updated.',
        });
    };

    const handleAvatarChange = () => {
        // In a real app, this would open a file picker
        toast({
            title: 'Avatar Upload',
            description: 'Avatar upload functionality would be implemented here.',
        });
    };

    const handleCompleteOnboarding = () => {
        if (!user?.onboardingCompleted) {
            completeOnboarding({
                companyName: formData.companyName,
                companySize: formData.companySize,
                industry: formData.industry,
            });
            toast({
                title: 'Onboarding Complete!',
                description: 'Your account setup is now complete.',
            });
        }
    };

    if (!user) return null;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <User className="w-8 h-8" />
                        Profile Settings
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your account settings and preferences
                    </p>
                </div>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Security
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="privacy" className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Privacy
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6 mt-6">
                    {/* Profile Header */}
                    <Card className="shadow-soft">
                        <CardHeader>
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback className="text-xl bg-primary/10 text-primary">
                                            {user.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                                        onClick={handleAvatarChange}
                                    >
                                        <Camera className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-2xl font-bold">{user.name}</h2>
                                        <Badge className={getRoleIcon(user.role) && getRoleColor(user.role)}>
                                            {getRoleIcon(user.role)}
                                            <span className="ml-1 capitalize">{user.role}</span>
                                        </Badge>
                                    </div>
                                    <p className="text-muted-foreground">{user.email}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Member since {new Date().toLocaleDateString()}
                                    </p>
                                </div>
                                <Button
                                    variant={isEditing ? 'default' : 'outline'}
                                    onClick={() => setIsEditing(!isEditing)}
                                >
                                    {isEditing ? 'Cancel' : 'Edit Profile'}
                                </Button>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Profile Form */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="shadow-soft">
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>Update your personal details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="City, Country"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="Tell us about yourself..."
                                        rows={3}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-soft">
                            <CardHeader>
                                <CardTitle>Professional Information</CardTitle>
                                <CardDescription>Your work and company details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="company">Company</Label>
                                    <Input
                                        id="company"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="industry">Industry</Label>
                                    <Input
                                        id="industry"
                                        value={formData.industry}
                                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="company-size">Company Size</Label>
                                    <Input
                                        id="company-size"
                                        value={formData.companySize}
                                        onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="e.g., 10-50 employees"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="website">Website</Label>
                                    <Input
                                        id="website"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="https://yourwebsite.com"
                                    />
                                </div>

                                {/* Onboarding Goals */}
                                {user?.goals && user.goals.length > 0 && (
                                    <div className="space-y-3 pt-4 border-t">
                                        <h4 className="font-medium">Goals & Objectives</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {user.goals.map((goal, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {goal}
                                                </Badge>
                                            ))}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Goals set during onboarding
                                        </p>
                                    </div>
                                )}

                                {/* Onboarding Status */}
                                <div className="space-y-3 pt-4 border-t">
                                    <h4 className="font-medium">Account Status</h4>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant={user?.onboardingCompleted ? "default" : "secondary"}
                                            className={user?.onboardingCompleted ? "bg-green-100 text-green-800" : ""}
                                        >
                                            {user?.onboardingCompleted ? "Onboarding Complete" : "Onboarding Pending"}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {user?.onboardingCompleted
                                            ? "You've completed the initial setup process"
                                            : "Complete your onboarding to access all features"
                                        }
                                    </p>
                                    {!user?.onboardingCompleted && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={handleCompleteOnboarding}
                                            className="mt-2"
                                        >
                                            Complete Onboarding
                                        </Button>
                                    )}
                                </div>

                                {/* Role-specific information */}
                                {user.role === 'manager' && (
                                    <div className="space-y-3 pt-4 border-t">
                                        <h4 className="font-medium flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            Manager Privileges
                                        </h4>
                                        <div className="space-y-2 text-sm text-muted-foreground">
                                            <p>• Manage team members and assignments</p>
                                            <p>• Create and oversee projects</p>
                                            <p>• View team analytics and reports</p>
                                            <p>• Approve task completions</p>
                                        </div>
                                    </div>
                                )}

                                {user.role === 'admin' && (
                                    <div className="space-y-3 pt-4 border-t">
                                        <h4 className="font-medium flex items-center gap-2">
                                            <Crown className="w-4 h-4" />
                                            Admin Privileges
                                        </h4>
                                        <div className="space-y-2 text-sm text-muted-foreground">
                                            <p>• Full system administration</p>
                                            <p>• User and role management</p>
                                            <p>• Billing and subscription control</p>
                                            <p>• System settings and configuration</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {isEditing && (
                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} className="bg-gradient-primary hover:opacity-90">
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="security" className="space-y-6 mt-6">
                    <Card className="shadow-soft">
                        <CardHeader>
                            <CardTitle>Password & Security</CardTitle>
                            <CardDescription>Manage your account security settings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <h4 className="font-medium">Change Password</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="current-password">Current Password</Label>
                                        <Input id="current-password" type="password" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new-password">New Password</Label>
                                        <Input id="new-password" type="password" />
                                    </div>
                                </div>
                                <Button variant="outline">Update Password</Button>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h4 className="font-medium">Two-Factor Authentication</h4>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm">Add an extra layer of security to your account</p>
                                        <p className="text-xs text-muted-foreground">
                                            Status: {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                                        </p>
                                    </div>
                                    <Switch checked={user.twoFactorEnabled} />
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h4 className="font-medium">Active Sessions</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                            <p className="font-medium">Current Session</p>
                                            <p className="text-sm text-muted-foreground">Chrome on macOS • Active now</p>
                                        </div>
                                        <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6 mt-6">
                    <Card className="shadow-soft">
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>Choose how you want to be notified</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <h4 className="font-medium">General Notifications</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Email Notifications</p>
                                            <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                                        </div>
                                        <Switch
                                            checked={notifications.emailNotifications}
                                            onCheckedChange={(checked) =>
                                                setNotifications({ ...notifications, emailNotifications: checked })
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Push Notifications</p>
                                            <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                                        </div>
                                        <Switch
                                            checked={notifications.pushNotifications}
                                            onCheckedChange={(checked) =>
                                                setNotifications({ ...notifications, pushNotifications: checked })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h4 className="font-medium">Activity Notifications</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Task Updates</p>
                                            <p className="text-sm text-muted-foreground">When tasks are assigned or updated</p>
                                        </div>
                                        <Switch
                                            checked={notifications.taskUpdates}
                                            onCheckedChange={(checked) =>
                                                setNotifications({ ...notifications, taskUpdates: checked })
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Project Updates</p>
                                            <p className="text-sm text-muted-foreground">When projects are created or modified</p>
                                        </div>
                                        <Switch
                                            checked={notifications.projectUpdates}
                                            onCheckedChange={(checked) =>
                                                setNotifications({ ...notifications, projectUpdates: checked })
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Team Activity</p>
                                            <p className="text-sm text-muted-foreground">When team members join or leave</p>
                                        </div>
                                        <Switch
                                            checked={notifications.teamActivity}
                                            onCheckedChange={(checked) =>
                                                setNotifications({ ...notifications, teamActivity: checked })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h4 className="font-medium">Reports & Summaries</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Weekly Reports</p>
                                            <p className="text-sm text-muted-foreground">Weekly summary of your activity</p>
                                        </div>
                                        <Switch
                                            checked={notifications.weeklyReports}
                                            onCheckedChange={(checked) =>
                                                setNotifications({ ...notifications, weeklyReports: checked })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="privacy" className="space-y-6 mt-6">
                    <Card className="shadow-soft">
                        <CardHeader>
                            <CardTitle>Privacy Settings</CardTitle>
                            <CardDescription>Control your privacy and data visibility</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <h4 className="font-medium">Profile Visibility</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Public Profile</p>
                                            <p className="text-sm text-muted-foreground">Allow others to view your profile</p>
                                        </div>
                                        <Switch
                                            checked={privacy.profileVisibility}
                                            onCheckedChange={(checked) =>
                                                setPrivacy({ ...privacy, profileVisibility: checked })
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Activity Status</p>
                                            <p className="text-sm text-muted-foreground">Show when you're online</p>
                                        </div>
                                        <Switch
                                            checked={privacy.activityStatus}
                                            onCheckedChange={(checked) =>
                                                setPrivacy({ ...privacy, activityStatus: checked })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h4 className="font-medium">Contact Information</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Show Email</p>
                                            <p className="text-sm text-muted-foreground">Display email in your profile</p>
                                        </div>
                                        <Switch
                                            checked={privacy.showEmail}
                                            onCheckedChange={(checked) =>
                                                setPrivacy({ ...privacy, showEmail: checked })
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Show Phone</p>
                                            <p className="text-sm text-muted-foreground">Display phone number in your profile</p>
                                        </div>
                                        <Switch
                                            checked={privacy.showPhone}
                                            onCheckedChange={(checked) =>
                                                setPrivacy({ ...privacy, showPhone: checked })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};
