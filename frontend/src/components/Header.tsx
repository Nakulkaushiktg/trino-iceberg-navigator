import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Server, 
  Database, 
  Table, 
  Settings, 
  User, 
  LogOut, 
  UserCircle, 
  Shield,
  Key,
  Globe,
  Bell,
  Palette
} from "lucide-react";
import dataCubeLogo from "@/assets/data-cube-logo.png";
import { useToast } from "@/hooks/use-toast";

export const Header = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of Trino Console",
    });
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully",
    });
    setSettingsOpen(false);
  };

  return (
    <header className="border-b bg-gradient-to-r from-header-blue to-primary shadow-lg">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <img src="/public/favicon.ico" alt="Trino Console" className="h-10 w-10" />

          <div>
            <h1 className="text-xl font-bold text-white">Trino Console</h1>
            <p className="text-sm text-white/80">Iceberg Lakehouse Management</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
            Connected
          </Badge>
          
          {/* Admin Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm">
                <User className="h-4 w-4" />
                Admin
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border border-console-light-grey">
              <DropdownMenuLabel className="flex items-center gap-2">
                <UserCircle className="h-4 w-4" />
                Admin Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 cursor-pointer hover:bg-console-light-blue">
                <Shield className="h-4 w-4" />
                User Management
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer hover:bg-console-light-blue">
                <Key className="h-4 w-4" />
                Access Control
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer hover:bg-console-light-blue">
                <Database className="h-4 w-4" />
                Server Management
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="gap-2 cursor-pointer hover:bg-red-50 text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings Dialog */}
          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-card">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Console Settings
                </DialogTitle>
                <DialogDescription>
                  Configure your Trino Console preferences and connection settings.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-6 py-4">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Connection Settings
                  </h4>
                  <div className="grid gap-2">
                    <Label htmlFor="default-server">Default Server</Label>
                    <Input 
                      id="default-server" 
                      defaultValue="trino-prod.company.com:8080"
                      className="bg-background"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="timeout">Connection Timeout (seconds)</Label>
                    <Input 
                      id="timeout" 
                      type="number" 
                      defaultValue="30"
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Interface Settings
                  </h4>
                  <div className="grid gap-2">
                    <Label htmlFor="theme">Theme</Label>
                    <select 
                      id="theme" 
                      className="w-full p-2 border border-console-light-grey rounded-md bg-background"
                      defaultValue="light"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="refresh-interval">Auto Refresh (seconds)</Label>
                    <Input 
                      id="refresh-interval" 
                      type="number" 
                      defaultValue="60"
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Notifications
                  </h4>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="notifications" 
                      defaultChecked 
                      className="rounded border-console-light-grey"
                    />
                    <Label htmlFor="notifications">Enable notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="email-alerts" 
                      className="rounded border-console-light-grey"
                    />
                    <Label htmlFor="email-alerts">Email alerts for failures</Label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setSettingsOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveSettings}
                  className="bg-console-blue hover:bg-console-dark-blue"
                >
                  Save Settings
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
};