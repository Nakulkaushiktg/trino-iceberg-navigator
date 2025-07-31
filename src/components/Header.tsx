import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server, Database, Table, Settings, User } from "lucide-react";
import trinoLogo from "@/assets/trino-logo.png";

export const Header = () => {
  return (
    <header className="border-b bg-card shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <img src={trinoLogo} alt="Trino Console" className="h-8 w-8" />
          <div>
            <h1 className="text-xl font-bold text-foreground">Trino Console</h1>
            <p className="text-sm text-console-grey">Iceberg Lakehouse Management</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-console-light-blue text-console-blue border-console-blue">
            Connected
          </Badge>
          <Button variant="outline" size="sm" className="gap-2">
            <User className="h-4 w-4" />
            Admin
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};