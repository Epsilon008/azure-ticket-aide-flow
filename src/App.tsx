
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { TicketList } from "./pages/TicketList";
import { NewTicket } from "./pages/NewTicket";
import { TicketDetail } from "./pages/TicketDetail";
import { HistoryTickets } from "./pages/HistoryTickets";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<TicketList />} />
            <Route path="/nouveau-ticket" element={<NewTicket />} />
            <Route path="/ticket/:id" element={<TicketDetail />} />
            <Route path="/pannes" element={<TicketList />} />
            <Route path="/equipements" element={<TicketList />} />
            <Route path="/historique" element={<HistoryTickets />} />
            <Route path="/parametres" element={<div>Paramètres à venir</div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
