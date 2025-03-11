import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

const HomePage = lazy(() => import("./pages/home"));
const PageNotFound = lazy(() => import("./pages/NotFound"));
const LoginPage = lazy(() => import("./pages/login"));
const StudentPage = lazy(() => import("./pages/AddStudent"));
const DashboardPage = lazy(() => import("./pages/dashboard"));

import Loader from "./components/loader";
import Basic from "./layouts/Basic";
import ProtectedRoute from "./components/routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route element={<Basic />}>
        <Route path="/" element={
          <Suspense fallback={<Loader />}>
            <HomePage />
          </Suspense>
        } />
        <Route path="/login" element={
          <Suspense fallback={<Loader />} >
            <LoginPage />
          </Suspense>
        } />

        <Route element={<ProtectedRoute />}>
            <Route path="/addStudent" element={
            <Suspense fallback={<Loader />} >
              <StudentPage />
            </Suspense>
          } /> 
          <Route path="/dashboard" element={
            <Suspense fallback={<Loader />} >
              <DashboardPage />
            </Suspense>
          } />
          </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>

  );
}

export default App;
