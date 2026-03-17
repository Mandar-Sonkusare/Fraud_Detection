import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, Shield, Menu, X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  alert?: number;
  onClick?: () => void;
}

const NavItem = ({ to, icon, label, active, alert, onClick }: NavItemProps) => (
  <Link to={to} onClick={onClick}>
    <div
      className={`flex items-center px-4 py-3 my-1 rounded-xl text-sm font-medium transition-all duration-300 ${
        active 
          ? 'bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 border-l-4 border-neon-cyan text-neon-cyan shadow-lg shadow-neon-cyan/20' 
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <div className="mr-3 h-5 w-5">{icon}</div>
      <span className="flex-1">{label}</span>
      {alert !== undefined && alert > 0 && (
        <Badge className="ml-auto rounded-full px-2 py-1 text-xs font-bold bg-gradient-to-r from-neon-red to-neon-pink text-white border-none shadow-lg shadow-neon-red/40">
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-cyber-bg relative">
      {/* Cyber Grid Background */}
      <div className="cyber-grid" />
      
      {/* Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute rounded-full animate-float"
          style={{
            width: '300px',
            height: '300px',
            top: '10%',
            right: '-50px',
            background: 'radial-gradient(circle, rgba(72, 219, 251, 0.06) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div 
          className="absolute rounded-full"
          style={{
            width: '400px',
            height: '400px',
            bottom: '5%',
            left: '-100px',
            background: 'radial-gradient(circle, rgba(120, 119, 198, 0.06) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animation: 'float 5s ease-in-out infinite reverse',
          }}
        />
        <div 
          className="absolute rounded-full"
          style={{
            width: '250px',
            height: '250px',
            top: '50%',
            left: '40%',
            background: 'radial-gradient(circle, rgba(255, 107, 107, 0.04) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animation: 'float 7s ease-in-out infinite',
          }}
        />
      </div>
      
      {/* Top navbar */}
      <header className="h-16 flex items-center px-6 md:px-8 sticky top-0 z-30 glass-card rounded-none border-b border-neon-cyan/20">
        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-3 text-neon-cyan hover:bg-white/10 rounded-xl"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-cyber rounded-xl shadow-lg shadow-neon-cyan/40">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-xl gradient-text hidden sm:inline" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Social Sentinel AI
          </span>
          <span className="font-bold text-lg gradient-text sm:hidden" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Sentinel
          </span>
        </div>
        
        {/* Removed notification bell and admin profile - not needed for this demo */}
      </header>
      
      <div className="flex flex-1 relative">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          w-72 flex flex-col glass-card rounded-none border-r border-neon-cyan/20
          fixed md:sticky top-16 h-[calc(100vh-4rem)] z-20
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="p-6">
            <div className="px-4 py-3">
              <h2 className="text-xs font-semibold mb-4 uppercase tracking-wider text-neon-cyan">
                Fraud Detection
              </h2>
              <nav className="space-y-1">
                <NavItem 
                  to="/moderation" 
                  icon={<Shield className="h-5 w-5" />} 
                  label="Fraud Detection" 
                  active={currentPath === "/moderation"}
                  onClick={() => setSidebarOpen(false)}
                />
                <NavItem 
                  to="/dashboard" 
                  icon={<LayoutDashboard className="h-5 w-5" />} 
                  label="Dashboard" 
                  active={currentPath === "/dashboard"} 
                  onClick={() => setSidebarOpen(false)}
                />
              </nav>
            </div>
            
            <div className="my-6 h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />
            
            <div className="px-4 py-3">
              <h2 className="text-xs font-semibold mb-4 uppercase tracking-wider text-neon-cyan">
                Configuration
              </h2>
              <nav className="space-y-1">
                <NavItem 
                  to="/settings" 
                  icon={<Settings className="h-5 w-5" />} 
                  label="Settings" 
                  active={currentPath === "/settings"} 
                  onClick={() => setSidebarOpen(false)}
                />
              </nav>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="mt-auto p-6 border-t border-white/5">
            <div className="px-4 py-3 rounded-xl" style={{ background: 'rgba(72, 219, 251, 0.05)', border: '1px solid rgba(72, 219, 251, 0.1)' }}>
              <p className="text-xs text-gray-500 leading-relaxed">
                Powered by <span className="text-neon-cyan font-semibold">AI-Driven</span> fraud detection models
              </p>
            </div>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto relative z-10">
          <div className="container px-4 md:px-8 py-6 md:py-8 max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
