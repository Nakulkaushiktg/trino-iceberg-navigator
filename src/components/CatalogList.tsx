import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database, Table, ArrowLeft, ChevronRight, Layers } from "lucide-react";

interface CatalogListProps {
  server: any;
  onCatalogSelect: (catalog: any) => void;
  onBack: () => void;
}

const mockCatalogs = [
  {
    name: "icebergrest",
    type: "iceberg",
    tables: 24,
    size: "1.2TB",
    description: "Main Iceberg catalog for production data"
  },
  {
    name: "delta_catalog", 
    type: "delta",
    tables: 18,
    size: "850GB",
    description: "Delta Lake catalog for analytics"
  },
  {
    name: "hive_catalog",
    type: "hive",
    tables: 156,
    size: "3.4TB", 
    description: "Legacy Hive metastore catalog"
  },
  {
    name: "memory_catalog",
    type: "memory",
    tables: 8,
    size: "45MB",
    description: "In-memory catalog for testing"
  }
];

export const CatalogList = ({ server, onCatalogSelect, onBack }: CatalogListProps) => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Servers
        </Button>
        
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-console-light-blue rounded-lg">
            <Database className="h-5 w-5 text-console-blue" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{server.name} Catalogs</h2>
            <p className="text-console-grey">{server.host}:{server.port}</p>
          </div>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockCatalogs.map((catalog) => (
          <Card 
            key={catalog.name}
            className="p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-console-light-grey bg-card"
            onClick={() => onCatalogSelect(catalog)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-console-blue to-console-dark-blue rounded-lg">
                  <Layers className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{catalog.name}</h3>
                  <Badge 
                    variant="outline" 
                    className="mt-1 text-xs bg-console-light-blue text-console-blue border-console-blue"
                  >
                    {catalog.type}
                  </Badge>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-console-grey" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-console-grey">Tables:</span>
                <span className="font-medium text-foreground">{catalog.tables}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-console-grey">Size:</span>
                <span className="font-medium text-foreground">{catalog.size}</span>
              </div>
              <p className="text-sm text-console-grey mt-3">{catalog.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};