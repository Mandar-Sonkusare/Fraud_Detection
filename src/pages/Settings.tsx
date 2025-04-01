
import React from "react";
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle 
} from "@/components/ui/card";
import ApiKeyConfig from "@/components/settings/ApiKeyConfig";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your application settings and API connections
        </p>
      </div>
      
      <div className="grid gap-6">
        <ApiKeyConfig />
        
        <Card className="backdrop-blur-sm bg-card/80 border-border">
          <CardHeader>
            <CardTitle>Application Settings</CardTitle>
            <CardDescription>
              Customize how the application works
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              More settings will be available in future updates.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
