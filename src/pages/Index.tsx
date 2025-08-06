import { useState } from "react";
import { Header } from "@/components/Header";
import { ServerList } from "@/components/ServerList";
import { CatalogList } from "@/components/CatalogList";
import { TableList } from "@/components/TableList";
import { TableDetails } from "@/components/TableDetails";
import { SchemaList } from "@/components/SchemaList";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

type ViewType = "servers" | "catalogs" | "schemas" | "tables" | "table-details";

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>("servers");
  const [selectedServer, setSelectedServer] = useState<any>(null);
  const [selectedCatalog, setSelectedCatalog] = useState<any>(null);
  const [selectedSchema, setSelectedSchema] = useState<any>(null);
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [schemaTables, setSchemaTables] = useState<any[]>([]);

  const handleServerSelect = (server: any) => {
    setSelectedServer(server);
    setCurrentView("catalogs");
  };

  const handleCatalogSelect = (catalog: any) => {
    setSelectedCatalog(catalog);
    setCurrentView("schemas");
  };

  const handleSchemaSelect = (schema: any) => {
    setSelectedSchema(schema);
    setCurrentView("tables");
  };

  const handleTableSelect = (table: any) => {
    setSelectedTable(table);
    setCurrentView("table-details");
  };

  const handleBackToServers = () => {
    setSelectedServer(null);
    setSelectedCatalog(null);
    setSelectedSchema(null);
    setSelectedTable(null);
    setCurrentView("servers");
  };

  const handleBackToCatalogs = () => {
    setSelectedCatalog(null);
    setSelectedSchema(null);
    setSelectedTable(null);
    setCurrentView("catalogs");
  };

  const handleBackToSchemas = () => {
    setSelectedSchema(null);
    setSelectedTable(null);
    setCurrentView("schemas");
  };

  const handleBackToTables = () => {
    setSelectedTable(null);
    setCurrentView("tables");
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "servers":
        return <ServerList onServerSelect={handleServerSelect} />;
      case "catalogs":
        return (
          <CatalogList
            server={selectedServer}
            onCatalogSelect={handleCatalogSelect}
            onBack={handleBackToServers}
          />
        );
      case "schemas":
        return (
          <SchemaList
  catalog={selectedCatalog}
  onSchemaSelect={handleSchemaSelect}
  onBack={handleBackToCatalogs}
/>
        );
case "tables":
  return (
    <TableList
      server={selectedServer} // ✅ Add this
      catalog={selectedCatalog} // ✅ Add this
      schema={selectedSchema}
      tables={schemaTables}
      onTableSelect={handleTableSelect}
      onBack={handleBackToSchemas}
    />
  );
case "table-details":
  return (
    <TableDetails
      table={selectedTable}
      schema={selectedSchema}
      onBack={handleBackToTables}
    />
  );

      default:
        return <ServerList onServerSelect={handleServerSelect} />;
    }
  };

  const handleSidebarNavigation = (view: string) => {
    setCurrentView(view as ViewType);
    // Reset selections when navigating via sidebar
    if (view === "servers") {
      handleBackToServers();
    } else if (view === "catalogs" && !selectedServer) {
      setCurrentView("servers");
    } else if (view === "schemas" && !selectedCatalog) {
      setCurrentView("servers");
    } else if (view === "tables" && !selectedSchema) {
      setCurrentView("servers");
    } else if (view === "table-details" && !selectedTable) {
      setCurrentView("servers");
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-content-bg">
        <AppSidebar 
          currentView={currentView}
          onNavigate={handleSidebarNavigation}
        />
        
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 bg-content-bg">
            {renderCurrentView()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
export default Index;
