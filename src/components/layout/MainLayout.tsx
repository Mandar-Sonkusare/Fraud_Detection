
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
      className="flex items-center px-4 py-3 my-1 rounded-xl text-sm font-medium group transition-all duration-300 relative"
      style={active ? {
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(240, 147, 251, 0.15) 100%)',
        borderLeft: '4px solid #667eea',
        paddingLeft: '12px',
        color: '#667eea',
        fontWeight: 600,
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.2)'
      } : {
        color: '#64748b'
      }}
    >
      <div className="mr-4 h-5 w-5">{icon}</div>
      <span className="flex-1">{label}</span>
      {alert !== undefined && alert > 0 && (
        <Badge className="ml-auto rounded-full px-2 py-1 text-xs text-white font-bold" style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          boxShadow: '0 4px 10px rgba(240, 147, 251, 0.5)'
        }}>
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
    <div className="min-h-screen flex flex-col relative" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradient-flow 15s ease infinite'
    }}>
      {/* Top navbar */}
      <header className="border-b h-16 flex items-center px-8 sticky top-0 z-30" style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderColor: 'rgba(102, 126, 234, 0.2)',
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)'
      }}>
        <div className="flex items-center gap-3 font-bold text-xl">
          <div className="p-2 rounded-xl" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
          }}>
            <Shield className="h-6 w-6 text-white" />
          </div>
          <span style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Social Sentinel AI
          </span>
        </div>
        
        <div className="ml-auto flex items-center gap-6">
          <Button variant="ghost" size="icon" className="relative rounded-xl" style={{
            color: '#667eea'
          }}>
            <Bell className="h-5 w-5" />
            {alertCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 px-1.5 h-5 min-w-5 flex items-center justify-center rounded-full text-xs text-white"
                style={{
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  boxShadow: '0 4px 10px rgba(240, 147, 251, 0.5)'
                }}
              >
                {alertCount}
              </Badge>
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 rounded-xl px-4 py-2" style={{ color: '#475569' }}>
                <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white font-semibold" style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 10px rgba(102, 126, 234, 0.3)'
                }}>
                  AM
                </div>
                <span className="font-medium">Admin</span>
                <ChevronDown className="h-4 w-4 opacity-60" />
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
        <aside className="w-72 flex flex-col" style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(102, 126, 234, 0.2)'
        }}>
          <div className="p-6">
            <div className="px-4 py-3">
              <h2 className="text-xs font-semibold mb-4 uppercase tracking-wider" style={{ color: '#667eea' }}>
                Fraud Detection
              </h2>
              <nav className="space-y-1">
                <NavItem 
                  to="/moderation" 
                  icon={<Shield className="h-5 w-5" />} 
                  label="Fraud Detection" 
                  active={currentPath === "/moderation"}
                />
                <NavItem 
                  to="/dashboard" 
                  icon={<LayoutDashboard className="h-5 w-5" />} 
                  label="Dashboard" 
                  active={currentPath === "/dashboard"} 
                />
              </nav>
            </div>
            
            <Separator className="my-6" style={{ background: 'rgba(102, 126, 234, 0.2)' }} />
            
            <div className="px-4 py-3">
              <h2 className="text-xs font-semibold mb-4 uppercase tracking-wider" style={{ color: '#667eea' }}>
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
          <div className="container px-8 py-8 max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
