
import React from "react";
import { Link } from "react-router-dom";
import { Shield, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="cyber-grid" />
      
      {/* Ambient Glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 30% 40%, rgba(72, 219, 251, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 70% 60%, rgba(255, 107, 107, 0.12) 0%, transparent 50%)
          `
        }}
      />
      
      <div className="relative z-10 text-center px-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <div 
            className="p-3 rounded-xl animate-float"
            style={{
              background: 'linear-gradient(135deg, #48dbfb 0%, #7877c6 100%)',
              boxShadow: '0 8px 30px rgba(72, 219, 251, 0.4)'
            }}
          >
            <Shield className="h-7 w-7 text-white" />
          </div>
          <span 
            className="font-bold text-2xl gradient-text"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Social Sentinel AI
          </span>
        </div>
        
        {/* 404 Number */}
        <div 
          className="text-[10rem] font-black leading-none mb-4"
          style={{ 
            fontFamily: 'Space Grotesk, sans-serif',
            background: 'linear-gradient(135deg, #48dbfb 0%, #7877c6 50%, #ff6b6b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            backgroundSize: '200% 200%',
            animation: 'gradientFlow 3s ease infinite',
            textShadow: 'none',
            filter: 'drop-shadow(0 0 60px rgba(72, 219, 251, 0.3))'
          }}
        >
          404
        </div>
        
        <h1 
          className="text-3xl font-bold text-white mb-4"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          Page Not Found
        </h1>
        <p className="text-lg text-gray-400 mb-10 max-w-md mx-auto">
          The page you are looking for does not exist or has been moved to a different location.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <button className="neon-button flex items-center gap-2 px-8">
              <ArrowLeft className="h-5 w-5" />
              Return Home
            </button>
          </Link>
          <Link to="/moderation">
            <button 
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                color: 'white'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(72, 219, 251, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <Search className="h-5 w-5" />
              Fraud Detection
            </button>
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-8 text-gray-600 text-sm">
        © Social Sentinel AI {new Date().getFullYear()} — All rights reserved
      </div>
    </div>
  );
};

export default NotFound;
