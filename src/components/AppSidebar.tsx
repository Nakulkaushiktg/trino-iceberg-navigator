import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Server, 
  Database, 
  Table, 
  FileText, 
  HardDrive, 
  Settings,
  ChevronRight
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

interface AppSidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const navigationItems = [
  { 
    title: "S3 Browser", 
    icon: HardDrive, 
    action: "s3-browser" 
  },
  { 
    title: "Maintenance", 
    icon: Settings, 
    action: "maintenance" 
  },
  { 
    title: "Servers", 
    icon: Server, 
    action: "servers" 
  },
  { 
    title: "Catalogs", 
    icon: Database, 
    action: "catalogs" 
  },
  { 
    title: "Schemas", 
    icon: FileText, 
    action: "schemas" 
  },
  { 
    title: "Tables", 
    icon: Table, 
    action: "tables" 
  },
  { 
    title: "Table Details", 
    icon: ChevronRight, 
    action: "table-details" 
  },
];

export function AppSidebar({ currentView, onNavigate }: AppSidebarProps) {
  const { state } = useSidebar();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNavigation = (action: string) => {
    if (action === "s3-browser") {
      toast({
        title: "S3 Browser",
        description: "S3 Browser functionality coming soon!",
      });
      return;
    }
    
    if (action === "maintenance") {
      navigate("/maintenance");
      return;
    }

    onNavigate(action);
  };

  const isActive = (action: string) => currentView === action;

  return (
    <Sidebar
      className={`${state === "collapsed" ? "w-14" : "w-56"} border-r border-border bg-sidebar`}
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 px-3 py-2 text-xs font-medium uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => handleNavigation(item.action)}
                    className={`w-full justify-start px-3 py-2 text-sm transition-colors ${
                      isActive(item.action)
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    }`}
                  >
                    <item.icon className={`${state === "collapsed" ? "mx-auto" : "mr-3"} h-4 w-4 flex-shrink-0`} />
                    {state !== "collapsed" && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}