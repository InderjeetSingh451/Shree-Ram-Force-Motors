import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen bg-dark-950 font-body">
      <Navbar />
      {/* pt-16 to account for fixed navbar height */}
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
