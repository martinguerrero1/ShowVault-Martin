import { Outlet } from "react-router-dom";
import Header from "../components/Navbar";

const MainLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default MainLayout;
