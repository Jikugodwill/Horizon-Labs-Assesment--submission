import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2, Calendar, Clock, CheckCircle2 } from "lucide-react";
import { Task } from "@/types/Task";

interface TaskCardProps extends Task {
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export const TaskCard = ({ 
  id, 
  title, 
  description, 
  priority, 
  isCompleted, 
  dueDate, 
  createdAt,
  onEdit, 
  onDelete, 
  onToggleComplete 
}: TaskCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
    }
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return null;
    return new Date(timestamp).toLocaleDateString();
  };

  const isOverdue = dueDate && !isCompleted && new Date(dueDate) < new Date();

  const taskData: Task = {
    id,
    title,
    description,
    priority,
    isCompleted,
    dueDate,
    createdAt
  };

  return (
    <Card 
      className={`group relative overflow-hidden transition-all duration-300 ease-out
        ${isCompleted 
          ? 'opacity-60 scale-[0.98] bg-muted/30' 
          : 'hover:scale-[1.01] hover:bg-card/80'
        } 
        transform-gpu will-change-transform border-l-4 
        ${priority === 'high' ? 'border-l-red-500' : 
          priority === 'medium' ? 'border-l-yellow-500' : 
          'border-l-green-500'
        }`}
      role="article"
      aria-label={`Task: ${title}`}
    >
      <CardHeader className="pb-3 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Checkbox
              checked={isCompleted}
              onCheckedChange={() => onToggleComplete(id)}
              className="mt-1 transition-transform duration-200 hover:scale-110"
              aria-label={`Mark task "${title}" as ${isCompleted ? 'incomplete' : 'complete'}`}
            />
            <div className="flex-1 min-w-0 space-y-1">
              <CardTitle 
                className={`text-base sm:text-lg leading-tight transition-all duration-300
                  ${isCompleted 
                    ? 'line-through text-muted-foreground transform translate-x-1' 
                    : 'text-foreground'
                  }`}
              >
                {title}
              </CardTitle>
              {description && (
                <p className={`text-sm leading-relaxed transition-all duration-300 
                  ${isCompleted ? 'text-muted-foreground/70' : 'text-muted-foreground'}
                `}>
                  {description}
                </p>
              )}
            </div>
          </div>
          
          {/* Priority Badge - Mobile responsive */}
          <div className="flex-shrink-0">
            <Badge 
              variant="outline" 
              className={`${getPriorityColor(priority)} transition-all duration-200 
                hover:scale-105 text-xs font-medium animate-in fade-in-0 slide-in-from-right-2`}
            >
              <span className="hidden sm:inline">
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </span>
              <span className="sm:hidden">
                {priority.charAt(0).toUpperCase()}
              </span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3">
        {/* Date Information - Stack on mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
          {dueDate && (
            <div className={`flex items-center gap-1.5 transition-colors duration-200
              ${isOverdue ? 'text-red-600 animate-pulse' : 'text-muted-foreground'}
            `}>
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="font-medium">Due: {formatDate(dueDate)}</span>
              {isOverdue && (
                <span className="text-red-600 font-semibold animate-in fade-in-0 slide-in-from-right-1">
                  (Overdue)
                </span>
              )}
            </div>
          )}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span>Created: {formatDate(createdAt)}</span>
          </div>
        </div>
        
        {/* Action Buttons - Better mobile layout */}
        <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-border/50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(taskData)}
            className="h-8 px-3 sm:px-2 sm:w-8 transition-all duration-200 hover:scale-105 
              hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 group-hover:opacity-100 
              opacity-70 focus:opacity-100"
            aria-label={`Edit task "${title}"`}
          >
            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="ml-1 sm:hidden text-xs">Edit</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(id)}
            className="h-8 px-3 sm:px-2 sm:w-8 transition-all duration-200 hover:scale-105 
              text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200 
              group-hover:opacity-100 opacity-70 focus:opacity-100"
            aria-label={`Delete task "${title}"`}
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="ml-1 sm:hidden text-xs">Delete</span>
          </Button>
        </div>
      </CardContent>
      
      {/* Completion overlay animation */}
      {isCompleted && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-green-500/5 animate-in fade-in-0 duration-500" />
          <div className="absolute top-2 right-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 animate-in zoom-in-50 duration-300 delay-200" />
          </div>
        </div>
      )}
    </Card>
  );
};