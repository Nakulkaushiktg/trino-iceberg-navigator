import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Database, 
  Calendar, 
  HardDrive, 
  Users, 
  GitBranch,
  Trash2,
  Zap,
  FileX,
  Code,
  BarChart3
} from "lucide-react";

interface TableDetailsProps {
  table: any;
  schema: any;
  onBack: () => void;
}

const mockSnapshots = [
  {
    id: "snap_001",
    timestamp: "2024-07-31 14:30:15",
    operation: "append",
    records: "+125,432",
    summary: "Daily batch load"
  },
  {
    id: "snap_002", 
    timestamp: "2024-07-31 08:15:22",
    operation: "overwrite",
    records: "2,284,568",
    summary: "Weekly full refresh"
  },
  {
    id: "snap_003",
    timestamp: "2024-07-30 22:45:11", 
    operation: "append",
    records: "+89,234",
    summary: "Evening batch"
  }
];

const mockDDL = `CREATE TABLE icebergrest.client_resource.client_master (
  client_id BIGINT,
  client_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  address VARCHAR(500),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  status VARCHAR(20)
)
WITH (
  format = 'PARQUET',
  partitioning = ARRAY['bucket(client_id, 16)'],
  location = 's3://data-lake/icebergrest/client_resource/client_master/'
)`;

export const TableDetails = ({ table, schema, onBack }: TableDetailsProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  // ✅ Defensive check to avoid crash
  if (!table || !schema) {
    return (
      <div className="p-6 text-red-600">
        ❌ Error: Table or Schema data is missing.
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tables
        </Button>
        
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-console-blue to-console-dark-blue rounded-lg">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                {table.schema}.{table.name}
              </h2>
              <p className="text-console-grey">{schema.name} schema</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="gap-2 text-orange-600 border-orange-200 hover:bg-orange-50">
              <Trash2 className="h-4 w-4" />
              Expire Snapshots
            </Button>
            <Button variant="outline" size="sm" className="gap-2 text-red-600 border-red-200 hover:bg-red-50">
              <FileX className="h-4 w-4" />
              Remove Orphans
            </Button>
            <Button variant="outline" size="sm" className="gap-2 text-green-600 border-green-200 hover:bg-green-50">
              <Zap className="h-4 w-4" />
              Optimize
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="snapshots">Snapshots</TabsTrigger>
          <TabsTrigger value="ddl">DDL</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6 border border-console-light-grey">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-console-grey">Total Rows</p>
                  <p className="text-2xl font-bold text-foreground">{table.rows}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 border border-console-light-grey">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <HardDrive className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-console-grey">Data Size</p>
                  <p className="text-2xl font-bold text-foreground">{table.size}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 border border-console-light-grey">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <GitBranch className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-console-grey">Snapshots</p>
                  <p className="text-2xl font-bold text-foreground">{table.snapshots}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 border border-console-light-grey">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-console-grey">Last Modified</p>
                  <p className="text-sm font-medium text-foreground">{table.lastModified}</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6 border border-console-light-grey">
            <h3 className="text-lg font-semibold text-foreground mb-4">Table Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-console-grey">Schema</p>
                <p className="font-medium text-foreground">{schema.name}</p>
              </div>
              <div>
                <p className="text-sm text-console-grey">Table Name</p>
                <p className="font-medium text-foreground">{table.name}</p>
              </div>
              <div>
                <p className="text-sm text-console-grey">Table Type</p>
               <Badge className="bg-console-light-blue text-console-blue border-console-blue">
  {(table.type || "UNKNOWN").toUpperCase()}
</Badge>
              </div>
              <div>
                <p className="text-sm text-console-grey">Format</p>
                <p className="font-medium text-foreground">PARQUET</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="snapshots" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Snapshot History</h3>
            <Badge variant="outline" className="bg-console-light-blue text-console-blue border-console-blue">
              {mockSnapshots.length} snapshots
            </Badge>
          </div>
          
          {mockSnapshots.map((snapshot) => (
            <Card key={snapshot.id} className="p-6 border border-console-light-grey">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-console-light-blue rounded-lg">
                    <GitBranch className="h-5 w-5 text-console-blue" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{snapshot.id}</h4>
                    <p className="text-sm text-console-grey">{snapshot.timestamp}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={snapshot.operation === "append" ? "default" : "secondary"}
                    className={snapshot.operation === "append" ? "bg-green-100 text-green-800 border-green-200" : "bg-orange-100 text-orange-800 border-orange-200"}
                  >
                    {snapshot.operation}
                  </Badge>
                  <p className="text-sm text-console-grey mt-1">{snapshot.records}</p>
                </div>
              </div>
              <p className="text-sm text-console-grey mt-3">{snapshot.summary}</p>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="ddl" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Table DDL</h3>
            <Button variant="outline" size="sm" className="gap-2">
              <Code className="h-4 w-4" />
              Copy DDL
            </Button>
          </div>
          
          <Card className="p-6 border border-console-light-grey">
            <pre className="text-sm text-foreground bg-muted p-4 rounded-lg overflow-x-auto">
              <code>{mockDDL}</code>
            </pre>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-console-blue" />
            <h3 className="text-lg font-semibold text-foreground">Table Statistics</h3>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6 border border-console-light-grey">
              <h4 className="font-semibold text-foreground mb-4">File Statistics</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-console-grey">Total Files</span>
                  <span className="font-medium">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-console-grey">Avg File Size</span>
                  <span className="font-medium">8.4 MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-console-grey">Compression Ratio</span>
                  <span className="font-medium">3.2:1</span>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 border border-console-light-grey">
              <h4 className="font-semibold text-foreground mb-4">Performance</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-console-grey">Avg Query Time</span>
                  <span className="font-medium">2.3s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-console-grey">Cache Hit Rate</span>
                  <span className="font-medium">87%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-console-grey">Last Optimized</span>
                  <span className="font-medium">3 days ago</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default TableDetails;
