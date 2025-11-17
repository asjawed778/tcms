import { BrowserRouter } from "react-router-dom";
import { ReactLenis } from "lenis/react";
import AppRoutes from "./routes/AppRoutes";
function App() {
  return (
    <ReactLenis root>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ReactLenis>
  );
}
export default App;
