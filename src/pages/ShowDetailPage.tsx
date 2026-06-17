import { useParams } from "react-router-dom";
import { useShowDetails } from "../hooks/useShowDetail";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";

const ShowDetailPage = () => {
  const { id } = useParams();

  const { show, seasons, cast } = useShowDetails(id);

  if (show.status === "loading") {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <LoadingMessage />
      </main>
    );
  }

  if (show.status === "error") {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <ErrorMessage message={show.error}/>
      </main>
    );
  }

  if (show.status === "idle") {
    return null;
  }

  const showData = show.data;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">

      {/* DATOS DEL SHOW */}
      <section className="grid gap-8 md:grid-cols-[280px_1fr]">
        <div>
          <img
            src={showData.image?.original ?? showData.image?.medium ?? ""}
            alt={showData.name}
            className="w-full rounded-xl object-cover shadow-md"
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold text-gray-900">{showData.name}</h1>

          <div className="mt-3 flex flex-wrap gap-2">
            {showData.genres.map((genre) => (
              <span
                key={genre}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
              >
                {genre}
              </span>
            ))}
          </div>

          <div className="mt-6 grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
            <p>
              <span className="font-semibold">Rating:</span>{" "}
              {showData.rating.average ?? "Sin rating"}
            </p>
            <p>
              <span className="font-semibold">Estado:</span> {showData.status}
            </p>
            <p>
              <span className="font-semibold">Estreno:</span>{" "}
              {showData.premiered ?? "Sin fecha"}
            </p>
            <p>
              <span className="font-semibold">Network:</span>{" "}
              {showData.network?.name ?? "Sin network"}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <select className="rounded-lg border border-gray-300 px-4 py-2 text-sm">
              <option value="plan-to-watch">Plan to watch</option>
              <option value="watching">Watching</option>
              <option value="completed">Completed</option>
            </select>

            <button className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-700">
              Agregar a mi lista
            </button>
          </div>
        </div>
      </section>

      {/* RESUMEN */}
      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Resumen</h2>

        <div
          className="prose max-w-none text-gray-700"
          dangerouslySetInnerHTML={{
            __html: showData.summary ?? "<p>Sin resumen disponible.</p>",
          }}
        />
      </section>

      {/* TEMPORADAS */}
      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Temporadas</h2>

        {seasons.status === "loading" && (
          <p className="text-gray-500">Cargando temporadas...</p>
        )}

        {seasons.status === "error" && (
          <p className="text-red-500">{seasons.error}</p>
        )}

        {seasons.status === "success" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {seasons.data.map((season) => (
              <article
                key={season.id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <h3 className="font-semibold text-gray-900">
                  Temporada {season.number}
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  Episodios: {season.episodeOrder ?? "Sin dato"}
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  Inicio: {season.premiereDate ?? "Sin fecha"}
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  Fin: {season.endDate ?? "Sin fecha"}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
      
      {/* ELENCO */}
      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Elenco</h2>

        {cast.status === "loading" && (
          <p className="text-gray-500">Cargando elenco...</p>
        )}

        {cast.status === "error" && <p className="text-red-500">{cast.error}</p>}

        {cast.status === "success" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cast.data.map((member) => (
              <article
                key={`${member.person.id}-${member.character.name}`}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <img
                  src={member.person.image?.medium ?? ""}
                  alt={member.person.name}
                  className="h-64 w-full object-cover"
                />

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">
                    {member.person.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-600">
                    como {member.character.name}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default ShowDetailPage;