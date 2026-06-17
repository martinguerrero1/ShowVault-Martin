import { useMemo } from "react";
import ShowCard from "../components/ShowCard";
import { useShows } from "../hooks/useShows";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";

function BrowsePage() {
  //parametros de busqueda para la url
  const [searchParams, setSearchParams] = useSearchParams();
  const busqueda = searchParams.get("q") ?? "";
  
  //sistema debounce
  const busquedaDebounce = useDebounce(busqueda, 400)

  //peticion de shows con busqueda
  const estado = useShows(busquedaDebounce);

  //shows como variable local
  const shows = useMemo(() => estado.status === "success" ? estado.data : [], [estado])
  
  //lectura de generos disponibles con los shows fetcheados
  const generos = useMemo(
    () => {
      return [...new Set(shows.flatMap((show) => show.genres))].sort()
    },
  [shows]
  )

  const showsFiltrados = useMemo(() => {
    //copia de show para filtrar
    let resultado = shows;

    //filtro genero
    const genero = searchParams.get("genre") || "Todos"
    if (genero !== "Todos") {
      resultado = resultado.filter((s) => s.genres.includes(genero));
    }

    //filtro orden
    const orden = searchParams.get("sort") || ""
    if (orden === "rating") {
      resultado = [...resultado].sort(
        (a, b) => (b.rating.average ?? 0) - (a.rating.average ?? 0),
      );
    }
    if (orden === "nombre") {
      resultado = [...resultado].sort((a, b) => a.name.localeCompare(b.name));
    }
    return resultado;
  }, [shows, searchParams]);

  return (
    <main className="mx-auto max-w-7xl p-6">
      <section className="mb-8 space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Catálogo de series
          </h1>

          <div className="grid gap-3 sm:grid-cols-3 md:w-180">
            <div className="flex flex-col gap-1">
              <label htmlFor="search" className="text-sm font-medium text-gray-700">
                Buscar
              </label>

              <input
                className="rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
                type="search"
                placeholder="Buscar serie..."
                id="search"
                value={busqueda}
                onChange={(e) => {
                  const value = e.target.value;
                
                  setSearchParams((params) => {
                    if (value.trim()) params.set("q", value);
                    else params.delete("q");
                    return params;
                  });
                }}
              />
            </div>
              
            <div className="flex flex-col gap-1">
              <label htmlFor="genre" className="text-sm font-medium text-gray-700">
                Género
              </label>
              
              <select
                id="genre"
                value={searchParams.get("genre") || "Todos"}
                onChange={(e) => {
                  const value = e.target.value;
                
                  setSearchParams((params) => {
                    if (value !== "Todos") params.set("genre", value);
                    else params.delete("genre");
                    return params;
                  });
                }}
                className="rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
              >
                <option key="Todos" value={""}>
                  Todos
                </option>
                {generos.map((genero) => (
                  <option key={genero} value={genero}>
                    {genero}
                  </option>
                ))}
              </select>
            </div>
              
              {/* SORT */}
            <div className="flex flex-col gap-1">
              <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                Orden
              </label>
              
              <select
                id="sort"
                // value={orden}
                onChange={(e) => {
                  const value = e.target.value;
                
                  setSearchParams((params) => {
                    if (value) params.set("sort", value);
                    else params.delete("sort");
                    return params;
                  });
                }}
                className="rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
              >
                <option value="">Sin orden</option>
                <option value="rating">Mejor rating</option>
                <option value="nombre">Nombre</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {estado.status === "loading" && <LoadingMessage />}

      {estado.status === "error" && <ErrorMessage message={estado.error} />}

      {estado.status === "success" && (
        <section className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {showsFiltrados.map((show) => (
            <ShowCard key={show.id} show={show} />
          ))}
        </section>
      )}
    </main>
  );
}

export default BrowsePage;