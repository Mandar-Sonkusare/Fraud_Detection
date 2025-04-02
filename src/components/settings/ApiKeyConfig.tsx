
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  getXApiKey, 
  setXApiKey, 
  getXApiSecret, 
  setXApiSecret,
  getXAccessToken,
  setXAccessToken,
  getXAccessTokenSecret,
  setXAccessTokenSecret
} from "@/lib/api/xApi";

const ApiKeyConfig = () => {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [accessTokenSecret, setAccessTokenSecret] = useState('');
  
  useEffect(() => {
    // Get saved API credentials on component mount
    const savedKey = getXApiKey();
    const savedSecret = getXApiSecret();
    const savedToken = getXAccessToken();
    const savedTokenSecret = getXAccessTokenSecret();
    
    if (savedKey) setApiKey(savedKey);
    if (savedSecret) setApiSecret(savedSecret);
    if (savedToken) setAccessToken(savedToken);
    if (savedTokenSecret) setAccessTokenSecret(savedTokenSecret);
  }, []);
  
  const handleSaveApiKey = () => {
    if (apiKey.trim() && apiSecret.trim() && accessToken.trim() && accessTokenSecret.trim()) {
      setXApiKey(apiKey.trim());
      setXApiSecret(apiSecret.trim());
      setXAccessToken(accessToken.trim());
      setXAccessTokenSecret(accessTokenSecret.trim());
      
      toast('API Credentials Saved', {
        description: 'Your X API credentials have been saved successfully',
      });
    } else {
      toast('API Credentials Required', {
        description: 'Please enter all the required API credentials',
      });
    }
  };
  
  const handlePreFill = () => {
    setApiKey('1dRLEOrMDei1qfuGs9GSiBEJ6');
    setApiSecret('O042RiLNrUomNzXnoAxTXRJogsHw6yzv8oKSsIAqqJCetlWVce');
    setAccessToken('1469191936418349058-CTmSZKZ6pkjqsmyBYhyK9BaAVgX4Zs');
    setAccessTokenSecret('wIf7mNJ2fwJruySrCVPDvmum6xe5VaXkYxi1XXRlG1Die');
  };
  
  return (
    <Card className="backdrop-blur-sm bg-card/80 border-border">
      <CardHeader>
        <CardTitle>X API Configuration</CardTitle>
        <CardDescription>
          Enter your X API credentials to fetch real-time data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              X API Key
            </label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your X API key"
              className="bg-background/40 border-border"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">
              X API Secret
            </label>
            <Input
              type="password"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              placeholder="Enter your X API secret"
              className="bg-background/40 border-border"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">
              X Access Token
            </label>
            <Input
              type="password"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="Enter your X access token"
              className="bg-background/40 border-border"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">
              X Access Token Secret
            </label>
            <Input
              type="password"
              value={accessTokenSecret}
              onChange={(e) => setAccessTokenSecret(e.target.value)}
              placeholder="Enter your X access token secret"
              className="bg-background/40 border-border"
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleSaveApiKey} className="flex-1">
              Save Credentials
            </Button>
            <Button variant="outline" onClick={handlePreFill}>
              Pre-fill Demo Keys
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            The API credentials will be stored in your browser's local storage
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyConfig;
