import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  User, 
  LogOut, 
  UserCircle, 
  Shield,
  Key,
  FolderOpen,
  Wrench,
  Clock,
  Trash2,
  Zap,
  List
} from "lucide-react";
import dataCubeLogo from "@/assets/data-cube-logo.png";
import { useToast } from "@/hooks/use-toast";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of Trino Console",
    });
  };

  const handleS3Browse = () => {
    toast({
      title: "S3 Browser",
      description: "Opening S3 Browser...",
    });
  };

  const handleMaintenance = () => {
    navigate("/maintenance");
  };

  return (
    <header className="border-b bg-gradient-to-r from-header-blue to-primary shadow-lg">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-white hover:bg-white/20 mr-2" />
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

          {/* S3 Browser Button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
            onClick={handleS3Browse}
          >
            <FolderOpen className="h-4 w-4" />
            S3 Browser
          </Button>

          {/* Maintenance Button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
            onClick={handleMaintenance}
          >
            <Wrench className="h-4 w-4" />
            Maintenance
          </Button>
        </div>
      </div>
    </header>
  );
};