
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getXApiCredentials, setXApiCredentials } from "@/lib/api/xApi";

const ApiKeyConfig = () => {
  const [apiKey, setApiKey] = useState('');
  const [apiKeySecret, setApiKeySecret] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [accessTokenSecret, setAccessTokenSecret] = useState('');
  const [bearerToken, setBearerToken] = useState('');
  
  useEffect(() => {
    // Get saved API credentials on component mount
    const savedCreds = getXApiCredentials();
    if (savedCreds) {
      setApiKey(savedCreds.apiKey || '');
      setApiKeySecret(savedCreds.apiKeySecret || '');
      setAccessToken(savedCreds.accessToken || '');
      setAccessTokenSecret(savedCreds.accessTokenSecret || '');
      setBearerToken(savedCreds.bearerToken || '');
    }
  }, []);
  
  const handleSaveApiKeys = () => {
    if (apiKey.trim() && bearerToken.trim()) {
      const success = setXApiCredentials({
        apiKey: apiKey.trim(),
        apiKeySecret: apiKeySecret.trim(),
        accessToken: accessToken.trim(),
        accessTokenSecret: accessTokenSecret.trim(),
        bearerToken: bearerToken.trim()
      });
      
      if (success) {
        toast('API Keys Saved', {
          description: 'Your X API credentials have been saved successfully',
        });
      }
    } else {
      toast('API Keys Required', {
        description: 'Please enter at least the API key and Bearer token',
      });
    }
  };

  const handlePreFill = () => {
    setApiKey('vmqGF9lz3TDL2EmbYLntCHtaK');
    setApiKeySecret('DEUwh1W4Pmm1jAScI5pXkuAzy5TR07chDZDNGA6Z080Fl32SBz');
    setAccessToken('1469191936418349058-2uWWhpakY7hLMOIvWaTLN08TYHWV67');
    setAccessTokenSecret('WOV2CWeYmoV8cCjPwbWjDKo1hc2ftvAyVSGO1sG2f6WoT');
    setBearerToken('AAAAAAAAAAAAAAAAAAAAABFQ0QEAAAAAk8983Y%2BXAi8lOEkK2jb9To%2BgB%2Fg%3D8opTsFwfptdswcyxSFoyxvTHeoW1Oofo9IRWGxsGFlzMorMvF4');
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
            <div className="flex gap-2 mb-3">
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your X API key"
                className="bg-background/40 border-border"
              />
            </div>

            <label className="text-sm font-medium mb-1 block">
              X API Key Secret
            </label>
            <div className="flex gap-2 mb-3">
              <Input
                type="password"
                value={apiKeySecret}
                onChange={(e) => setApiKeySecret(e.target.value)}
                placeholder="Enter your X API key secret"
                className="bg-background/40 border-border"
              />
            </div>

            <label className="text-sm font-medium mb-1 block">
              X Access Token
            </label>
            <div className="flex gap-2 mb-3">
              <Input
                type="password"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="Enter your X access token"
                className="bg-background/40 border-border"
              />
            </div>

            <label className="text-sm font-medium mb-1 block">
              X Access Token Secret
            </label>
            <div className="flex gap-2 mb-3">
              <Input
                type="password"
                value={accessTokenSecret}
                onChange={(e) => setAccessTokenSecret(e.target.value)}
                placeholder="Enter your X access token secret"
                className="bg-background/40 border-border"
              />
            </div>

            <label className="text-sm font-medium mb-1 block">
              X Bearer Token
            </label>
            <div className="flex gap-2 mb-3">
              <Input
                type="password"
                value={bearerToken}
                onChange={(e) => setBearerToken(e.target.value)}
                placeholder="Enter your X bearer token"
                className="bg-background/40 border-border"
              />
            </div>

            <div className="flex justify-between mt-4">
              <Button onClick={handlePreFill} variant="outline">
                Pre-fill Keys
              </Button>
              <Button onClick={handleSaveApiKeys}>
                Save Keys
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              The API credentials will be stored in your browser's local storage
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyConfig;
