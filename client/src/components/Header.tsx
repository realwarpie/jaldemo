import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Badge } from "@/components/ui/badge";
import { Bell, Settings, User, Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
  unreadNotifications?: number;
  currentUser?: {
    name: string;
    role: string;
    phc?: string;
  };
}

export function Header({ 
  onNotificationsClick = () => {},
  onSettingsClick = () => {},
  onProfileClick = () => {},
  unreadNotifications = 0,
  currentUser
}: HeaderProps) {
  const { theme, setTheme } = useTheme();

  //todo: remove mock functionality - replace with real user data
  const user = currentUser || {
    name: "Dr. Demo",
    role: "PHC Administrator", 
    phc: "Guwahati PHC"
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    console.log(`Theme switched to: ${theme === "light" ? "dark" : "light"}`);
  };

  const handleNotifications = () => {
    console.log("Notifications clicked");
    onNotificationsClick();
  };

  const handleSettings = () => {
    console.log("Settings clicked");
    onSettingsClick();
  };

  const handleProfile = () => {
    console.log("Profile clicked");
    onProfileClick();
  };

  return (
    <header className="bg-background border-b border-border px-4 py-3" data-testid="header">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {/* JalSuraksha Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">JS</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">JalSuraksha</h1>
                <p className="text-xs text-muted-foreground">Water-Borne Disease Early Warning System</p>
              </div>
            </div>
          </div>
          
          {/* System Status */}
          <div className="hidden md:flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
              System Active
            </Badge>
            <Badge variant="outline" className="text-xs">
              127 PHCs Online
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <LanguageSwitcher />
          
          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
            className="gap-2"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
          
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                data-testid="button-notifications"
                className="relative"
              >
                <Bell className="h-4 w-4" />
                {unreadNotifications > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white"
                    data-testid="notification-count"
                  >
                    {unreadNotifications > 9 ? "9+" : unreadNotifications}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80" data-testid="notification-dropdown">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <h3 className="font-medium">Notifications</h3>
                <Badge variant="outline" className="ml-auto">
                  {unreadNotifications} new
                </Badge>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <div className="px-4 py-3 border-b hover:bg-accent/50 cursor-pointer">
                  <div className="flex items-start gap-2">
                    <div className="h-2 w-2 mt-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium">Water quality alert in Guwahati</p>
                      <p className="text-xs text-muted-foreground">E. coli levels above threshold detected</p>
                      <p className="text-xs text-muted-foreground mt-1">10 minutes ago</p>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 border-b hover:bg-accent/50 cursor-pointer">
                  <div className="flex items-start gap-2">
                    <div className="h-2 w-2 mt-1.5 rounded-full bg-red-500 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium">Critical: Contamination in Silchar</p>
                      <p className="text-xs text-muted-foreground">Multiple contaminants detected in water supply</p>
                      <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 hover:bg-accent/50 cursor-pointer">
                  <div className="flex items-start gap-2">
                    <div className="h-2 w-2 mt-1.5 rounded-full bg-yellow-500 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium">System update completed</p>
                      <p className="text-xs text-muted-foreground">New risk assessment model deployed</p>
                      <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2 border-t">
                <Button variant="ghost" size="sm" className="w-full justify-center text-xs" onClick={handleNotifications}>
                  View all notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Settings */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleSettings}
            data-testid="button-settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2" data-testid="button-user-menu">
                <User className="h-4 w-4" />
                <span className="hidden md:inline text-sm">{user.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56" data-testid="user-menu-dropdown">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.role}</p>
                {user.phc && (
                  <p className="text-xs text-muted-foreground">{user.phc}</p>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfile} data-testid="menu-profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettings} data-testid="menu-settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem data-testid="menu-logout">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}