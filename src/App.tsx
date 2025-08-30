
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Обработка переадресации для SPA (не нужно для HashRouter)
  React.useEffect(() => {
    // Очищаем sessionStorage от старых редиректов, так как HashRouter обрабатывает маршруты автоматически
    try {
      const redirect = sessionStorage.getItem('path');
      if (redirect) {
        sessionStorage.removeItem('path');
        console.log('Cleared legacy redirect:', redirect);
      }
    } catch (error) {
      console.error('Error handling redirect:', error);
    }
  }, []);

  console.log('App component rendering...');

  try {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <HashRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin" element={<Admin />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
  } catch (error) {
    console.error('Error in App component:', error);
    return <div style={{ padding: '20px', color: 'red' }}>Error loading app components</div>;
  }
};

export default App;