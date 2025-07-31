import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, ArrowLeft, ChevronRight, FileText, Calendar } from "lucide-react";

interface TableListProps {
  catalog: any;
  onTableSelect: (table: any) => void;
  onBack: () => void;
}

const mockTables = [
  {
    name: "client_master",
    schema: "client_resource",
    rows: "2.4M",
    size: "850MB",
    lastModified: "2 hours ago",
    snapshots: 15,
    type: "iceberg"
  },
  {
    name: "transaction_log",
    schema: "finance",
    rows: "45.6M", 
    size: "12.3GB",
    lastModified: "15 minutes ago",
    snapshots: 42,
    type: "iceberg"
  },
  {
    name: "user_analytics",
    schema: "analytics",
    rows: "8.1M",
    size: "3.2GB", 
    lastModified: "1 hour ago",
    snapshots: 28,
    type: "iceberg"
  },
  {
    name: "product_catalog",
    schema: "inventory",
    rows: "156K",
    size: "89MB",
    lastModified: "3 hours ago",
    snapshots: 8,
    type: "iceberg"
  },
  {
    name: "order_details",
    schema: "sales",
    rows: "12.8M",
    size: "4.6GB",
    lastModified: "30 minutes ago", 
    snapshots: 38,
    type: "iceberg"
  }
];

export const TableList = ({ catalog, onTableSelect, onBack }: TableListProps) => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Catalogs
        </Button>
        
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-console-blue to-console-dark-blue rounded-lg">
            <Table className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{catalog.name} Tables</h2>
            <p className="text-console-grey">{catalog.tables} tables • {catalog.size}</p>
          </div>
        </div>
      </div>
      
      <div className="grid gap-4">
        {mockTables.map((table) => (
          <Card 
            key={`${table.schema}.${table.name}`}
            className="p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:translate-x-1 border border-console-light-grey bg-card"
            onClick={() => onTableSelect(table)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-console-light-blue rounded-lg">
                  <FileText className="h-5 w-5 text-console-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg">
                    {table.schema}.{table.name}
                  </h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-console-grey">{table.rows} rows</span>
                    <span className="text-sm text-console-grey">•</span>
                    <span className="text-sm text-console-grey">{table.size}</span>
                    <span className="text-sm text-console-grey">•</span>
                    <div className="flex items-center gap-1 text-sm text-console-grey">
                      <Calendar className="h-3 w-3" />
                      {table.lastModified}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="bg-console-light-blue text-console-blue border-console-blue">
                  {table.snapshots} snapshots
                </Badge>
                <ChevronRight className="h-5 w-5 text-console-grey" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};