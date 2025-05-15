import { Route, Routes, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

const Login = lazy(() => import('./pages/Login'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Faculty = lazy(() => import("./pages/Faculty"))
const AddFaculty = lazy(() => import("./pages/Faculty/AddFaculty"))
const Class = lazy(() => import("./pages/Class"))
const CreateClass = lazy(() => import("./pages/Class/CreateClass"))
const Student = lazy(() => import("./pages/Student"))
const AddStudent = lazy(() => import("./pages/Student/AddStudent"))

import AuthLayout from "./layouts/AuthLayout";
import PrivateRoute from "./components/Auth/PrivateRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import SplashScreen from "./components/SplashScreen";

function App() {
  return (
    <Suspense fallback={<SplashScreen />}>
      <Routes>
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<Login />} />
      </Route>

    <Route path="/" element={<PrivateRoute />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="faculty" element={<Faculty />} />
        <Route path="addFaculty" element={<AddFaculty />} />
        <Route path="class" element={<Class />} />
        <Route path="createClass" element={<CreateClass />} />
        <Route path="student" element={<Student />} />
        <Route path="student/add" element={<AddStudent />} />
      </Route>
    </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
    </Suspense>
  );
};

export default App;
