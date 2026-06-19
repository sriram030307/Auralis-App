import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import PageNotFound from "./lib/PageNotFound";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import UserNotRegisteredError from "@/components/UserNotRegisteredError";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SafetyEngineProvider } from "@/contexts/SafetyEngineContext";

// Auth pages
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

// App pages
import Splash from "@/pages/Splash";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import MapTracking from "@/pages/MapTracking";
import AIChat from "@/pages/AIChat";
import Notifications from "@/pages/Notifications";
import Profile from "@/pages/Profile";
import SettingsPage from "@/pages/SettingsPage";
import FakeCall from "@/pages/FakeCall";
import EmergencyAlert from "@/pages/EmergencyAlert";
import GuardianNetwork from "@/pages/GuardianNetwork";
import JourneyProtection from "@/pages/JourneyProtection";
import IncidentCenter from "@/pages/IncidentCenter";
import SafetyAnalytics from "@/pages/SafetyAnalytics";
import SafetyModes from "@/pages/SafetyModes";
import CommunitySafety from "@/pages/CommunitySafety";
import WeeklyReport from "@/pages/WeeklyReport";

// Layout
import MobileLayout from "@/components/auralis/MobileLayout";

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -40, opacity: 0 }}
        transition={{ duration: 0.22, ease: "easeInOut" }}
        style={{ position: "relative", width: "100%" }}
      >
        <Routes location={location}>
          <Route path="/splash" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
            <Route element={<MobileLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/map" element={<MapTracking />} />
              <Route path="/chat" element={<AIChat />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/fake-call" element={<FakeCall />} />
              <Route path="/guardian" element={<GuardianNetwork />} />
              <Route path="/journey" element={<JourneyProtection />} />
              <Route path="/incidents" element={<IncidentCenter />} />
              <Route path="/analytics" element={<SafetyAnalytics />} />
              <Route path="/modes" element={<SafetyModes />} />
              <Route path="/community" element={<CommunitySafety />} />
              <Route path="/weekly-report" element={<WeeklyReport />} />
            </Route>
            <Route path="/emergency-alert" element={<EmergencyAlert />} />
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === "user_not_registered") return <UserNotRegisteredError />;
    if (authError.type === "auth_required") { navigateToLogin(); return null; }
  }

  return <AnimatedRoutes />;
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <SafetyEngineProvider>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </SafetyEngineProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;