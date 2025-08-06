import { useState } from "react";
import { Header } from "@/components/Header";
import { ServerList } from "@/components/ServerList";
import { CatalogList } from "@/components/CatalogList";
import { TableList } from "@/components/TableList";
import { TableDetails } from "@/components/TableDetails";
import { SchemaList } from "@/components/SchemaList";

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

  return (
    <div className="min-h-screen bg-content-bg">
      <Header />
      <main className="max-w-7xl mx-auto bg-content-bg">
        {renderCurrentView()}
      </main>
    </div>
  );
};
export default Index;
