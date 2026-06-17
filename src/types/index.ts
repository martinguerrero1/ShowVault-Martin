export type Show = {
  id: number;
  name: string;
  type: string;
  language: string;
  genres: string[];
  status: string; // "Running" | "Ended" | "In Development" | ...
  premiered: string | null;
  rating: { average: number | null };
  network: { name: string } | null;
  image: { medium: string; original: string } | null;
  summary: string | null;
};

//TIPADO DEL OBJETO RESPONSE DE BUSCAR UN SHOW
export type SearchShowResponse = {
  score: number;
  show: Show;
};

export type Season = {
  id: number;
  number: number;
  episodeOrder: number | null;
  premiereDate: string | null;
  endDate: string | null;
};

export type CastMember = {
  person: { id: number; name: string; image: { medium: string } | null };
  character: { name: string };
};

// Para la lista personal
export type WatchStatus = "plan-to-watch" | "watching" | "completed";

export type ShowEnLista = Show & {
  status: WatchStatus;
  addedAt: number; // Date.now()
};

// Para discriminated union de fetches
export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };
