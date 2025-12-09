import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Chatbot from "./pages/Chatbot";
import Interview from "./pages/Interview";
import InterviewDetail from "./pages/InterviewDetail";
import InterviewRoom from "./pages/InterviewRoom";
import NotFound from "./pages/NotFound";
import SignInPage from "./pages/SignIn";
// import SignUpPage from "./pages/SignUp";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn } = useUser(); 
  if (!isSignedIn) {
    return <Navigate to="/sign-in" />;
  }
  else{
    return <>{children}</>;
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/interview/:id" element={<InterviewDetail />} />
          <Route path="/interview/:id/room" element={<InterviewRoom />} />
        </Route>
        <Route path="/sign-in" element={<SignInPage />} />
        {/* <Route path="/sign-up" element={<SignUpPage />} /> */}
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
