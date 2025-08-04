import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ChevronRight, Layers2, Database, Search } from "lucide-react";

interface Schema {
  name: string;
  tables: number | string;
  description?: string;
}

interface SchemaListProps {
  catalog: any;
  onSchemaSelect: (schema: any) => void;
  onBack: () => void;
}

export const SchemaList = ({ catalog, onSchemaSelect, onBack }: SchemaListProps) => {
  const [schemas, setSchemas] = useState<Schema[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSchemas = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/schemas?catalog=${catalog.name}&server=${catalog.server.name}`
        );
        const data = await response.json();
        setSchemas(data.schemas || []);
      } catch (error) {
        console.error("Error fetching schemas:", error);
        setSchemas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemas();
  }, [catalog]);

  const filteredSchemas = schemas.filter((schema) =>
    schema.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (schema.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button variant="outline" onClick={onBack} className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Catalogs
        </Button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-console-blue to-console-dark-blue rounded-lg">
            <Layers2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{catalog.name} Schemas</h2>
            <p className="text-console-grey">{catalog.type} catalog • {catalog.size}</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search schemas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-console-grey">🔄 Loading schemas...</p>
      ) : filteredSchemas.length === 0 ? (
        <p className="text-console-grey">No matching schemas found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSchemas.map((schema) => (
            <Card
              key={schema.name}
              className="p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-console-light-grey bg-card"
              onClick={() => onSchemaSelect(schema)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-console-light-blue rounded-lg">
                    <Database className="h-5 w-5 text-console-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{schema.name}</h3>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-console-grey" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-console-grey">Tables:</span>
                  <span className="font-medium text-foreground">{schema.tables}</span>
                </div>
                <p className="text-sm text-console-grey mt-3">{schema.description || "No description."}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
