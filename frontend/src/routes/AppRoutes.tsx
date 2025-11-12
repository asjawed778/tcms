import { ModuleName, Operation, SubModuleName } from "@/utils/enum";
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

// components
import PublicRoute from "@/components/Auth/PublicRoutes";
import RoleAuthRoute from "@/components/Auth/RoleAuthRoute";
import DashboardRedirect from "@/components/DashboardRedirect";
import ErrorBoundary from "@/components/ErrorBoundary";
import SplashScreen from "@/components/SplashScreen";

// layouts
import DashboardLayout from "@/layouts/DashboardLayout";

// pages
const Login = lazy(() => import("@/pages/Login"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const PageNotFound = lazy(() => import("@/pages/PageNotFound"));
const Employee = lazy(() => import("@/pages/Employee"));
const AddEmployee = lazy(() => import("@/pages/AddEmployee"));
const Student = lazy(() => import("@/pages/Student"));
const AddStudent = lazy(() => import("@/pages/AddStudent"));
const Academics = lazy(() => import("@/pages/Academics"));
const CreateClass = lazy(() => import("@/pages/CreateClass"));
const CreateTimeTable = lazy(() => import("@/pages/CreateTimeTable"));
const Tools = lazy(() => import("@/pages/Administration"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<SplashScreen />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={
            <ErrorBoundary>
              <PublicRoute>
                <Login />
              </PublicRoute>
            </ErrorBoundary>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ErrorBoundary>
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            </ErrorBoundary>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <ErrorBoundary>
              <ResetPassword />
            </ErrorBoundary>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RoleAuthRoute>
              <DashboardLayout />
            </RoleAuthRoute>
          }
        >
          <Route
            path=""
            element={
              <ErrorBoundary>
                <DashboardRedirect />
              </ErrorBoundary>
            }
          />
          <Route
            path="employee"
            element={
              <ErrorBoundary>
                <RoleAuthRoute
                  permissions={[
                    {
                      module: ModuleName.Employee,
                      operation: Operation.READ,
                    },
                  ]}
                >
                  <Employee />
                </RoleAuthRoute>
              </ErrorBoundary>
            }
          />
          <Route
            path="employee/add"
            element={
              <ErrorBoundary>
                <RoleAuthRoute
                  permissions={[
                    {
                      module: ModuleName.Employee,
                      operation: Operation.CREATE,
                    },
                  ]}
                >
                  <AddEmployee />
                </RoleAuthRoute>
              </ErrorBoundary>
            }
          />
          <Route
            path={`employee/update-details/:employeeId`}
            element={
              <ErrorBoundary>
                <RoleAuthRoute
                  permissions={[
                    {
                      module: ModuleName.Employee,
                      operation: Operation.UPDATE,
                    },
                  ]}
                >
                  <AddEmployee />
                </RoleAuthRoute>
              </ErrorBoundary>
            }
          />
          <Route
            path="student"
            element={
              <ErrorBoundary>
                <RoleAuthRoute
                  permissions={[
                    {
                      module: ModuleName.STUDENTS,
                      operation: Operation.READ,
                    },
                  ]}
                >
                  <Student />
                </RoleAuthRoute>
              </ErrorBoundary>
            }
          />
          <Route
            path="student/add"
            element={
              <ErrorBoundary>
                <RoleAuthRoute
                  permissions={[
                    {
                      module: ModuleName.STUDENTS,
                      operation: Operation.CREATE,
                    },
                  ]}
                >
                  <AddStudent />
                </RoleAuthRoute>
              </ErrorBoundary>
            }
          />
          <Route
            path="academics"
            element={
              <ErrorBoundary>
                <RoleAuthRoute
                  permissions={[
                    {
                      module: ModuleName.ACADEMICS,
                      operation: Operation.READ,
                    },
                  ]}
                >
                  <Academics />
                </RoleAuthRoute>
              </ErrorBoundary>
            }
          />
          <Route
            path="academics/class/create-class"
            element={
              <ErrorBoundary>
                <RoleAuthRoute
                  permissions={[
                    {
                      module: ModuleName.ACADEMICS,
                      subModule: SubModuleName.CLASS,
                      operation: Operation.CREATE,
                    },
                  ]}
                >
                  <CreateClass />
                </RoleAuthRoute>
              </ErrorBoundary>
            }
          />
          <Route
            path="academics/create-time-table"
            element={
              <ErrorBoundary>
                <RoleAuthRoute
                  permissions={[
                    {
                      module: ModuleName.ACADEMICS,
                      subModule: SubModuleName.TIMETABLE,
                      operation: Operation.CREATE,
                    },
                  ]}
                >
                  <CreateTimeTable />
                </RoleAuthRoute>
              </ErrorBoundary>
            }
          />
          <Route
            path="administration"
            element={
              <ErrorBoundary>
                <RoleAuthRoute
                  permissions={[
                    {
                      module: ModuleName.ADMINISTRATION,
                      operation: Operation.READ,
                    },
                  ]}
                >
                  <Tools />
                </RoleAuthRoute>
              </ErrorBoundary>
            }
          />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
