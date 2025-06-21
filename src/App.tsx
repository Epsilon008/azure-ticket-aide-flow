
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
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

const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (adminOnly && !isAdmin) {
    return <Navigate to="/tickets" replace />;
  }
  return <>{children}</>;
};

const AdminRoutes = () => (
  <StockLayout>
    <Routes>
      <Route path="dashboard" element={<StockDashboard />} />
      <Route path="employees" element={<Employees />} />
      <Route path="equipment" element={<Stock />} />
      <Route path="tickets" element={<StockTickets />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  </StockLayout>
);

const PublicRoutes = () => (
  <Layout>
    <Routes>
      <Route path="" element={<TicketList />} />
      <Route path="nouveau-ticket" element={<NewTicket />} />
      <Route path="ticket/:id" element={<TicketDetail />} />
      <Route path="pannes" element={<TicketList />} />
      <Route path="equipements" element={<TicketList />} />
      <Route path="historique" element={<HistoryTickets />} />
      <Route path="parametres" element={<div>Paramètres à venir</div>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Layout>
);

const AppContent = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/stock/*"
        element={
          <ProtectedRoute adminOnly>
            <AdminRoutes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <PublicRoutes />
          </ProtectedRoute>
        }
      />
      {/* Fallback 404 */}
      <Route path="*" element={<NotFound />} />
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
