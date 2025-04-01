
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, ChevronDown, Home, LayoutDashboard, MessageSquare, Settings, Shield, User } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  alert?: number;
}

const NavItem = ({ to, icon, label, active, alert }: NavItemProps) => (
  <Link to={to}>
    <div
      className={`flex items-center px-3 py-2 my-1 rounded-md text-sm font-medium group transition-colors ${
        active
          ? "bg-accent text-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      }`}
    >
      <div className="mr-3 h-5 w-5">{icon}</div>
      <span>{label}</span>
      {alert !== undefined && alert > 0 && (
        <Badge className="ml-auto bg-alert-high text-white">
          {alert}
        </Badge>
      )}
    </div>
  </Link>
);

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Mock data for notifications
  const alertCount = 5;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top navbar */}
      <header className="border-b border-border bg-background/95 backdrop-blur h-14 flex items-center px-6 sticky top-0 z-30">
        <div className="flex items-center gap-2 font-bold text-lg text-primary">
          <Shield className="h-5 w-5 text-accent" />
          <span>Social Sentinel AI</span>
        </div>
        
        <div className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {alertCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 px-1.5 h-5 min-w-5 flex items-center justify-center bg-alert-high text-white"
              >
                {alertCount}
              </Badge>
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium">
                  AM
                </div>
                <span>Admin</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-sidebar flex flex-col border-r border-border">
          <div className="p-4">
            <div className="px-3 py-2">
              <h2 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                Monitoring
              </h2>
              <nav className="space-y-1">
                <NavItem 
                  to="/" 
                  icon={<Home className="h-5 w-5" />} 
                  label="Overview" 
                  active={currentPath === "/"} 
                />
                <NavItem 
                  to="/dashboard" 
                  icon={<LayoutDashboard className="h-5 w-5" />} 
                  label="Dashboard" 
                  active={currentPath === "/dashboard"} 
                />
                <NavItem 
                  to="/moderation" 
                  icon={<MessageSquare className="h-5 w-5" />} 
                  label="Moderation Queue" 
                  active={currentPath === "/moderation"}
                  alert={13}
                />
              </nav>
            </div>
            
            <Separator className="my-4 bg-border/50" />
            
            <div className="px-3 py-2">
              <h2 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                Configuration
              </h2>
              <nav className="space-y-1">
                <NavItem 
                  to="/settings" 
                  icon={<Settings className="h-5 w-5" />} 
                  label="Settings" 
                  active={currentPath === "/settings"} 
                />
              </nav>
            </div>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="container px-6 py-6 max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
