import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database, Layers, ArrowLeft, ChevronRight } from "lucide-react";

interface Catalog {
  name: string;
  schemas: number;
  description: string;
  server: {
    name: string;
    host: string;
    port: number;
    user: string;
  };
}

interface CatalogListProps {
  server: {
    name: string;
    host: string;
    port: number;
    user: string;
  };
  onCatalogSelect: (catalog: Catalog) => void;
  onBack: () => void;
}

export const CatalogList = ({ server, onCatalogSelect, onBack }: CatalogListProps) => {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCatalogs = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/catalogs?server=${server.name}`);
        if (!res.ok) throw new Error("Failed to fetch catalogs");
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setCatalogs(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogs();
  }, [server]);

  if (loading) return <div className="p-6">🔄 Loading catalogs...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button variant="outline" onClick={onBack} className="mb-4 gap-2">
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
        {catalogs.map(({ name, schemas, description }) => (
          <Card
            key={name}
            className="p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-console-light-grey bg-card"
            onClick={() =>
              onCatalogSelect({
                name,
                schemas,
                description,
                server,
              })
            }
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-console-blue to-console-dark-blue rounded-lg">
                  <Layers className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{name}</h3>
                  <Badge
                    variant="outline"
                    className="mt-1 text-xs bg-console-light-blue text-console-blue border-console-blue"
                  >
                    catalog
                  </Badge>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-console-grey" />
            </div>
            <div className="space-y-2 text-sm text-console-grey">
              <p>Schemas: {schemas}</p>
              <p>Description: {description || "(not available)"}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
