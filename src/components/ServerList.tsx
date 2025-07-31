import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server, Database, Clock, ChevronRight } from "lucide-react";

interface ServerListProps {
  onServerSelect: (server: any) => void;
}

const mockServers = [
  {
    id: 1,
    name: "Production Trino",
    host: "trino-prod.company.com",
    port: 8080,
    status: "online",
    catalogs: 12,
    lastConnected: "2 minutes ago"
  },
  {
    id: 2,
    name: "Staging Trino",
    host: "trino-staging.company.com", 
    port: 8080,
    status: "online",
    catalogs: 8,
    lastConnected: "5 minutes ago"
  },
  {
    id: 3,
    name: "Development Trino",
    host: "trino-dev.company.com",
    port: 8080,
    status: "offline",
    catalogs: 4,
    lastConnected: "1 hour ago"
  }
];

export const ServerList = ({ onServerSelect }: ServerListProps) => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Trino Servers</h2>
        <p className="text-console-grey">Select a server to browse catalogs and tables</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockServers.map((server) => (
          <Card 
            key={server.id}
            className="p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-console-light-grey bg-card"
            onClick={() => onServerSelect(server)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-console-light-blue rounded-lg">
                  <Server className="h-5 w-5 text-console-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{server.name}</h3>
                  <p className="text-sm text-console-grey">{server.host}:{server.port}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-console-grey" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge 
                  variant={server.status === "online" ? "default" : "secondary"}
                  className={server.status === "online" ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}
                >
                  {server.status}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-console-grey">
                  <Database className="h-4 w-4" />
                  {server.catalogs} catalogs
                </div>
              </div>
              
              <div className="flex items-center gap-1 text-sm text-console-grey">
                <Clock className="h-4 w-4" />
                Last connected: {server.lastConnected}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};