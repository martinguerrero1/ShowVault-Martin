import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-gray-50">
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white">
            ShowVault
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Explorá series, descubrí nuevos shows y organizá tu lista personal.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
            Buscá tus series favoritas, revisá sus temporadas, conocé el elenco
            y guardá lo que querés ver, lo que estás viendo y lo que ya
            completaste.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/shows"
              className="rounded-xl bg-gray-900 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-gray-700"
            >
              Explorar shows
            </Link>

            <Link
              to="/my-list"
              className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
            >
              Ver mi lista
            </Link>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-xl">
          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl bg-gray-900 p-5 text-white">
              <p className="text-sm text-gray-300">Feature</p>
              <h2 className="mt-2 text-xl font-bold">Búsqueda inteligente</h2>
              <p className="mt-3 text-sm text-gray-300">
                Encontrá shows por nombre usando la API pública de TVMaze.
              </p>
            </article>

            <article className="rounded-2xl bg-gray-100 p-5">
              <p className="text-sm text-gray-500">Detalle</p>
              <h2 className="mt-2 text-xl font-bold text-gray-900">
                Temporadas y elenco
              </h2>
              <p className="mt-3 text-sm text-gray-600">
                Consultá información completa de cada serie en una página
                dedicada.
              </p>
            </article>

            <article className="rounded-2xl bg-gray-100 p-5">
              <p className="text-sm text-gray-500">Watchlist</p>
              <h2 className="mt-2 text-xl font-bold text-gray-900">
                Lista personal
              </h2>
              <p className="mt-3 text-sm text-gray-600">
                Guardá shows como pendientes, en progreso o completados.
              </p>
            </article>

            <article className="rounded-2xl bg-gray-900 p-5 text-white">
              <p className="text-sm text-gray-300">SPA</p>
              <h2 className="mt-2 text-xl font-bold">React + TypeScript</h2>
              <p className="mt-3 text-sm text-gray-300">
                Navegación fluida, rutas protegidas y estado persistente.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900">
              1. Explorá
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Navegá el catálogo, buscá por nombre y filtrá por género para
              encontrar nuevas series.
            </p>
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900">
              2. Revisá detalles
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Entrá al detalle de cada show para ver su resumen, temporadas,
              fechas y elenco principal.
            </p>
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900">
              3. Organizá tu lista
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Clasificá tus shows como pendientes, viendo o completados para
              llevar tu progreso.
            </p>
          </article>
        </div>
      </section>

      <p className="text-gray-400 text-center">Componente generado con IA ;)</p>
    </main>
  );
};

export default HomePage;