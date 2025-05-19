import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { lazy, Suspense } from "react";

const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Faculty = lazy(() => import("./pages/Faculty"));
const AddFaculty = lazy(() => import("./pages/Faculty/AddFaculty"));
const Class = lazy(() => import("./pages/Classes/Class"));
const CreateClass = lazy(() => import("./pages/Classes/Class/CreateClass"));
const Section = lazy(() => import("./pages/Classes/Section"));
const TimeTable = lazy(() => import("./pages/Classes/TimeTable"));
const Student = lazy(() => import("./pages/Student"));
const AddStudent = lazy(() => import("./pages/Student/AddStudent"));
const ForgotPassword = lazy(() => import("./pages/Login/ForgotPassword"));

import AuthLayout from "./layouts/AuthLayout";
import PrivateRoute from "./components/Auth/PrivateRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import SplashScreen from "./components/SplashScreen";
import ClassesLayout from "./layouts/ClassesLayout";

function App() {
  const navigate = useNavigate();
  return (
    <Suspense fallback={<SplashScreen />}>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Navigate to="login" replace />} />
          <Route path="login" element={<Login />} />
          <Route
            path="forgotPassword"
            element={
              <ForgotPassword onBackToLogin={() => navigate("/auth/login")} />
            }
          />
        </Route>
        <Route
          path="/reset-password/:token"
          element={
            <ForgotPassword onBackToLogin={() => navigate("/auth/login")} />
          }
        />

        <Route path="/" element={<PrivateRoute />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="faculty" element={<Faculty />} />
            <Route path="addFaculty" element={<AddFaculty />} />

            <Route path="classes" element={<ClassesLayout />}>
              <Route path="class" element={<Class />} />
              <Route path="createClass" element={<CreateClass />} />
              <Route path="section" element={<Section />} />
              <Route path="timetable" element={<TimeTable />} />
            </Route>

            <Route path="student" element={<Student />} />
            <Route path="student/add" element={<AddStudent />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
