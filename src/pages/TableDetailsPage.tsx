import { useState, useEffect } from "react";
import { TableDetails } from "@/components/TableDetails";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

const TableDetailsPage = () => {
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [selectedSchema, setSelectedSchema] = useState<any>(null);

  const handleBack = () => {
    console.log("Going back to tables");
  };

  // Mock data for demonstration
  useEffect(() => {
    const mockTable = {
      name: "demo-table",
      type: "iceberg"
    };
    const mockSchema = {
      name: "demo-schema"
    };
    
    setSelectedTable(mockTable);
    setSelectedSchema(mockSchema);
  }, []);

  if (!selectedTable) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Table Details</CardTitle>
                <CardDescription>
                  Select a table first to view details
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please select a table from the Tables page to view its details.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TableDetails
      table={selectedTable}
      schema={selectedSchema}
      onBack={handleBack}
    />
  );
};

export default TableDetailsPage;