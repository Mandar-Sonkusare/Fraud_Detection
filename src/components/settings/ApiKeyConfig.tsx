import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getXApiKey, setXApiKey } from "@/lib/api/xApi";

const ApiKeyConfig = () => {
  const [apiKey, setApiKey] = useState('');
  
  useEffect(() => {
    // Get saved API key on component mount
    const savedKey = getXApiKey();
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);
  
  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      const success = setXApiKey(apiKey.trim());
      if (success) {
        toast('API Key Saved', {
          description: 'Your X API key has been saved successfully',
        });
      }
    } else {
      toast('API Key Required', {
        description: 'Please enter a valid API key',
      });
    }
  };
  
  return (
    <Card className="backdrop-blur-sm bg-card/80 border-border">
      <CardHeader>
        <CardTitle>X API Configuration</CardTitle>
        <CardDescription>
          Enter your X API key to fetch real-time data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              X API Key
            </label>
            <div className="flex gap-2">
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your X API key"
                className="bg-background/40 border-border"
              />
              <Button onClick={handleSaveApiKey}>
                Save Key
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              The API key will be stored in your browser's local storage
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyConfig;
