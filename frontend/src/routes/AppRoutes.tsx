import PublicRoute from "@/components/Auth/PublicRoutes";
import RoleAuthRoute from "@/components/Auth/RoleAuthRoute";
import DashboardRedirect from "@/components/DashboardRedirect";
import ErrorBoundary from "@/components/ErrorBoundary";
import SplashScreen from "@/components/SplashScreen";
import DashboardLayout from "@/layouts/DashboardLayout";
import { ModuleName, Operation, SubModuleName } from "@/utils/enum";
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
const Auth = lazy(() => import("@/pages/Auth"));
const ForgotPassword = lazy(() => import("@/pages/Auth/ForgotPassword"));
const PageNotFound = lazy(() => import("@/pages/PageNotFound"));
const Faculty = lazy(() => import("@/pages/Faculty"));
const AddFaculty = lazy(() => import("@/pages/Faculty/AddFaculty"));
const Student = lazy(() => import("@/pages/Student"));
const AddStudent = lazy(() => import("@/pages/Student/AddStudent"));
const Classes = lazy(() => import("@/pages/Classes"));
const CreateClass = lazy(() => import("@/pages/Classes/Class/CreateClass"));
const CreateTimeTable = lazy(() => import("@/pages/Classes/TimeTable/CreateTimeTable"));
const Tools = lazy(() => import("@/pages/Tools"));

const AppRoutes = () => {
  const navigate = useNavigate();
  return (
    <Suspense fallback={<SplashScreen />}>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route
          path="/auth"
          element={
            <ErrorBoundary>
              <PublicRoute>
                <Auth />
              </PublicRoute>
            </ErrorBoundary>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <ErrorBoundary>
              <ForgotPassword onBackToLogin={() => navigate("/auth/login")} />
            </ErrorBoundary>
          }
        />
        <Route
          path="forgotPassword"
          element={
            <ErrorBoundary>
              <ForgotPassword onBackToLogin={() => navigate("/auth/login")} />
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
            path="faculty"
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
                  <Faculty />
                </RoleAuthRoute>
              </ErrorBoundary>
            }
          />
          <Route
            path="addFaculty"
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
                  <AddFaculty />
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
                      module: ModuleName.CLASSES,
                      operation: Operation.READ,
                    },
                  ]}
                >
                  <Classes />
                </RoleAuthRoute>
              </ErrorBoundary>
            }
          />
          <Route
            path="academics/create-class"
            element={
              <ErrorBoundary>
                <RoleAuthRoute
                  permissions={[
                    {
                      module: ModuleName.CLASSES,
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
                      module: ModuleName.CLASSES,
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
            path="administrator"
            element={
              <ErrorBoundary>
                <RoleAuthRoute
                  permissions={[
                    {
                      module: ModuleName.TOOLS,
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
