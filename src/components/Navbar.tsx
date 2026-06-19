import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="bg-linear-to-b from-indigo-200/90 to-white pb-5">
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="font-semibold text-slate-900 hover:text-slate-600"
          >
            Inicio
          </Link>

          <Link
            to="/shows"
            className="font-semibold text-slate-900 hover:text-slate-600"
          >
            Series
          </Link>

          <Link
            to="/my-list"
            className="font-semibold text-slate-900 hover:text-slate-600"
          >
            Mi lista
          </Link>
        </div>

        {/* BOTON LOGIN / LOG OUT */}
        <div className="flex items-center md:gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-slate-600 ">
                Hola, {user?.name}
              </span>

              <button
                onClick={handleLogout}
                className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Ingresar
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
