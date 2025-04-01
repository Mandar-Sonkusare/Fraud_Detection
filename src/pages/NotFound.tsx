
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-8">
      <div className="flex items-center gap-2 font-bold text-2xl text-primary mb-6">
        <ShieldAlert className="h-6 w-6 text-accent" />
        <span>Social Sentinel AI</span>
      </div>
      
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sentinel-300 to-sentinel-600 mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-muted-foreground mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link to="/">
            <Button variant="default" size="lg">
              Return to Dashboard
            </Button>
          </Link>
          <Link to="/moderation">
            <Button variant="outline" size="lg">
              Go to Moderation Queue
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="mt-16 text-muted-foreground text-sm">
        &copy; Social Sentinel AI {new Date().getFullYear()} - All rights reserved
      </div>
    </div>
  );
};

export default NotFound;
