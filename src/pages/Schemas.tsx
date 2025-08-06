import { useState, useEffect } from "react";
import { SchemaList } from "@/components/SchemaList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers } from "lucide-react";

const Schemas = () => {
  const [selectedCatalog, setSelectedCatalog] = useState<any>(null);

  const handleSchemaSelect = (schema: any) => {
    console.log("Schema selected:", schema);
  };

  const handleBack = () => {
    console.log("Going back to catalogs");
  };

  // Mock catalog data for demonstration
  useEffect(() => {
    const mockCatalog = {
      name: "demo-catalog",
      type: "iceberg",
      size: "150GB",
      server: {
        name: "demo-server",
        host: "localhost",
        port: 8080
      }
    };
    setSelectedCatalog(mockCatalog);
  }, []);

  if (!selectedCatalog) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Schemas</CardTitle>
                <CardDescription>
                  Select a catalog first to view schemas
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please select a catalog from the Catalogs page to view its schemas.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <SchemaList
      catalog={selectedCatalog}
      onSchemaSelect={handleSchemaSelect}
      onBack={handleBack}
    />
  );
};

export default Schemas;