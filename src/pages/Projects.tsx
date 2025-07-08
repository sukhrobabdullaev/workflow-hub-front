import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/appStore';
import { Link } from 'react-router-dom';
import { Kanban } from 'lucide-react';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-success/10 text-success';
    case 'planning':
      return 'bg-warning/10 text-warning';
    case 'completed':
      return 'bg-primary/10 text-primary';
    case 'on-hold':
      return 'bg-destructive/10 text-destructive';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const Projects = () => {
  const { projects, teamMembers } = useAppStore();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track your project portfolio
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-gradient-primary hover:opacity-90">
            New Project
          </Button>
          <Link to="/project-management">
            <Button variant="outline">
              <Kanban className="w-4 h-4 mr-2" />
              Kanban Board
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <Card
            key={project.id}
            className="shadow-soft hover:shadow-elevated transition-all duration-200 cursor-pointer"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </div>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Team Members */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Team</p>
                  <div className="flex -space-x-2">
                    {project.teamMembers.slice(0, 3).map(memberId => {
                      const member = teamMembers.find(m => m.id === memberId);
                      return member ? (
                        <img
                          key={member.id}
                          src={member.avatar}
                          alt={member.name}
                          className="w-8 h-8 rounded-full border-2 border-background object-cover"
                          title={member.name}
                        />
                      ) : null;
                    })}
                    {project.teamMembers.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs text-muted-foreground">
                        +{project.teamMembers.length - 3}
                      </div>
                    )}
                  </div>
                </div>

                {/* Due Date */}
                <div className="text-sm text-muted-foreground">
                  Due: {new Date(project.dueDate).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
