import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen } from "lucide-react";

const S3Browser = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">S3 Browser</h2>
        <p className="text-muted-foreground">Browse and manage your S3 storage</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FolderOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>S3 Storage Browser</CardTitle>
              <CardDescription>
                Browse your S3 buckets and files
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            S3 Browser functionality will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default S3Browser;