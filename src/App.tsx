import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Progetto from "./pages/Progetto";
import ChiSiamo from "./pages/ChiSiamo";
import Cronologia from "./pages/Cronologia";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Suggerisci from "./pages/Suggerisci";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/progetto" element={<Progetto />} />
            <Route path="/chi-siamo" element={<ChiSiamo />} />
            <Route path="/cronologia" element={<Cronologia />} />
            <Route path="/suggerisci" element={<Suggerisci />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
