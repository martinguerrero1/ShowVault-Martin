import { create } from "zustand";
import type { Show, ShowEnLista, WatchStatus } from "../../types";



type WatchlistStoreValue = {
  userIdActual: string | null;
  items: ShowEnLista[];

  cargarLista: (userId: string | null) => void;
  agregarShow: (show: Show, status: WatchStatus) => void;
  quitarShow: (showId: number) => void;
  cambiarStatus: (showId: number, status: WatchStatus) => void;
  estaEnLista: (showId: number) => boolean;
  getStatus: (showId: number) => WatchStatus | null;
};

//funcion para obtener el nombre de la key del LS
//entra user id // sale el name de la key
const getStorageKey = (userId: string) => {
  return `watchlist:user:${userId}`;
};

//lee la key y retorna la lista si existe. No creashea por el try catch
//entra: user id //sale ShowEnLista[]
const leerStorage = (userId: string): ShowEnLista[] => {
  const data = localStorage.getItem(getStorageKey(userId));

  if (!data) return [];

  try {
    return JSON.parse(data) as ShowEnLista[];
  } catch {
    return [];
  }
};

//guarda el array de shows que se le pasa
//entra el user id y los shows en lista actuales
const guardarStorage = (userId: string, items: ShowEnLista[]) => {
  localStorage.setItem(getStorageKey(userId), JSON.stringify(items));
};

export const useWatchlistStore = create<WatchlistStoreValue>((set, get) => ({
  userIdActual: null,
  items: [],

  cargarLista: (userId) => {
    // Si no hay usuario, retorna lista vacía
    if (!userId) {
      set({
        userIdActual: null,
        items: [],
      });
      return;
    }

    //Si hay usuario, guarda los items actuales
    const items = leerStorage(userId);

    //Definimos el userId de la sesion actual, junto con su lista de shows
    set({
      userIdActual: userId,
      items,
    });
  },

  agregarShow: (show, status) => {
    //Obtenemos los valores actuales del store
    const { userIdActual, items } = get();

    // Si no hay usuario cargado, no hacemos nada
    if (!userIdActual) return;
    
    //Si sigue, es porque hay un usuario logueado
    const showExistente = items.find((item) => item.id === show.id);

    let nuevosItems: ShowEnLista[];

    if (showExistente) {
      // Si ya existe, actualizamos status
      nuevosItems = items.map((item) =>
        item.id === show.id ? { ...item, status } : item,
      );
    } else {
      // Si no existen shows en la lista, agregamos por primera vez
      const nuevoShow: ShowEnLista = {
        ...show,
        status,
        addedAt: Date.now()
      };

      nuevosItems = [...items, nuevoShow];
    }

    guardarStorage(userIdActual, nuevosItems);

    set({
      items: nuevosItems,
    });
  },

  quitarShow: (showId) => {
    const { userIdActual, items } = get();

    if (!userIdActual) return;

    const nuevosItems = items.filter((item) => item.id !== showId);

    guardarStorage(userIdActual, nuevosItems);

    set({
      items: nuevosItems,
    });
  },

  cambiarStatus: (showId, status) => {
    const { userIdActual, items } = get();

    if (!userIdActual) return;

    const nuevosItems = items.map((item) =>
      item.id === showId ? { ...item, status } : item,
    );

    guardarStorage(userIdActual, nuevosItems);

    set({
      items: nuevosItems,
    });
  },

  estaEnLista: (showId) => {
    return get().items.some((item) => item.id === showId);
  },

  getStatus: (showId) => {
    const item = get().items.find((item) => item.id === showId);

    return item?.status ?? null;
  },
}));