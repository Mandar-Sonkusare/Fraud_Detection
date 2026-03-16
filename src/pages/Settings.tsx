
import React from "react";
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle 
} from "@/components/ui/card";
import { Settings as SettingsIcon, Wrench } from "lucide-react";
import ApiKeyConfig from "@/components/settings/ApiKeyConfig";

const Settings = () => {
  return (
    <div className="space-y-8 slide-in">
      <div>
        <h1 
          className="text-5xl font-bold tracking-tight gradient-text mb-3"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          Settings
        </h1>
        <p className="text-lg text-gray-400">
          Configure your application settings and API connections
        </p>
      </div>
      
      <div className="grid gap-6">
        <ApiKeyConfig />
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl text-white">
              <div 
                className="p-2 rounded-lg"
                style={{ background: 'rgba(120, 119, 198, 0.2)' }}
              >
                <Wrench className="h-5 w-5" style={{ color: '#7877c6' }} />
              </div>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Application Settings</span>
            </CardTitle>
            <CardDescription className="text-base text-gray-400">
              Customize how the application works
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div 
                className="p-3 rounded-xl inline-block mb-4"
                style={{ 
                  background: 'rgba(120, 119, 198, 0.1)',
                  border: '1px solid rgba(120, 119, 198, 0.2)'
                }}
              >
                <SettingsIcon className="h-10 w-10" style={{ color: '#7877c6' }} />
              </div>
              <p className="text-gray-400 text-base">
                More settings will be available in future updates.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
