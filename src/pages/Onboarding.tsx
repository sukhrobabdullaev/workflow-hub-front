import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Users,
  ArrowRight,
  Check,
  Rocket,
  Target,
  Calendar,
  MessageSquare,
  FileText,
  BarChart3,
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
}

export const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form data
  const [companyName, setCompanyName] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [industry, setIndustry] = useState('');
  const [role, setRole] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [goals, setGoals] = useState<string[]>([]);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const handleGoalToggle = (goal: string) => {
    setGoals(prev => (prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]));
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to save onboarding data
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: 'Welcome to WorkflowHub!',
        description: 'Your workspace has been set up successfully.',
      });

      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Setup failed',
        description: 'There was an error setting up your workspace.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goalOptions = [
    { id: 'project-management', label: 'Project Management', icon: Target },
    { id: 'team-collaboration', label: 'Team Collaboration', icon: Users },
    { id: 'task-tracking', label: 'Task Tracking', icon: Calendar },
    { id: 'communication', label: 'Communication', icon: MessageSquare },
    { id: 'documentation', label: 'Documentation', icon: FileText },
    { id: 'reporting', label: 'Analytics & Reporting', icon: BarChart3 },
  ];

  const steps: OnboardingStep[] = [
    {
      id: 'company',
      title: 'Tell us about your company',
      description: 'Help us customize WorkflowHub for your organization',
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company name</Label>
            <Input
              id="company-name"
              placeholder="Acme Inc."
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-size">Company size</Label>
            <Select value={companySize} onValueChange={setCompanySize}>
              <SelectTrigger>
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-10">1-10 employees</SelectItem>
                <SelectItem value="11-50">11-50 employees</SelectItem>
                <SelectItem value="51-200">51-200 employees</SelectItem>
                <SelectItem value="201-1000">201-1,000 employees</SelectItem>
                <SelectItem value="1000+">1,000+ employees</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="consulting">Consulting</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ),
    },
    {
      id: 'role',
      title: "What's your role?",
      description: 'This helps us personalize your experience',
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Your role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ceo">CEO/Founder</SelectItem>
                <SelectItem value="cto">CTO</SelectItem>
                <SelectItem value="product-manager">Product Manager</SelectItem>
                <SelectItem value="project-manager">Project Manager</SelectItem>
                <SelectItem value="team-lead">Team Lead</SelectItem>
                <SelectItem value="developer">Developer</SelectItem>
                <SelectItem value="designer">Designer</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="team-size">How many people will use WorkflowHub?</Label>
            <Select value={teamSize} onValueChange={setTeamSize}>
              <SelectTrigger>
                <SelectValue placeholder="Select team size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="just-me">Just me</SelectItem>
                <SelectItem value="2-5">2-5 people</SelectItem>
                <SelectItem value="6-15">6-15 people</SelectItem>
                <SelectItem value="16-50">16-50 people</SelectItem>
                <SelectItem value="50+">50+ people</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ),
    },
    {
      id: 'goals',
      title: 'What are your main goals?',
      description: 'Select all that apply to help us set up the right features',
      component: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {goalOptions.map(goal => {
              const Icon = goal.icon;
              const isSelected = goals.includes(goal.id);

              return (
                <button
                  key={goal.id}
                  onClick={() => handleGoalToggle(goal.id)}
                  className={`flex items-center space-x-3 rounded-lg border-2 p-4 text-left transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-gray-500'}`} />
                  <span className="font-medium">{goal.label}</span>
                  {isSelected && <Check className="ml-auto h-4 w-4 text-primary" />}
                </button>
              );
            })}
          </div>
        </div>
      ),
    },
    {
      id: 'project',
      title: 'Create your first project',
      description: "Let's start with a project to organize your work",
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project name</Label>
            <Input
              id="project-name"
              placeholder="Website Redesign"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-description">Project description (optional)</Label>
            <Textarea
              id="project-description"
              placeholder="Describe what this project is about..."
              value={projectDescription}
              onChange={e => setProjectDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return companyName.trim() !== '';
      case 1:
        return role !== '';
      case 2:
        return goals.length > 0;
      case 3:
        return projectName.trim() !== '';
      default:
        return true;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl shadow-elevated">
        <CardHeader className="space-y-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Rocket className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">WorkflowHub</span>
          </div>

          {/* Progress bar */}
          <div className="mx-auto w-full max-w-md">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(((currentStep + 1) / steps.length) * 100)}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-primary transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <CardTitle className="text-2xl font-bold">{currentStepData.title}</CardTitle>
            <CardDescription className="mt-2">{currentStepData.description}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {currentStepData.component}
          </motion.div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
            >
              Back
            </Button>

            <Button
              onClick={isLastStep ? handleComplete : () => setCurrentStep(prev => prev + 1)}
              disabled={!canProceed() || isLoading}
              className="bg-gradient-primary hover:opacity-90"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Setting up...
                </div>
              ) : isLastStep ? (
                <div className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  Complete setup
                </div>
              ) : (
                <div className="flex items-center">
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
