import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Server,
  Database,
  Table,
  FileText,
  HardDrive,
  Settings,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Server {
  name: string;
  host: string;
  port: number;
  user: string;
  catalogs?: number;
  status: string;
  lastConnected: string;
}

interface Catalog {
  name: string;
  server: string;
  schemas?: string[];
}

interface Schema {
  name: string;
  catalog: string;
  tables?: string[];
}

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [width, setWidth] = useState<number>(280);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef<boolean>(false);

  // Navigation state
  const [servers, setServers] = useState<Server[]>([]);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [selectedCatalog, setSelectedCatalog] = useState<Catalog | null>(null);
  const [selectedSchema, setSelectedSchema] = useState<Schema | null>(null);
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [schemas, setSchemas] = useState<Schema[]>([]);
  const [tables, setTables] = useState<string[]>([]);

  // Load servers on component mount
  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      const response = await fetch("http://localhost:8000/trino-servers");
      const data = await response.json();
      setServers(data);
    } catch (error) {
      console.error("Failed to fetch servers:", error);
    }
  };

  const handleMouseDown = () => {
    isResizing.current = true;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current) return;
    const newWidth = Math.max(240, Math.min(400, e.clientX));
    setWidth(newWidth);
  };

  const handleMouseUp = () => {
    isResizing.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const isCollapsed = width <= 260;

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

    navigate(`/${action === "servers" ? "" : action}`);
  };

  const handleServerClick = async (server: Server) => {
    setSelectedServer(server);
    setSelectedCatalog(null);
    setSelectedSchema(null);
    
    // Fetch catalogs for this server
    try {
      const response = await fetch(`http://localhost:8000/catalogs?server=${server.name}`);
      if (response.ok) {
        const data = await response.json();
        setCatalogs(data.map((cat: any) => ({ name: cat, server: server.name })));
      }
    } catch (error) {
      console.error("Failed to fetch catalogs:", error);
    }
  };

  const handleCatalogClick = async (catalog: Catalog) => {
    setSelectedCatalog(catalog);
    setSelectedSchema(null);
    
    // Fetch schemas for this catalog
    try {
      const response = await fetch(`http://localhost:8000/schemas?server=${catalog.server}&catalog=${catalog.name}`);
      if (response.ok) {
        const data = await response.json();
        setSchemas(data.map((schema: any) => ({ name: schema, catalog: catalog.name })));
      }
    } catch (error) {
      console.error("Failed to fetch schemas:", error);
    }
  };

  const handleSchemaClick = async (schema: Schema) => {
    setSelectedSchema(schema);
    
    // Fetch tables for this schema
    try {
      const response = await fetch(`http://localhost:8000/tables?server=${selectedServer?.name}&catalog=${schema.catalog}&schema=${schema.name}`);
      if (response.ok) {
        const data = await response.json();
        setTables(data.map((table: any) => table.name));
      }
    } catch (error) {
      console.error("Failed to fetch tables:", error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const topNavItems = [
    { title: "S3 Browser", icon: HardDrive, action: "s3-browser", path: "/s3-browser" },
    { title: "Maintenance", icon: Settings, action: "maintenance", path: "/maintenance" },
  ];

  return (
    <div
      ref={sidebarRef}
      style={{ width }}
      className="h-screen border-r border-white/20 bg-sidebar-dark text-white relative shadow-lg transition-all duration-300 flex flex-col fixed left-0 top-0 z-50"
    >
      {/* Top Navigation */}
      <div className="border-b border-white/20 p-3">
        <div className="flex flex-col space-y-1">
          {topNavItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.title}
                onClick={() => handleNavigation(item.action)}
                className={`flex items-center transition-all duration-150 rounded-md px-3 py-2 text-sm font-medium w-full
                  ${active
                    ? "bg-white/20 text-white border border-white/30 backdrop-blur-sm shadow"
                    : "text-white/80 hover:bg-white/10 hover:text-white"}
                  ${isCollapsed ? "justify-center" : "justify-start gap-3"}
                `}
              >
                <item.icon className="h-4 w-4" />
                {!isCollapsed && <span>{item.title}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hierarchical Navigation */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* Servers */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Server className="h-4 w-4 text-white/60" />
            {!isCollapsed && <span className="text-xs font-semibold text-white/60 uppercase tracking-wide">Servers</span>}
          </div>
          
          <div className="space-y-1">
            {servers.map((server) => (
              <div key={server.name}>
                <button
                  onClick={() => handleServerClick(server)}
                  className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-colors
                    ${selectedServer?.name === server.name 
                      ? "bg-white/20 text-white" 
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${server.status === 'online' ? 'bg-green-400' : 'bg-red-400'}`} />
                    {!isCollapsed && <span className={selectedServer?.name === server.name ? "text-sm" : "text-sm"}>{server.name}</span>}
                  </div>
                  {!isCollapsed && selectedServer?.name === server.name && catalogs.length > 0 && (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </button>

                {/* Catalogs for selected server */}
                {selectedServer?.name === server.name && catalogs.length > 0 && !isCollapsed && (
                  <div className="ml-4 mt-1 space-y-1">
                    {catalogs.map((catalog) => (
                      <div key={catalog.name}>
                        <button
                          onClick={() => handleCatalogClick(catalog)}
                          className={`flex items-center justify-between w-full px-3 py-1.5 text-xs rounded-md transition-colors
                            ${selectedCatalog?.name === catalog.name 
                              ? "bg-white/15 text-white" 
                              : "text-white/70 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                          <div className="flex items-center gap-2">
                            <Database className="h-3 w-3" />
                            <span>{catalog.name}</span>
                          </div>
                          {selectedCatalog?.name === catalog.name && schemas.length > 0 && (
                            <ChevronDown className="h-2 w-2" />
                          )}
                        </button>

                        {/* Schemas for selected catalog */}
                        {selectedCatalog?.name === catalog.name && schemas.length > 0 && (
                          <div className="ml-4 mt-1 space-y-1">
                            {schemas.map((schema) => (
                              <div key={schema.name}>
                                <button
                                  onClick={() => handleSchemaClick(schema)}
                                  className={`flex items-center justify-between w-full px-3 py-1 text-xs rounded-md transition-colors
                                    ${selectedSchema?.name === schema.name 
                                      ? "bg-white/10 text-white" 
                                      : "text-white/60 hover:bg-white/10 hover:text-white"
                                    }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-2.5 w-2.5" />
                                    <span className="text-xs">{schema.name}</span>
                                  </div>
                                  {selectedSchema?.name === schema.name && tables.length > 0 && (
                                    <ChevronDown className="h-2 w-2" />
                                  )}
                                </button>

                                {/* Tables for selected schema */}
                                {selectedSchema?.name === schema.name && tables.length > 0 && (
                                  <div className="ml-4 mt-1 space-y-0.5">
                                    {tables.map((table) => (
                                      <button
                                        key={table}
                                        className="flex items-center gap-2 w-full px-3 py-0.5 text-xs rounded-md transition-colors text-white/50 hover:bg-white/5 hover:text-white"
                                      >
                                        <Table className="h-2 w-2" />
                                        <span className="text-xs">{table}</span>
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar Resizer */}
      <div
        onMouseDown={handleMouseDown}
        className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-white/10"
      />
    </div>
  );
}