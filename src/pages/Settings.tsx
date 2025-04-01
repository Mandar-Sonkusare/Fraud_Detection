
import React, { useState } from 'react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertCircle, Check, Key, Save, Shield, Twitter, Upload, X 
} from 'lucide-react';
import { ApiConfig, initialApiConfig } from '@/lib/mock-data';

const Settings = () => {
  const { toast } = useToast();
  const [apiConfig, setApiConfig] = useState<ApiConfig>({
    ...initialApiConfig,
    // Pre-fill with mock values for demo purposes
    api_key: "5RFgT7yhJK9LmN0pQrS3",
    api_secret: "H8dA2bFc5E6gKiJk7L",
    bearer_token: "AAAAAAAAAAAAAAAAAAAAAMLheAAAAAAA0%2BuSeid%2BULvsea4JtiGRiSDSJSI%3DEUifiRBkKG5E2XzMDjRfl76ZC9Ub0wnz4XsNiRVBChTYbJcE3F",
    isConfigured: true
  });
  
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [thresholds, setThresholds] = useState({
    confidence: 0.75,
    severity: 0.65
  });
  
  const [categories, setCategories] = useState({
    misinformation: true,
    hate_speech: true,
    violence: true,
    cyberbullying: true,
    scam: true,
    phishing: true,
    explicit_content: true,
    extremism: true
  });
  
  const [aiSettings, setAiSettings] = useState({
    autoUpdate: true,
    retrainingFrequency: 'weekly',
    enableAutoModeration: false,
    confidenceThreshold: 0.95,
    notificationEnabled: true
  });
  
  const handleApiConfigChange = (key: keyof ApiConfig, value: string) => {
    setApiConfig(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSaveApiConfig = () => {
    setApiConfig(prev => ({ ...prev, isConfigured: true }));
    toast({
      title: "API Configuration Saved",
      description: "Your API credentials have been saved successfully.",
    });
  };
  
  const handleTestConnection = () => {
    setIsTestingConnection(true);
    // Simulate API test
    setTimeout(() => {
      setIsTestingConnection(false);
      toast({
        title: "Connection Successful",
        description: "Successfully connected to the X API.",
      });
    }, 1500);
  };
  
  const handleCategoryToggle = (category: keyof typeof categories) => {
    setCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };
  
  const handleAiSettingChange = (key: keyof typeof aiSettings, value: any) => {
    setAiSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </div>
      
      <Tabs defaultValue="api" className="space-y-4">
        <TabsList>
          <TabsTrigger value="api">API Configuration</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring Settings</TabsTrigger>
          <TabsTrigger value="ai">AI Configuration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Twitter className="mr-2 h-5 w-5 text-[#1DA1F2]" />
                X API Configuration
              </CardTitle>
              <CardDescription>
                Configure your X API credentials to enable social media monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="api_key">API Key</Label>
                <div className="relative">
                  <Input 
                    id="api_key" 
                    type="password"
                    placeholder="Enter your X API key" 
                    value={apiConfig.api_key}
                    onChange={(e) => handleApiConfigChange('api_key', e.target.value)}
                  />
                  <Key className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="api_secret">API Secret</Label>
                <div className="relative">
                  <Input 
                    id="api_secret" 
                    type="password"
                    placeholder="Enter your X API secret" 
                    value={apiConfig.api_secret}
                    onChange={(e) => handleApiConfigChange('api_secret', e.target.value)}
                  />
                  <Key className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="bearer_token">Bearer Token</Label>
                <div className="relative">
                  <Input 
                    id="bearer_token" 
                    type="password"
                    placeholder="Enter your X Bearer Token" 
                    value={apiConfig.bearer_token}
                    onChange={(e) => handleApiConfigChange('bearer_token', e.target.value)}
                  />
                  <Key className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="access_token">Access Token (Optional)</Label>
                <Input 
                  id="access_token" 
                  placeholder="Enter your X Access Token" 
                  value={apiConfig.access_token}
                  onChange={(e) => handleApiConfigChange('access_token', e.target.value)}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="access_token_secret">Access Token Secret (Optional)</Label>
                <Input 
                  id="access_token_secret" 
                  placeholder="Enter your X Access Token Secret" 
                  value={apiConfig.access_token_secret}
                  onChange={(e) => handleApiConfigChange('access_token_secret', e.target.value)}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="webhooks_url">Webhooks URL (Optional)</Label>
                <Input 
                  id="webhooks_url" 
                  placeholder="Enter your webhooks callback URL" 
                  value={apiConfig.webhooks_url}
                  onChange={(e) => handleApiConfigChange('webhooks_url', e.target.value)}
                />
              </div>
              
              {apiConfig.isConfigured && (
                <div className="p-3 rounded-md bg-green-500/10 border border-green-500/20 flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">API credentials are configured</span>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleTestConnection} disabled={isTestingConnection}>
                {isTestingConnection ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Testing Connection
                  </>
                ) : (
                  <>Test Connection</>
                )}
              </Button>
              <Button onClick={handleSaveApiConfig}>
                <Save className="mr-2 h-4 w-4" />
                Save Configuration
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Monitoring Settings</CardTitle>
              <CardDescription>
                Configure which types of content to monitor and set detection thresholds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-3">Detection Thresholds</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="confidence-threshold">Confidence Threshold</Label>
                      <span className="text-sm">{thresholds.confidence * 100}%</span>
                    </div>
                    <Slider 
                      id="confidence-threshold"
                      value={[thresholds.confidence * 100]} 
                      max={100}
                      step={1}
                      onValueChange={(value) => setThresholds({ ...thresholds, confidence: value[0] / 100 })}
                      className="py-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      Posts will be flagged when AI confidence exceeds this threshold
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="severity-threshold">Severity Threshold</Label>
                      <span className="text-sm">{thresholds.severity * 100}%</span>
                    </div>
                    <Slider 
                      id="severity-threshold"
                      value={[thresholds.severity * 100]} 
                      max={100}
                      step={1}
                      onValueChange={(value) => setThresholds({ ...thresholds, severity: value[0] / 100 })}
                      className="py-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      Sets the minimum severity level for flagged content
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-3">Content Categories</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Enable or disable monitoring for specific types of content
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="misinformation">Misinformation</Label>
                      <p className="text-xs text-muted-foreground">
                        False or misleading information
                      </p>
                    </div>
                    <Switch 
                      id="misinformation" 
                      checked={categories.misinformation}
                      onCheckedChange={() => handleCategoryToggle('misinformation')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="hate_speech">Hate Speech</Label>
                      <p className="text-xs text-muted-foreground">
                        Offensive content targeting groups
                      </p>
                    </div>
                    <Switch 
                      id="hate_speech" 
                      checked={categories.hate_speech}
                      onCheckedChange={() => handleCategoryToggle('hate_speech')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="violence">Violence</Label>
                      <p className="text-xs text-muted-foreground">
                        Content promoting or glorifying violence
                      </p>
                    </div>
                    <Switch 
                      id="violence" 
                      checked={categories.violence}
                      onCheckedChange={() => handleCategoryToggle('violence')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="cyberbullying">Cyberbullying</Label>
                      <p className="text-xs text-muted-foreground">
                        Harassment and targeted abuse
                      </p>
                    </div>
                    <Switch 
                      id="cyberbullying" 
                      checked={categories.cyberbullying}
                      onCheckedChange={() => handleCategoryToggle('cyberbullying')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="scam">Scams</Label>
                      <p className="text-xs text-muted-foreground">
                        Fraudulent offers and schemes
                      </p>
                    </div>
                    <Switch 
                      id="scam" 
                      checked={categories.scam}
                      onCheckedChange={() => handleCategoryToggle('scam')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="phishing">Phishing</Label>
                      <p className="text-xs text-muted-foreground">
                        Attempts to steal user credentials
                      </p>
                    </div>
                    <Switch 
                      id="phishing" 
                      checked={categories.phishing}
                      onCheckedChange={() => handleCategoryToggle('phishing')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="explicit_content">Explicit Content</Label>
                      <p className="text-xs text-muted-foreground">
                        Adult or inappropriate content
                      </p>
                    </div>
                    <Switch 
                      id="explicit_content" 
                      checked={categories.explicit_content}
                      onCheckedChange={() => handleCategoryToggle('explicit_content')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="extremism">Extremism</Label>
                      <p className="text-xs text-muted-foreground">
                        Radical ideological content
                      </p>
                    </div>
                    <Switch 
                      id="extremism" 
                      checked={categories.extremism}
                      onCheckedChange={() => handleCategoryToggle('extremism')}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-accent" />
                AI Model Configuration
              </CardTitle>
              <CardDescription>
                Configure AI model settings and retraining preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-update">Automatic Model Updates</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow the AI model to automatically update when new versions are available
                  </p>
                </div>
                <Switch 
                  id="auto-update" 
                  checked={aiSettings.autoUpdate}
                  onCheckedChange={(checked) => handleAiSettingChange('autoUpdate', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Retraining Frequency</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant={aiSettings.retrainingFrequency === 'daily' ? 'default' : 'outline'}
                    onClick={() => handleAiSettingChange('retrainingFrequency', 'daily')}
                    className="justify-center"
                  >
                    Daily
                  </Button>
                  <Button 
                    variant={aiSettings.retrainingFrequency === 'weekly' ? 'default' : 'outline'}
                    onClick={() => handleAiSettingChange('retrainingFrequency', 'weekly')}
                    className="justify-center"
                  >
                    Weekly
                  </Button>
                  <Button 
                    variant={aiSettings.retrainingFrequency === 'monthly' ? 'default' : 'outline'}
                    onClick={() => handleAiSettingChange('retrainingFrequency', 'monthly')}
                    className="justify-center"
                  >
                    Monthly
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  How often the AI model should retrain using new moderation data
                </p>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="auto-moderation">Auto-Moderation</Label>
                    <Badge>Beta</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Automatically approve or reject content based on AI confidence
                  </p>
                </div>
                <Switch 
                  id="auto-moderation" 
                  checked={aiSettings.enableAutoModeration}
                  onCheckedChange={(checked) => handleAiSettingChange('enableAutoModeration', checked)}
                />
              </div>
              
              {aiSettings.enableAutoModeration && (
                <div className="p-3 rounded-md bg-muted border border-border">
                  <div className="flex items-start mb-3">
                    <AlertCircle className="h-4 w-4 text-accent mr-2 mt-0.5" />
                    <p className="text-xs">
                      Auto-moderation will automatically approve or reject content when the AI 
                      confidence exceeds the threshold. Human review is still recommended.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="auto-threshold">Auto-Moderation Threshold</Label>
                      <span className="text-sm">{aiSettings.confidenceThreshold * 100}%</span>
                    </div>
                    <Slider 
                      id="auto-threshold"
                      value={[aiSettings.confidenceThreshold * 100]} 
                      max={100}
                      min={75}
                      step={1}
                      onValueChange={(value) => handleAiSettingChange('confidenceThreshold', value[0] / 100)}
                      className="py-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      Higher values require more AI confidence before taking automatic action
                    </p>
                  </div>
                </div>
              )}
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive email notifications about high-severity content
                    </p>
                  </div>
                  <Switch 
                    id="notifications" 
                    checked={aiSettings.notificationEnabled}
                    onCheckedChange={(checked) => handleAiSettingChange('notificationEnabled', checked)}
                  />
                </div>
                
                <div>
                  <Button variant="outline" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Custom Training Data
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <X className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
