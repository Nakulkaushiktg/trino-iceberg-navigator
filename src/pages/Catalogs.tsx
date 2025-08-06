import { useState, useEffect } from "react";
import { CatalogList } from "@/components/CatalogList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";

const Catalogs = () => {
  const [selectedServer, setSelectedServer] = useState<any>(null);

  // For now, we'll show a placeholder when no server is selected
  const handleCatalogSelect = (catalog: any) => {
    console.log("Catalog selected:", catalog);
  };

  const handleBack = () => {
    console.log("Going back to servers");
  };

  // Mock server data for demonstration
  useEffect(() => {
    // In a real app, this would come from state management or URL params
    const mockServer = {
      name: "demo-server",
      host: "localhost",
      port: 8080,
      user: "admin"
    };
    setSelectedServer(mockServer);
  }, []);

  if (!selectedServer) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Catalogs</CardTitle>
                <CardDescription>
                  Select a server first to view catalogs
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please select a server from the Servers page to view its catalogs.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <CatalogList
      server={selectedServer}
      onCatalogSelect={handleCatalogSelect}
      onBack={handleBack}
    />
  );
};

export default Catalogs;