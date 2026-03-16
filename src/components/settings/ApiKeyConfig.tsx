
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getXApiCredentials, setXApiCredentials } from "@/lib/api/xApi";
import { Key, Eye, EyeOff, Save, Zap } from "lucide-react";

const ApiKeyConfig = () => {
  const [apiKey, setApiKey] = useState('');
  const [apiKeySecret, setApiKeySecret] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [accessTokenSecret, setAccessTokenSecret] = useState('');
  const [bearerToken, setBearerToken] = useState('');
  const [showKeys, setShowKeys] = useState(false);
  
  useEffect(() => {
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

  const fields = [
    { label: 'X API Key', value: apiKey, setter: setApiKey, placeholder: 'Enter your X API key', required: true },
    { label: 'X API Key Secret', value: apiKeySecret, setter: setApiKeySecret, placeholder: 'Enter your X API key secret' },
    { label: 'X Access Token', value: accessToken, setter: setAccessToken, placeholder: 'Enter your X access token' },
    { label: 'X Access Token Secret', value: accessTokenSecret, setter: setAccessTokenSecret, placeholder: 'Enter your X access token secret' },
    { label: 'X Bearer Token', value: bearerToken, setter: setBearerToken, placeholder: 'Enter your X bearer token', required: true },
  ];
  
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl text-white">
          <div 
            className="p-2 rounded-lg"
            style={{ background: 'rgba(72, 219, 251, 0.2)' }}
          >
            <Key className="h-5 w-5 text-neon-cyan" />
          </div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif' }}>X API Configuration</span>
        </CardTitle>
        <CardDescription className="text-base text-gray-400">
          Enter your X API credentials to fetch real-time data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5 max-w-2xl">
          {/* Toggle visibility */}
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowKeys(!showKeys)}
              className="text-gray-400 hover:text-white hover:bg-white/10 gap-2"
            >
              {showKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showKeys ? 'Hide Keys' : 'Show Keys'}
            </Button>
          </div>

          {fields.map((field, idx) => (
            <div key={idx} className="space-y-2">
              <label className="text-sm font-semibold text-neon-cyan flex items-center gap-2">
                {field.label}
                {field.required && (
                  <span className="text-xs text-neon-red/70 font-normal">Required</span>
                )}
              </label>
              <Input
                type={showKeys ? 'text' : 'password'}
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                placeholder={field.placeholder}
                className="bg-white/5 border-2 border-white/10 text-white placeholder:text-gray-500 focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 rounded-xl h-12"
              />
            </div>
          ))}

          <div className="flex justify-between mt-6 pt-4 border-t border-white/10">
            <Button 
              onClick={handlePreFill} 
              variant="outline"
              className="rounded-xl font-semibold transition-all hover:scale-105 bg-neon-purple/10 border-2 border-neon-purple/30 text-neon-purple hover:bg-neon-purple/20 hover:border-neon-purple/50 gap-2"
            >
              <Zap className="h-4 w-4" />
              Pre-fill Keys
            </Button>
            <button 
              onClick={handleSaveApiKeys}
              className="neon-button flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Keys
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            🔒 Credentials are stored securely in your browser's local storage
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyConfig;
