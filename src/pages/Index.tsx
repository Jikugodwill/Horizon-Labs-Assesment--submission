import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Clock, CheckCircle2, Plus, FileText, AlertTriangle, Search, X } from "lucide-react";
import { useTimer } from "@/hooks/useTimer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { Task } from "@/types/Task";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const { timeRemaining, isTimeUp, formatTime, startTimer, resetTimer } = useTimer(3600); // 60 minutes

  // Initial loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, isLoading]);

  const handleStartTest = () => {
    setTestStarted(true);
    startTimer();
  };

  const handleResetTest = () => {
    setTestStarted(false);
    resetTimer();
    setTasks([]);
    setShowForm(false);
    setEditingTask(null);
  };

  const handleAddTask = (task: Task) => {
    if (editingTask) {
      // Update existing task
      setTasks(prevTasks => prevTasks.map(t => t.id === task.id ? task : t));
      setEditingTask(null);
    } else {
      // Add new task
      setTasks(prevTasks => [...prevTasks, task]);
    }
    setShowForm(false);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const handleToggleComplete = (id: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearSearch = () => {
    setSearchQuery("");
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search tasks"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
      // Escape to clear search
      if (e.key === 'Escape' && searchQuery) {
        clearSearch();
      }
    };

    if (testStarted && !isLoading) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [testStarted, isLoading, searchQuery]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
                60-Minute Frontend Test
              </h1>
              <p className="text-muted-foreground mt-2">
                Build a Task Management Application
              </p>
            </div>
            <div className="flex items-center gap-4">
              {!testStarted ? (
                <Button onClick={handleStartTest} size="lg" className="bg-primary hover:bg-primary/90">
                  Start Test
                </Button>
              ) : (
                <>
                  <div className={`flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full ${timeRemaining <= 300 ? 'bg-destructive/20 text-destructive' :
                    timeRemaining <= 900 ? 'bg-warning/20 text-warning' :
                      'bg-muted text-muted-foreground'
                    }`}>
                    <Clock className="w-4 h-4" />
                    <span>Time Remaining: {formatTime(timeRemaining)}</span>
                  </div>
                  <Button onClick={handleResetTest} variant="outline" size="sm">
                    Reset Test
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Time Up Alert */}
        {isTimeUp && (
          <Alert className="mb-6 border-destructive bg-destructive/10">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive font-medium">
              Time's up! The 60-minute test period has ended. Please stop coding and review your work.
            </AlertDescription>
          </Alert>
        )}

        {/* Test Not Started State */}
        {!testStarted && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="max-w-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Ready to Start Your 60-Minute Test?</CardTitle>
                <CardDescription className="text-lg">
                  Once you click "Start Test", the timer will begin and you'll have exactly 60 minutes to complete the task management application.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">What you'll be building:</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• TaskCard component with proper TypeScript interfaces</li>
                    <li>• CRUD operations with localStorage persistence</li>
                    <li>• Validated task form with error handling</li>
                    <li>• Responsive design with smooth animations</li>
                    <li>• One advanced feature (search, sort, or drag & drop)</li>
                  </ul>
                </div>
                <div className="flex justify-center pt-4">
                  <Button onClick={handleStartTest} size="lg" className="bg-primary hover:bg-primary/90">
                    <Clock className="w-4 h-4 mr-2" />
                    Start 60-Minute Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading State */}
        {testStarted && isLoading && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="max-w-md">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="relative mb-6">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-primary/40 rounded-full animate-spin animation-delay-150" />
                </div>
                <h3 className="text-lg font-medium mb-2">Loading your workspace...</h3>
                <p className="text-muted-foreground text-center text-sm">
                  Setting up your task management environment
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Test Content - Only show when test is started */}
        {testStarted && !isLoading && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Requirements Panel */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Test Requirements
                    </CardTitle>
                    <CardDescription>
                      Complete these features within 60 minutes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">✅ Project Setup (5min)</h4>
                      <p className="text-xs text-muted-foreground">Understanding the codebase and technologies</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">✅ TaskCard Component (15min)</h4>
                      <p className="text-xs text-muted-foreground">Create reusable task display component</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">✅ State Management (10min)</h4>
                      <p className="text-xs text-muted-foreground">CRUD operations with localStorage</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">✅ Task Form (15min)</h4>
                      <p className="text-xs text-muted-foreground">Form with validation and error handling</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">✅ Styling & UX (10min)</h4>
                      <p className="text-xs text-muted-foreground">Animations, responsive design, accessibility</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">✅ Advanced Feature (5min)</h4>
                      <p className="text-xs text-muted-foreground">Search, sort, or drag & drop</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Application Area */}
              <div className="lg:col-span-2">
                <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-500 delay-200">
                  {/* Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 
                    p-4 rounded-lg bg-card/50 border border-border/50">
                    <div className="space-y-1">
                      <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
                        My Tasks
                        {tasks.length > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary animate-in zoom-in-50 duration-300">
                            {searchQuery ? `${filteredTasks.length}/${tasks.length}` : tasks.length}
                          </span>
                        )}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {tasks.length === 0 
                          ? "Ready to be productive? Add your first task!" 
                          : searchQuery 
                            ? (
                              <span className="flex items-center gap-2">
                                <span>
                                  Showing {filteredTasks.length} of {tasks.length} tasks
                                </span>
                              </span>
                            )
                            : (
                              <span className="flex items-center gap-2">
                                <span>
                                  {tasks.filter(t => t.isCompleted).length} of {tasks.length} completed
                                </span>
                                {tasks.length > 0 && (
                                  <div className="flex-1 max-w-24 bg-muted rounded-full h-1.5 overflow-hidden">
                                    <div 
                                      className={`h-full bg-green-500 progress-bar`}
                                      style={{ 
                                        '--progress': `${(tasks.filter(t => t.isCompleted).length / tasks.length) * 100}%`,
                                        width: `${(tasks.filter(t => t.isCompleted).length / tasks.length) * 100}%` 
                                      } as React.CSSProperties}
                                    />
                                  </div>
                                )}
                              </span>
                            )
                        }
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        setEditingTask(null);
                        setShowForm(!showForm);
                      }}
                      className="transition-all duration-200 hover:scale-105 active:scale-95 
                        bg-primary hover:bg-primary/90 self-start sm:self-auto"
                      disabled={isTimeUp}
                      size="sm"
                    >
                      <Plus className={`w-4 h-4 mr-2 transition-transform duration-200 
                        ${showForm ? 'rotate-45' : 'rotate-0'}`} 
                      />
                      {showForm ? 'Cancel' : 'Add Task'}
                    </Button>
                  </div>

                  {/* Task Form */}
                  {showForm && (
                    <div className="animate-in slide-in-from-top-4 duration-300">
                      <TaskForm 
                        onSubmit={handleAddTask}
                        onCancel={handleCancelForm}
                        editingTask={editingTask}
                      />
                    </div>
                  )}

                  {/* Search Bar */}
                  {tasks.length > 0 && (
                    <div className="animate-in slide-in-from-top-2 duration-300 delay-100">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search tasks by title or description... (Ctrl+K)"
                          className="pl-10 pr-24 transition-all duration-200 focus:scale-[1.01] 
                            hover:border-primary/50 focus:border-primary"
                        />
                        <div className="absolute right-12 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground/60 hidden sm:block">
                          <kbd className="px-1 py-0.5 bg-muted border border-border rounded text-xs">⌘K</kbd>
                        </div>
                        {searchQuery && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearSearch}
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 
                              hover:bg-muted rounded-full transition-all duration-200 hover:scale-110"
                            aria-label="Clear search"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                      {searchQuery && (
                        <div className="mt-2 text-sm text-muted-foreground animate-in fade-in-0 duration-200">
                          {filteredTasks.length === 0 
                            ? `No tasks found for "${searchQuery}"` 
                            : `Found ${filteredTasks.length} task${filteredTasks.length === 1 ? '' : 's'} matching "${searchQuery}"`
                          }
                        </div>
                      )}
                    </div>
                  )}

                  {/* Task List Area */}
                  <div className="space-y-4">
                    {tasks.length === 0 ? (
                      <Card className="border-dashed border-2 hover:border-primary/30 transition-colors 
                        animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-300">
                        <CardContent className="flex flex-col items-center justify-center py-16 px-8">
                          <div className="relative mb-6">
                            <CheckCircle2 className="w-16 h-16 text-muted-foreground/50 animate-pulse" />
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary/20 rounded-full 
                              animate-ping" />
                          </div>
                          <h3 className="text-xl font-medium mb-3 text-center">Ready to get organized?</h3>
                          <p className="text-muted-foreground text-center max-w-md leading-relaxed mb-6">
                            Start building your productivity with your first task. 
                            Click <strong>"Add Task"</strong> above to begin your journey!
                          </p>
                          <div className="flex flex-wrap gap-2 justify-center text-xs text-muted-foreground">
                            <span className="px-2 py-1 bg-muted rounded-full">✨ Set priorities</span>
                            <span className="px-2 py-1 bg-muted rounded-full">📅 Due dates</span>
                            <span className="px-2 py-1 bg-muted rounded-full">✅ Track progress</span>
                          </div>
                        </CardContent>
                      </Card>
                    ) : filteredTasks.length === 0 ? (
                      <Card className="border-dashed border-2 hover:border-primary/30 transition-colors 
                        animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
                        <CardContent className="flex flex-col items-center justify-center py-12 px-8">
                          <div className="relative mb-6">
                            <Search className="w-12 h-12 text-muted-foreground/50" />
                          </div>
                          <h3 className="text-lg font-medium mb-3 text-center">No tasks found</h3>
                          <p className="text-muted-foreground text-center max-w-md leading-relaxed mb-4">
                            No tasks match your search for <strong>"{searchQuery}"</strong>
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={clearSearch}
                            className="transition-all duration-200 hover:scale-105"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Clear Search
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-3">
                        {/* Task Stats */}
                        <div className="flex flex-wrap gap-2 text-xs">
                          {searchQuery && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                              🔍 {filteredTasks.length} filtered
                            </span>
                          )}
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                            ✅ {(searchQuery ? filteredTasks : tasks).filter(t => t.isCompleted).length} completed
                          </span>
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                            ⏳ {(searchQuery ? filteredTasks : tasks).filter(t => !t.isCompleted).length} pending
                          </span>
                          {(searchQuery ? filteredTasks : tasks).some(t => t.dueDate && !t.isCompleted && new Date(t.dueDate) < new Date()) && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full animate-pulse">
                              🚨 {(searchQuery ? filteredTasks : tasks).filter(t => t.dueDate && !t.isCompleted && new Date(t.dueDate) < new Date()).length} overdue
                            </span>
                          )}
                        </div>
                        
                        {/* Task Grid */}
                        <div className="grid gap-3">
                          {filteredTasks.map((task, index) => (
                            <div
                              key={task.id}
                              className={`animate-in slide-in-from-bottom-2 duration-300 ease-out delay-${Math.min(index * 50, 1000)}`}
                            >
                              <TaskCard 
                                {...task}
                                onEdit={handleEditTask}
                                onDelete={handleDeleteTask}
                                onToggleComplete={handleToggleComplete}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions Footer */}
            <div className="mt-12 pt-8 border-t border-border">
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3">Getting Started Instructions:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-2">1. Create TypeScript Interfaces</h4>
                      <p className="text-muted-foreground">Define the Task interface with proper types</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">2. Build TaskCard Component</h4>
                      <p className="text-muted-foreground">Display task info with edit/delete actions</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">3. Implement State Management</h4>
                      <p className="text-muted-foreground">CRUD operations with localStorage persistence</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">4. Create Task Form</h4>
                      <p className="text-muted-foreground">Validated form with error handling</p>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm">
                      <strong>💡 Pro tip:</strong> Focus on functionality first, then polish the styling.
                      Use the design system tokens (priority.high, priority.medium, priority.low) for consistent colors.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;