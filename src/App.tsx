
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Layout } from "./components/Layout";
import { StockLayout } from "./components/StockLayout";
import { TicketList } from "./pages/TicketList";
import { NewTicket } from "./pages/NewTicket";
import { TicketDetail } from "./pages/TicketDetail";
import { HistoryTickets } from "./pages/HistoryTickets";
import { Login } from "./pages/Login";
import { StockDashboard } from "./pages/stock/StockDashboard";
import { Employees } from "./pages/stock/Employees";
import { Stock } from "./pages/stock/Stock";
import { StockTickets } from "./pages/stock/StockTickets";
import { Settings } from "./pages/stock/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Composant pour protéger les routes
const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/stock/dashboard" replace />;
  }
  
  if (adminOnly && !isAdmin) {
    return <Navigate to="/stock/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Routes admin (module stock)
const AdminRoutes = () => (
  <StockLayout>
    <Routes>
      <Route path="/stock/dashboard" element={<StockDashboard />} />
      <Route path="/stock/employees" element={<Employees />} />
      <Route path="/stock/equipment" element={<Stock />} />
      <Route path="/stock/tickets" element={<StockTickets />} />
      <Route path="/stock/settings" element={<Settings />} />
    </Routes>
  </StockLayout>
);

// Routes publiques (module tickets)
const PublicRoutes = () => (
  <Layout>
    <Routes>
      <Route path="/tickets" element={<TicketList />} />
      <Route path="/nouveau-ticket" element={<NewTicket />} />
      <Route path="/ticket/:id" element={<TicketDetail />} />
      <Route path="/pannes" element={<TicketList />} />
      <Route path="/equipements" element={<TicketList />} />
      <Route path="/historique" element={<HistoryTickets />} />
      <Route path="/parametres" element={<div>Paramètres à venir</div>} />
    </Routes>
  </Layout>
);

const AppContent = () => {
  return (
    <Routes>
      {/* Redirection automatique vers le dashboard admin */}
      <Route path="/" element={<Navigate to="/stock/dashboard" replace />} />
      <Route path="/login" element={<Navigate to="/stock/dashboard" replace />} />
      
      {/* Routes admin (module stock) */}
      <Route 
        path="/stock/*" 
        element={
          <ProtectedRoute adminOnly>
            <AdminRoutes />
          </ProtectedRoute>
        } 
      />
      
      {/* Routes publiques (module tickets) */}
      <Route 
        path="/tickets/*" 
        element={
          <ProtectedRoute>
            <PublicRoutes />
          </ProtectedRoute>
        } 
      />
      
      {/* Route 404 */}
      <Route path="*" element={<Navigate to="/stock/dashboard" replace />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
