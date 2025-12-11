import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Chatbot from "./pages/Chatbot";
import Interview from "./pages/Interview";
import InterviewDetail from "./pages/InterviewDetail";
import InterviewRoom from "./pages/InterviewRoom";
import NotFound from "./pages/NotFound";
// import SignInPage from "./pages/SignIn";


const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          
          <Route
            element={
                <AppLayout />
              
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/interview/:id" element={<InterviewDetail />} />
            <Route path="/interview/:id/room" element={<InterviewRoom />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
