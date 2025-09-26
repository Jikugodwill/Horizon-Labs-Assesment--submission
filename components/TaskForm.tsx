import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Task, TaskFormData, Priority } from "@/types/Task";
import { Save, X, AlertCircle } from "lucide-react";

interface TaskFormProps {
  onSubmit: (task: Task) => void;
  onCancel: () => void;
  editingTask?: Task | null;
}

export const TaskForm = ({ onSubmit, onCancel, editingTask }: TaskFormProps) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'medium' as Priority,
    dueDate: ''
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editingTask) {
      const newFormData = {
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        dueDate: editingTask.dueDate ? new Date(editingTask.dueDate).toISOString().split('T')[0] : ''
      };
      setFormData(newFormData);
      setHasChanges(false);
    } else {
      setHasChanges(false);
    }
  }, [editingTask]);

  // Track form changes
  useEffect(() => {
    const initialData = editingTask ? {
      title: editingTask.title,
      description: editingTask.description,
      priority: editingTask.priority,
      dueDate: editingTask.dueDate ? new Date(editingTask.dueDate).toISOString().split('T')[0] : ''
    } : {
      title: '',
      description: '',
      priority: 'medium' as Priority,
      dueDate: ''
    };
    
    const hasFormChanges = JSON.stringify(formData) !== JSON.stringify(initialData);
    setHasChanges(hasFormChanges);
  }, [formData, editingTask]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }

    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    // Simulate brief loading for better UX
    await new Promise(resolve => setTimeout(resolve, 200));

    const task: Task = {
      id: editingTask?.id || `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: formData.title.trim(),
      description: formData.description?.trim() || '',
      priority: formData.priority,
      isCompleted: editingTask?.isCompleted || false,
      dueDate: formData.dueDate ? new Date(formData.dueDate).getTime() : undefined,
      createdAt: editingTask?.createdAt || Date.now()
    };

    onSubmit(task);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: ''
    });
    setErrors({});
    setIsSubmitting(false);
    setHasChanges(false);
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: ''
    });
    setErrors({});
    setHasChanges(false);
    setIsSubmitting(false);
    onCancel();
  };

  return (
    <Card className="animate-in slide-in-from-top-4 duration-300 ease-out">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <div className={`w-2 h-6 rounded-full transition-colors duration-300 ${
            editingTask ? 'bg-blue-500' : 'bg-green-500'
          }`} />
          {editingTask ? 'Edit Task' : 'Add New Task'}
          {hasChanges && (
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" aria-hidden="true" />
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title Field */}
          <div className="space-y-2 animate-in slide-in-from-left-2 duration-300 delay-75">
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What needs to be done?"
              disabled={isSubmitting}
              className={`transition-all duration-200 focus:scale-[1.01] ${
                errors.title 
                  ? 'border-red-500 bg-red-50/50 focus:border-red-500' 
                  : 'focus:border-primary hover:border-primary/50'
              }`}
              maxLength={100}
              aria-describedby={errors.title ? "title-error" : undefined}
            />
            {errors.title && (
              <Alert variant="destructive" className="py-2 animate-in slide-in-from-top-2 duration-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm" id="title-error">
                  {errors.title}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2 animate-in slide-in-from-left-2 duration-300 delay-100">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add more details... (optional)"
              disabled={isSubmitting}
              rows={3}
              maxLength={500}
              className="transition-all duration-200 focus:scale-[1.01] resize-none 
                focus:border-primary hover:border-primary/50"
            />
            <div className="text-xs text-muted-foreground text-right">
              {formData.description?.length || 0}/500
            </div>
          </div>

          {/* Priority and Date Row - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Priority Field */}
            <div className="space-y-2 animate-in slide-in-from-left-2 duration-300 delay-125">
              <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: Priority) => setFormData({ ...formData, priority: value })}
                disabled={isSubmitting}
              >
                <SelectTrigger 
                  id="priority"
                  className="transition-all duration-200 hover:border-primary/50 focus:border-primary"
                >
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low" className="focus:bg-green-50">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      Low Priority
                    </div>
                  </SelectItem>
                  <SelectItem value="medium" className="focus:bg-yellow-50">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      Medium Priority
                    </div>
                  </SelectItem>
                  <SelectItem value="high" className="focus:bg-red-50">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      High Priority
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Due Date Field */}
            <div className="space-y-2 animate-in slide-in-from-left-2 duration-300 delay-150">
              <Label htmlFor="dueDate" className="text-sm font-medium">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                disabled={isSubmitting}
                min={new Date().toISOString().split('T')[0]}
                className={`transition-all duration-200 focus:scale-[1.01] ${
                  errors.dueDate 
                    ? 'border-red-500 bg-red-50/50 focus:border-red-500' 
                    : 'focus:border-primary hover:border-primary/50'
                }`}
                aria-describedby={errors.dueDate ? "date-error" : undefined}
              />
              {errors.dueDate && (
                <Alert variant="destructive" className="py-2 animate-in slide-in-from-top-2 duration-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm" id="date-error">
                    {errors.dueDate}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border/50 
            animate-in slide-in-from-bottom-2 duration-300 delay-200">
            <Button 
              type="submit" 
              className="flex-1 transition-all duration-200 hover:scale-[1.02] disabled:scale-100"
              disabled={isSubmitting || !formData.title.trim()}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  {editingTask ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {editingTask ? 'Update Task' : 'Add Task'}
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 transition-all duration-200 hover:scale-[1.02] disabled:scale-100"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>

          {/* Unsaved changes indicator */}
          {hasChanges && !isSubmitting && (
            <div className="text-xs text-orange-600 flex items-center gap-1.5 animate-in fade-in-0 duration-300">
              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
              You have unsaved changes
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};