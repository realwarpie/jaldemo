import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Dashboard } from "@/components/Dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header 
        unreadNotifications={3}
        currentUser={{
          name: "Dr. Demo",
          role: "PHC Administrator",
          phc: "Guwahati PHC"
        }}
        onNotificationsClick={() => console.log('Notifications clicked')}
        onSettingsClick={() => console.log('Settings clicked')}
        onProfileClick={() => console.log('Profile clicked')}
      />
      <main className="container mx-auto px-4 py-6">
        <Dashboard />
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider defaultTheme="light">
          <Toaster />
          <Router />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
