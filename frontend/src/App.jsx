import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const HomePage = lazy(() => import("./pages/home"));
const PageNotFound = lazy(() => import("./pages/NotFound"));


import Loader from "./components/loader";
import Basic from "./layouts/Basic";


function App() {
  return (
    <Routes>
      <Route element={<Basic />}>
        <Route path="/" element={
          <Suspense fallback={<Loader />}>
            <HomePage />
          </Suspense>
        } />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>

  );
}

export default App;
