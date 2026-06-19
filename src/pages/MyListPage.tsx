import { Link } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import type { WatchStatus } from "../types";
import WatchlistCard from "../components/WatchlistCard";
import { useWatchlist } from "../features/watchlist/useWatchlist";

const TABS: { label: string; value: WatchStatus }[] = [
  { label: "Plan to Watch", value: "plan-to-watch" },
  { label: "Watching", value: "watching" },
  { label: "Completed", value: "completed" },
];

function MyListPage() {
  const [watchStatus, setWatchStatus] = useState<WatchStatus>("plan-to-watch")

  const { items, quitarShow, cambiarStatus, totalPorStatus } = useWatchlist();

  //Shows filtrados por watch status y memorizados
  const showsPorTab = useMemo(
    () => items.filter((item) => item.status === watchStatus),
    [items, watchStatus],
  );

  //acciones memorizadas para react.memo de la WatchlistCard
  const handleQuitarShow = useCallback((showId: number) => quitarShow(showId), [quitarShow])
  const handleCambiarStatus = useCallback((showId: number, status: WatchStatus) => cambiarStatus(showId, status), [cambiarStatus])

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10 text-zinc-100">
      {/* HEADERS */}
      <header className="mb-8">
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-indigo-400">
          Mi lista
        </p>

        <h1 className="text-3xl font-bold text-zinc-600 md:text-4xl">
          Tus series guardadas
        </h1>

        <p className="mt-3 max-w-2xl text-sm text-zinc-600 md:text-base">
          Organizá las series que querés ver, las que estás viendo y las que ya
          terminaste.
        </p>
      </header>

    {/* BOTONES TABS */}
      <section className="mb-8 flex flex-wrap gap-3">
        {TABS.map((tab) => {
          const activa = watchStatus === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setWatchStatus(tab.value)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                activa
                  ? "border-indigo-500 bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                  : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-indigo-500 hover:text-white"
              }`}
            >
              {tab.label}

              <span className="ml-2 rounded-full bg-zinc-950/60 px-2 py-0.5 text-xs">
                {totalPorStatus[tab.value]}
              </span>
            </button>
          );
        })}
      </section>

    {/* RENDERIZACION DE SHOWS */}
      <section>
        {showsPorTab.length > 0 ? 
          (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {showsPorTab.map((show) => (
                  <WatchlistCard
                    key={show.id}
                    show={show}
                    onRemove={handleQuitarShow}
                    onChangeStatus={handleCambiarStatus}
                  />
                ))}
             
            </div>
          ) : 
          (
          <div className="rounded-2xl bg-indigo-100/70 px-6 py-14 text-center shadow-lg">
            <h2 className="text-xl font-semibold text-black">
              No hay series en esta sección
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm text-gray-800">
              Explorá el catálogo y agregá series a tu lista para empezar a
              organizarlas.
            </p>

            <Link
              to="/shows"
              className="mt-6 inline-flex rounded-full bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              Explorar series
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

export default MyListPage;