import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import Discussion from "./pages/Discussion";
import Games from "./pages/Games";
import Tournament from "./pages/Tournament";
import TournamentDetail from './pages/TournamentDetail';
import GameDetail from './pages/GameDetail';
import DiscussionDetail from './pages/DiscussionDetail';
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import { RegistrationFlow } from './components/auth/RegistrationFlow';
import { SigninFlow } from './components/auth/SigninFlow';

const queryClient = new QueryClient();

// Component to handle routing based on authentication status
const AppRoutes = () => {
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes - always accessible */}
      <Route path="/signin" element={<SigninFlow />} />
      <Route path="/register" element={<RegistrationFlow />} />
      
      {/* Landing page - always show for root path */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Protected routes - dashboard and app features */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <Home />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/discussion" element={
        <ProtectedRoute>
          <Layout>
            <Discussion />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/discussion/:id" element={
        <ProtectedRoute>
          <Layout>
            <DiscussionDetail />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/games" element={
        <ProtectedRoute>
          <Layout>
            <Games />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/games/:id" element={
        <ProtectedRoute>
          <Layout>
            <GameDetail />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/tournament" element={
        <ProtectedRoute>
          <Layout>
            <Tournament />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/tournament/:id" element={
        <ProtectedRoute>
          <Layout>
            <TournamentDetail />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/messages" element={
        <ProtectedRoute>
          <Layout>
            <Messages />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout>
            <Profile />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
