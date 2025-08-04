import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server as ServerIcon, Database, Clock, ChevronRight } from "lucide-react";

interface Server {
  name: string;
  host: string;
  port: number;
  user: string;
  catalogs: number | null;
  status: "online" | "offline";
  lastConnected: string;
}

interface ServerListProps {
  onServerSelect: (server: Server) => void;
}

export const ServerList = ({ onServerSelect }: ServerListProps) => {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/trino-servers")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch servers");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setServers(data);
        } else {
          console.error("Expected array but got:", data);
          setServers([]);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">🔄 Loading servers...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Trino Servers</h2>
        <p className="text-console-grey">Select a server to browse catalogs and tables</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {servers.map((server, index) => (
          <Card
            key={index}
            className="p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-console-light-grey bg-card"
            onClick={() => onServerSelect(server)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-console-light-blue rounded-lg">
                  <ServerIcon className="h-5 w-5 text-console-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{server.name}</h3>
                  <p className="text-sm text-console-grey">
                    {server.host}:{server.port}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-console-grey" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge
                  variant="default"
                  className={
                    server.status === "online"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-red-100 text-red-800 border-red-200"
                  }
                >
                  {server.status}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-console-grey">
                  <Database className="h-4 w-4" />
                  {server.catalogs !== null ? `${server.catalogs} catalogs` : "N/A catalogs"}
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
