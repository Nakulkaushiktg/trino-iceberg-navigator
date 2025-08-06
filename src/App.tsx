import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Servers from "./pages/Servers";
import S3Browser from "./pages/S3Browser";
import Maintenance from "./pages/Maintenance";
import Catalogs from "./pages/Catalogs";
import Schemas from "./pages/Schemas";
import Tables from "./pages/Tables";
import TableDetailsPage from "./pages/TableDetailsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <SidebarInset>
              <header className="h-12 flex items-center border-b px-4">
                <SidebarTrigger />
                <div className="ml-4">
                  <h1 className="font-semibold">Trino Data Explorer</h1>
                </div>
              </header>
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Servers />} />
                  <Route path="/s3-browser" element={<S3Browser />} />
                  <Route path="/maintenance" element={<Maintenance />} />
                  <Route path="/catalogs" element={<Catalogs />} />
                  <Route path="/schemas" element={<Schemas />} />
                  <Route path="/tables" element={<Tables />} />
                  <Route path="/table-details" element={<TableDetailsPage />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
