import { useEffect, useState } from "react";
import { useAuth } from "../features/auth/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

function LoginPage() {
  //estados internos
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {login, isAuthenticated, isLoading, error} = useAuth()
  const location = useLocation();
  const navigate = useNavigate();

  const from = (location.state as { from?: string })?.from ?? "/";

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    login(email, password);
  };

  //uso un useeffect ya que el login tiene delay y no puedo manejar el dato isAuthenticated a tiempo real en el handlesubmit
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, {replace: true});
    }
  }, [isAuthenticated]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <section className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-slate-900">ShowVault</h1>
          <p className="mt-2 text-sm text-slate-500">
            Ingresá para acceder a tu lista personal
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="martinguerrero@test.com"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="*********"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            />
          </div>

          <div className="text-red-700 text-center">
            {error ? error : null}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className= "w-full rounded-md bg-slate-900 px-4 py-2 font-medium text-white transition hover:bg-slate-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Cargando..." : "Ingresar"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;