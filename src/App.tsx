import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Landing from './pages/Landing';
import Access from './pages/Access';
import Onboarding from './pages/Onboarding';
import OwnerDashboard from './pages/OwnerDashboard';
import TenantBooking from './pages/TenantBooking';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/saas" element={<Landing />} />
          <Route path="/cadastro" element={<Access />} />
          <Route path="/entrar" element={<Access />} />
          <Route path="/reset-password" element={<Access />} />
          <Route path="/construir" element={<Onboarding />} />
          <Route path="/painel" element={<OwnerDashboard />} />
          <Route path="/laryssa" element={<Index />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/:slug" element={<TenantBooking />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
