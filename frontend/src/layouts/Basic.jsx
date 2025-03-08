import { Outlet } from "react-router-dom";
import Header from "../components/header";

const Basic = () => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
        <main className="flex-grow">
          <Outlet />
        </main>
      <Header />
    </div>
  );
}

export default Basic;
