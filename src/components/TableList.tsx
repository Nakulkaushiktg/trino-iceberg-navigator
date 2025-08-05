import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table as TableIcon, ArrowLeft, ChevronRight, FileText, Calendar, Loader2, Search } from "lucide-react";

interface TableListProps {
  server: {
    name: string;
    host: string;
    port: number;
    user: string;
  };
  catalog: { name: string };
  schema: { name: string; tables?: number; size?: string };
  tables: any[];
  onBack: () => void;
  onTableSelect: (table: any) => void;
}

export function TableList({ server, catalog, schema, onBack, onTableSelect }: TableListProps) {
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/tables?server=${server.name}&catalog=${catalog.name}&schema=${schema.name}`
        );
        const data = await response.json();
        if (Array.isArray(data)) {
          setTables(data);
        } else if (Array.isArray(data.tables)) {
          setTables(data.tables);
        } else {
          throw new Error("Invalid data format received.");
        }
        setLoading(false);
      } catch (error: any) {
        setError(error.message || "Failed to fetch tables");
        setLoading(false);
      }
    };

    fetchTables();
  }, [server, catalog, schema]);

  const filteredTables = tables.filter((table) =>
    typeof table === "string"
      ? table.toLowerCase().includes(searchTerm.toLowerCase())
      : (table.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button variant="outline" onClick={onBack} className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Schemas
        </Button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-console-blue to-console-dark-blue rounded-lg">
            <TableIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{schema.name} Tables</h2>
            <p className="text-console-grey">{schema.tables || tables.length} tables • {schema.size || "--"}</p>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center space-x-2 text-gray-500">
          <Loader2 className="animate-spin" />
          <p>Loading tables...</p>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredTables.length === 0 ? (
        <p>No tables found in this schema.</p>
      ) : (
        <div className="grid gap-4">
          {filteredTables.map((table: any, idx) => (
            <Card
              key={idx}
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
                      {typeof table === "string" ? `${schema.name}.${table}` : `${table.schema || schema.name}.${table.name}`}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-console-grey">
                      <span>{table.rows || "--"} rows</span>
                      <span>•</span>
                      <span>{table.size || "--"}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {table.lastModified || "--"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {table.snapshots && (
                    <Badge variant="outline" className="bg-console-light-blue text-console-blue border-console-blue">
                      {table.snapshots} snapshots
                    </Badge>
                  )}
                  <ChevronRight className="h-5 w-5 text-console-grey" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

