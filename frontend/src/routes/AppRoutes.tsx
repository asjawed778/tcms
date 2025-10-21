import ErrorBoundary from "@/components/ErrorBoundary";
import SplashScreen from "@/components/SplashScreen";
import Auth from "@/pages/Auth";
import { Suspense } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

const AppRoutes = () => {
  const navigate = useNavigate();
  return (
    <Suspense fallback={<SplashScreen />}>
      <Routes>
        <Route
          path="/auth"
          element={
            <ErrorBoundary>
              <Auth />
            </ErrorBoundary>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
