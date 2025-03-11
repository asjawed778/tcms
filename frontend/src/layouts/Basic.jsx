import { Outlet } from "react-router-dom";
import Header from "../components/header";
import Sidebar from "../components/Sidebar";
import { useSelector } from "react-redux";

const Basic = () => {
  const user = useSelector((state) => state.auth.user)
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      {user && <Sidebar />}
        <main className="flex-grow">
          <Outlet />
        </main>
    </div>
  );
}
export default Basic;
