import type { ShowEnLista, WatchStatus } from "../types";

const STATUS_OPTIONS: { estado: string; value: WatchStatus }[] = [
  { estado: "Plan to Watch", value: "plan-to-watch" },
  { estado: "Watching", value: "watching" },
  { estado: "Completed", value: "completed" },
];

function WatchlistCard({
  show,
  onRemove,
  onChangeStatus,
}: {
  show: ShowEnLista;
  onRemove: () => void;
  onChangeStatus: (status: WatchStatus) => void;
}) {
  const imageUrl = show.image?.medium ?? "/placeholder-show.png";

  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-indigo-500/60">
      <img
        src={imageUrl}
        alt={show.name}
        className="h-72 w-full object-cover"
      />

      <div className="space-y-4 p-4">
        <div>
          <h3 className="line-clamp-1 text-lg font-bold text-white">
            {show.name}
          </h3>

          <p className="mt-1 text-sm text-zinc-400">
            Estado actual:
            <span className="font-medium text-indigo-400">{" "+show.status}</span>
          </p>
        </div>

        <select
          value={show.status}
          onChange={(e) => onChangeStatus(e.target.value as WatchStatus)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-indigo-500"
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status.value} value={status.value}>
              {status.estado}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onRemove}
          className="w-full rounded-xl border border-red-500/40 px-3 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
        >
          Quitar de mi lista
        </button>
      </div>
    </article>
  );
}

export default WatchlistCard;