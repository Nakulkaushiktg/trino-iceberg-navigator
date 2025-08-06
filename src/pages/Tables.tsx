import { useState, useEffect } from "react";
import { TableList } from "@/components/TableList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table } from "lucide-react";

const Tables = () => {
  const [selectedSchema, setSelectedSchema] = useState<any>(null);
  const [selectedServer, setSelectedServer] = useState<any>(null);
  const [selectedCatalog, setSelectedCatalog] = useState<any>(null);
  const [schemaTables, setSchemaTables] = useState<any[]>([]);

  const handleTableSelect = (table: any) => {
    console.log("Table selected:", table);
  };

  const handleBack = () => {
    console.log("Going back to schemas");
  };

  // Mock data for demonstration
  useEffect(() => {
    const mockServer = {
      name: "demo-server",
      host: "localhost",
      port: 8080
    };
    const mockCatalog = {
      name: "demo-catalog",
      type: "iceberg"
    };
    const mockSchema = {
      name: "demo-schema"
    };
    
    setSelectedServer(mockServer);
    setSelectedCatalog(mockCatalog);
    setSelectedSchema(mockSchema);
    setSchemaTables([]);
  }, []);

  if (!selectedSchema) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Table className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Tables</CardTitle>
                <CardDescription>
                  Select a schema first to view tables
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please select a schema from the Schemas page to view its tables.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TableList
      server={selectedServer}
      catalog={selectedCatalog}
      schema={selectedSchema}
      tables={schemaTables}
      onTableSelect={handleTableSelect}
      onBack={handleBack}
    />
  );
};

export default Tables;