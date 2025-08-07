import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Trash2, 
  Zap, 
  List, 
  Search, 
  Plus, 
  Minus,
  ArrowLeft,
  Table
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AppSidebar } from "@/components/AppSidebar";

type MaintenanceAction = "expire-snapshot" | "remove-orphans" | "optimize" | "all-together" | null;

interface TableItem {
  id: string;
  name: string;
  schema: string;
  catalog: string;
  rowCount: number;
}

const Maintenance = () => {
  const [selectedAction, setSelectedAction] = useState<MaintenanceAction>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTables, setSelectedTables] = useState<TableItem[]>([
    { id: "1", name: "customer_data", schema: "analytics", catalog: "iceberg", rowCount: 150000 },
    { id: "2", name: "sales_transactions", schema: "finance", catalog: "iceberg", rowCount: 2500000 },
    { id: "3", name: "user_events", schema: "tracking", catalog: "iceberg", rowCount: 5000000 },
  ]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const maintenanceOptions = [
    {
      id: "expire-snapshot",
      title: "Expire Snapshot",
      description: "Remove old snapshots to free up storage space",
      icon: Clock,
      color: "bg-blue-500"
    },
    {
      id: "remove-orphans",
      title: "Remove Orphans",
      description: "Clean up orphaned files and data",
      icon: Trash2,
      color: "bg-red-500"
    },
    {
      id: "optimize",
      title: "Optimize",
      description: "Optimize table structure and performance",
      icon: Zap,
      color: "bg-yellow-500"
    },
    {
      id: "all-together",
      title: "All Together",
      description: "Execute all maintenance actions in sequence",
      icon: List,
      color: "bg-green-500"
    }
  ];

  const filteredTables = selectedTables.filter(table =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.schema.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.catalog.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleActionSelect = (actionId: string) => {
    setSelectedAction(actionId as MaintenanceAction);
  };

  const handleAddTable = () => {
    const newTable: TableItem = {
      id: Date.now().toString(),
      name: `new_table_${Date.now()}`,
      schema: "default",
      catalog: "iceberg",
      rowCount: 0
    };
    setSelectedTables([...selectedTables, newTable]);
    toast({
      title: "Table Added",
      description: `Added ${newTable.name} to the maintenance list`,
    });
  };

  const handleDeleteTable = (tableId: string) => {
    const tableToDelete = selectedTables.find(t => t.id === tableId);
    setSelectedTables(selectedTables.filter(table => table.id !== tableId));
    toast({
      title: "Table Removed",
      description: `Removed ${tableToDelete?.name} from the maintenance list`,
    });
  };

  const handleExecuteAction = () => {
    const actionName = maintenanceOptions.find(opt => opt.id === selectedAction)?.title;
    toast({
      title: "Maintenance Action Started",
      description: `Executing ${actionName} on ${filteredTables.length} tables`,
    });
  };

  const goBack = () => {
    if (selectedAction) {
      setSelectedAction(null);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 ml-[280px] transition-all duration-300">
        <div className="p-6">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={goBack}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {selectedAction ? "Back to Options" : "Back to Dashboard"}
            </Button>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {selectedAction ? 
              maintenanceOptions.find(opt => opt.id === selectedAction)?.title :
              "Maintenance Center"
            }
          </h1>
          <p className="text-muted-foreground">
            {selectedAction ? 
              "Manage tables for this maintenance action" :
              "Select a maintenance action to perform on your tables"
            }
          </p>
        </div>

        {!selectedAction ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {maintenanceOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <Card 
                  key={option.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary"
                  onClick={() => handleActionSelect(option.id)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${option.color} text-white`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{option.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {option.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Click to manage tables for this action
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Search and Add Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Table className="h-5 w-5" />
                  Table Management
                </CardTitle>
                <CardDescription>
                  Search, add, or remove tables for this maintenance action
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tables by name, schema, or catalog..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button onClick={handleAddTable} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Table
                  </Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    {filteredTables.length} table(s) selected for maintenance
                  </p>
                  <Button onClick={handleExecuteAction} className="gap-2">
                    <Zap className="h-4 w-4" />
                    Execute Action
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tables List */}
            <div className="grid gap-4">
              {filteredTables.map((table) => (
                <Card key={table.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Table className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{table.name}</h3>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>Schema: <Badge variant="outline">{table.schema}</Badge></span>
                            <span>Catalog: <Badge variant="outline">{table.catalog}</Badge></span>
                            <span>Rows: {table.rowCount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteTable(table.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Minus className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredTables.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Table className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No tables found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm ? "No tables match your search criteria" : "Add tables to perform maintenance actions"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Maintenance;