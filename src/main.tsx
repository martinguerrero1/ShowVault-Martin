import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.tsx";
import HomePage from "./pages/HomePage.tsx";
import BrowsePage from "./pages/BrowsePage.tsx";
import ShowDetailPage from "./pages/ShowDetailPage.tsx";
import MyListPage from "./pages/MyListPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

const ruta = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        element: <HomePage />,
        path: "/",
        index: true,
      },
      {
        element: <BrowsePage />,
        path: "/shows",
      },
      {
        element: <ShowDetailPage />,
        path: "/shows/:id",
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <MyListPage />,
            path: "/my-list",
          },
        ],
      },
    ],
  },
  {
    element: <LoginPage />,
    path: "/login",
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={ruta} />
  </StrictMode>,
);
