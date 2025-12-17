import { Outlet } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-6 lg:px-0 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
