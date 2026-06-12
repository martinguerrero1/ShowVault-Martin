# 🎬 Technical Challenge — "ShowVault"

> **Tipo:** Proyecto individual de días — simulación de entrevista técnica  
> **Tiempo estimado:** 2–3 días  
> **Stack:** React + TypeScript + TailwindCSS + React Router DOM v6  
> **API:** [TVMaze API](https://api.tvmaze.com) — pública, sin API key, sin registro

---

## El brief

Recibís el siguiente mensaje de un Tech Lead ficticio:

> _"Necesitamos una SPA para trackear series de TV. El usuario tiene que poder explorar el catálogo, buscar por nombre, ver el detalle de una serie con sus temporadas, y manejar su lista personal de 'quiero ver' / 'viendo' / 'terminé'. La lista tiene que sobrevivir un refresh y estar protegida: si el usuario no está logueado, lo redirigimos al login. Queremos código limpio, componentes chicos, sin lógica en el JSX, y hooks bien definidos. Tenés 72 horas."_

---

## Rutas de la aplicación

| Ruta         | Componente       | Acceso                              |
| ------------ | ---------------- | ----------------------------------- |
| `/`          | `HomePage`       | público                             |
| `/shows`     | `BrowsePage`     | público                             |
| `/shows/:id` | `ShowDetailPage` | público                             |
| `/my-list`   | `MyListPage`     | **protegido** (requiere login)      |
| `/login`     | `LoginPage`      | público (redirige si ya hay sesión) |

---

## API Reference — TVMaze

Todos los endpoints devuelven JSON, sin autenticación.

```
# Listado paginado (250 shows por página, page empieza en 0)
GET https://api.tvmaze.com/shows?page=0

# Búsqueda por nombre
GET https://api.tvmaze.com/search/shows?q=breaking+bad
→ devuelve array de { score, show }

# Detalle de un show
GET https://api.tvmaze.com/shows/:id

# Temporadas
GET https://api.tvmaze.com/shows/:id/seasons

# Elenco
GET https://api.tvmaze.com/shows/:id/cast
→ devuelve array de { person, character }

# Episodios (todos)
GET https://api.tvmaze.com/shows/:id/episodes
```

> ⚠️ La búsqueda y el listado paginado son endpoints distintos con formatos distintos. Leé bien la respuesta antes de tipar.

---

## Tipos base — `src/types/index.ts`

Estos tipos te los damos. Todo lo demás lo definís vos.

```ts
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
```

---

---

## FEATURE 1 — Arquitectura base y navegación

**Objetivo:** Proyecto corriendo con todas las rutas conectadas, layout persistente, navbar funcional.

### Qué implementar

**React Router:**

```
main.tsx
└── <BrowserRouter>
    └── <App>
        └── <Routes>
            ├── <Route path="/" element={<MainLayout />}>   ← layout con Outlet
            │   ├── index → <HomePage />
            │   ├── /shows → <BrowsePage />
            │   ├── /shows/:id → <ShowDetailPage />
            │   └── /my-list → <ProtectedRoute> → <MyListPage />
            └── <Route path="/login" → <LoginPage />
```

**`MainLayout.tsx`** — el layout compartido:

- Tiene `<Navbar />` arriba y `<Outlet />` abajo
- La navbar no se desmonta al navegar entre páginas

**`ProtectedRoute.tsx`** — componente de guardia:

- Si el usuario no está autenticado → `<Navigate to="/login" replace />`
- Si está autenticado → renderiza `<Outlet />`
- Tiene que saber de dónde vino el usuario (tip: `state` en `useNavigate` o `<Navigate>`)

**`Navbar.tsx`:**

- Links a `/`, `/shows`, `/my-list`
- Si hay sesión: muestra el nombre del usuario + botón Logout
- Si no hay sesión: muestra botón "Ingresar" → navega a `/login`
- En mobile: menú hamburguesa con `useToggle`

### Criterios de aceptación

- [ ] Navegar entre rutas no recarga la página (SPA)
- [ ] La Navbar siempre es visible excepto en `/login`
- [ ] Ir a `/my-list` sin sesión redirige a `/login`
- [ ] El botón back del navegador funciona correctamente

---

---

## FEATURE 2 — AuthContext: login simulado con redirección

**Objetivo:** Un sistema de autenticación simulado que usa localStorage para persistir la sesión.

### Credenciales hardcodeadas (simulación)

```ts
// src/features/auth/mockUsers.ts
export const MOCK_USERS = [
  { id: "1", name: "Ana García", email: "ana@test.com", password: "1234" },
  { id: "2", name: "Carlos López", email: "carlos@test.com", password: "1234" },
];
```

No necesitás validar contraseñas seguras. El objetivo es practicar el patrón de contexto, no implementar auth real.

### Contrato de `AuthContext`

```ts
type AuthContextValue = {
  user: { id: string; name: string; email: string } | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>; // async para simular latencia
  logout: () => void;
  error: string | null;
};
```

### Comportamiento esperado

**`login`:**

1. Espera 800ms (simula llamada al servidor: `await new Promise(r => setTimeout(r, 800))`)
2. Busca el email en `MOCK_USERS`
3. Si no existe o la contraseña no coincide → setea `error` con un mensaje claro
4. Si es correcto → guarda el usuario en `useLocalStorage` y limpia el `error`

**`logout`:**

1. Borra el usuario del localStorage
2. Navega a `/login`

**`LoginPage`:**

- Formulario con email y password
- Mientras `login` corre → botón deshabilitado + texto "Ingresando..."
- Si hay error → lo muestra debajo del formulario
- Si el login es exitoso → redirige al usuario a la ruta que intentaba visitar (o a `/` si llegó directo)

### Pista sobre la redirección post-login

```tsx
// En ProtectedRoute: guardás de dónde viene el usuario
<Navigate to="/login" state={{ from: location.pathname }} replace />;

// En LoginPage: después del login exitoso
const from = (location.state as { from?: string })?.from ?? "/";
navigate(from, { replace: true });
```

### Criterios de aceptación

- [ ] Login con credenciales incorrectas muestra error, no crashea
- [ ] Login exitoso redirige a la ruta que el usuario intentaba visitar
- [ ] Refrescar la página conserva la sesión (localStorage)
- [ ] Logout limpia la sesión y redirige a `/login`
- [ ] El formulario tiene loading state mientras espera

---

---

## FEATURE 3 — Browse: búsqueda y listado con URL state

**Objetivo:** Página de búsqueda que sincroniza el estado con la URL.

### Por qué usar `useSearchParams` en vez de `useState`

Si el estado del buscador vive en `useState`, al refrescar o compartir el link perdés la búsqueda. Con `useSearchParams`, la URL es la fuente de verdad:

```
/shows?q=breaking+bad&genre=Drama&sort=rating
```

Cualquiera que abra ese link ve exactamente los mismos resultados.

### Hook `useShows`

```ts
// src/hooks/useShows.ts

// Entra: objeto con search string opcional
// Sale: AsyncState<Show[]>
// Comportamiento:
//   - Si search está vacío → fetch al listado paginado (page 0, 250 shows)
//   - Si search tiene texto → fetch al endpoint de búsqueda
//   - Cancela el request anterior con AbortController cuando search cambia
//   - El endpoint de búsqueda devuelve { score, show }[] — extraé solo el show
export function useShows({ search }: { search: string }): AsyncState<Show[]>;
```

### `useDebounce`

El buscador usa un input controlado. No querés un fetch por tecla presionada.

```ts
// src/hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T;

// Uso en BrowsePage:
const [rawSearch, setRawSearch] = useState("");
const debouncedSearch = useDebounce(rawSearch, 400);

// Sincronizás el debounced con la URL:
useEffect(() => {
  setSearchParams((prev) => {
    if (debouncedSearch) prev.set("q", debouncedSearch);
    else prev.delete("q");
    return prev;
  });
}, [debouncedSearch]);

// Y leés la URL para inicializar el hook:
const q = searchParams.get("q") ?? "";
const estado = useShows({ search: q });
```

### Filtro por género con `useMemo`

Los géneros no vienen de un endpoint separado: los extraés de los shows cargados.

```ts
const generos = useMemo(
  () => ["Todos", ...new Set(shows.flatMap((s) => s.genres))].sort(),
  [shows],
);
```

El filtro de género es **local** (no hace un nuevo fetch). Filtrás el array en memoria:

```ts
const showsFiltrados = useMemo(() => {
  let resultado = shows;
  if (generoSeleccionado !== "Todos") {
    resultado = resultado.filter((s) => s.genres.includes(generoSeleccionado));
  }
  if (orden === "rating") {
    resultado = [...resultado].sort(
      (a, b) => (b.rating.average ?? 0) - (a.rating.average ?? 0),
    );
  }
  if (orden === "nombre") {
    resultado = [...resultado].sort((a, b) => a.name.localeCompare(b.name));
  }
  return resultado;
}, [shows, generoSeleccionado, orden]);
```

### Criterios de aceptación

- [ ] Buscar "breaking" muestra resultados relevantes
- [ ] La URL refleja la búsqueda actual (refresco conserva los resultados)
- [ ] Limpiar el buscador vuelve al listado general
- [ ] El filtro de género funciona sobre los resultados ya cargados
- [ ] El input no dispara un fetch por cada tecla (debounce de 400ms)
- [ ] El estado de loading se muestra mientras llega la respuesta

---

---

## FEATURE 4 — Show Detail: fetch paralelo

**Objetivo:** Página de detalle que carga múltiples recursos en paralelo.

### Hook `useShow`

```ts
// src/hooks/useShow.ts
// Entra: id del show (string | undefined desde useParams)
// Sale: objeto con estados separados para cada recurso
export function useShow(id: string | undefined): {
  show: AsyncState<Show>;
  seasons: AsyncState<Season[]>;
  cast: AsyncState<CastMember[]>;
};
```

### ¿Por qué fetch paralelo?

```ts
// ❌ Fetch en serie: espera show → después seasons → después cast = lento
const show = await fetch(`/shows/${id}`);
const seasons = await fetch(`/shows/${id}/seasons`);

// ✅ Fetch en paralelo: los 3 viajan al mismo tiempo
const [show, seasons, cast] = await Promise.all([
  fetch(`/shows/${id}`).then((r) => r.json()),
  fetch(`/shows/${id}/seasons`).then((r) => r.json()),
  fetch(`/shows/${id}/cast`).then((r) => r.json()),
]);
```

### Comportamiento del AbortController con Promise.all

```ts
useEffect(() => {
  if (!id) return;

  const controller = new AbortController();
  const { signal } = controller;

  const cargar = async () => {
    setShow({ status: "loading" });
    setSeasons({ status: "loading" });
    setCast({ status: "loading" });

    try {
      const [showData, seasonsData, castData] = await Promise.all([
        fetch(`https://api.tvmaze.com/shows/${id}`, { signal }).then((r) =>
          r.json(),
        ),
        fetch(`https://api.tvmaze.com/shows/${id}/seasons`, { signal }).then(
          (r) => r.json(),
        ),
        fetch(`https://api.tvmaze.com/shows/${id}/cast`, { signal }).then((r) =>
          r.json(),
        ),
      ]);
      setShow({ status: "success", data: showData });
      setSeasons({ status: "success", data: seasonsData });
      setCast({ status: "success", data: castData });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      // Manejo de error...
    }
  };

  void cargar();
  return () => controller.abort();
}, [id]);
```

### Qué mostrar en la página de detalle

- Imagen, nombre, géneros, rating, estado (Running/Ended), estreno
- Resumen (el `summary` viene con HTML embebido — tip: `dangerouslySetInnerHTML`)
- Lista de temporadas con número de episodios y fechas
- Elenco: foto, nombre del actor, nombre del personaje
- Botón **"Agregar a mi lista"** con selector de estado (`plan-to-watch` / `watching` / `completed`)
  - Si ya está en la lista: muestra el estado actual con opción de cambiar o quitar

### Criterios de aceptación

- [ ] Los 3 fetches se hacen en paralelo (verificable en DevTools → Network)
- [ ] Navegar a otra serie cancela los fetches pendientes de la anterior
- [ ] El botón de agregar a la lista funciona sin estar logueado — redirige al login
- [ ] El botón muestra el estado actual si el show ya está en la lista

---

---

## FEATURE 5 — WatchlistContext: lista personal

**Objetivo:** Feature aislada del watchlist, preparada para migrar a Zustand.

### Contrato del contexto

```ts
type WatchlistContextValue = {
  items: ShowEnLista[];
  agregarShow: (show: Show, status: WatchStatus) => void;
  quitarShow: (showId: number) => void;
  cambiarStatus: (showId: number, status: WatchStatus) => void;
  estaEnLista: (showId: number) => boolean;
  getStatus: (showId: number) => WatchStatus | null;
  // Derivados
  totalPorStatus: Record<WatchStatus, number>;
};
```

### Archivos

```
src/features/watchlist/
├── WatchlistContext.tsx    ← Provider con toda la lógica
└── useWatchlist.ts         ← Puerta única (useContext + guard)
```

### Reglas de negocio

- Cada usuario tiene su propia lista: la clave de localStorage tiene que incluir el `user.id`
  - Ejemplo: `watchlist:user:1`
- Si `user` es `null`, la lista está vacía (pero no crashea)
- `agregarShow` con un show que ya está → actualiza el status (no duplica)

### `MyListPage`

Tiene que mostrar:

1. **3 tabs o secciones**: Plan to Watch / Watching / Completed
2. **Contador por tab** — cuántos shows tiene cada sección
3. En cada sección: cards con imagen, nombre, botón para cambiar estado, botón para quitar
4. Si la sección está vacía: un mensaje vacío con un link a `/shows`

### `useMemo` obligatorio acá

```ts
// Los conteos derivados — no los guardés en estado separado
const totalPorStatus = useMemo(
  () =>
    items.reduce(
      (acc, item) => {
        acc[item.status] = (acc[item.status] ?? 0) + 1;
        return acc;
      },
      {} as Record<WatchStatus, number>,
    ),
  [items],
);

// El filtrado por tab
const showsPorTab = useMemo(
  () => items.filter((item) => item.status === tabActiva),
  [items, tabActiva],
);
```

### Criterios de aceptación

- [ ] La lista persiste al refrescar
- [ ] Dos usuarios distintos tienen listas independientes
- [ ] `estaEnLista` y `getStatus` están disponibles para que `ShowDetailPage` los use
- [ ] Los conteos por tab se actualizan reactivamente al agregar/quitar
- [ ] Acceder a `/my-list` sin sesión → redirige a login (Feature 2)

---

---

## FEATURE 6 — Optimización con evidencia

**Objetivo:** Medir antes de optimizar. Justificar cada decisión con datos del Profiler.

### Paso 1 — Baseline

Antes de cualquier cambio:

1. DevTools → Profiler → grabar
2. Navegar a `/shows`, escribir una búsqueda, cambiar el filtro de género 3 veces
3. Detener la grabación
4. **Captura de pantalla del flamegraph** — la necesitás para la entrega

### Paso 2 — Identificar el problema

En una grilla con 50+ cards, cada vez que cambia el género seleccionado (estado local de `BrowsePage`), **todas las cards re-renderizan**, aunque el show que muestra cada una no cambió.

### Paso 3 — Aplicar React.memo

```tsx
// components/ShowCard.tsx
interface Props {
  show: Show;
  onAgregarALista: (show: Show) => void; // ← esta función tiene que ser estable
}

const ShowCard = React.memo(function ShowCard({
  show,
  onAgregarALista,
}: Props) {
  // ...
});
```

Para que `React.memo` funcione, `onAgregarALista` tiene que ser la misma referencia entre renders.

```tsx
// BrowsePage.tsx
const { agregarShow } = useWatchlist();

const handleAgregar = useCallback(
  (show: Show) => agregarShow(show, "plan-to-watch"),
  [agregarShow], // agregarShow es estable porque está en useCallback dentro del Provider
);
```

### Paso 4 — Re-medir y comparar

Mismo escenario del Paso 1. Compará:

| Métrica                                  | Antes | Después |
| ---------------------------------------- | ----- | ------- |
| Re-renders de ShowCard al cambiar género | ?     | ?       |
| Tiempo total del render                  | ?     | ?       |

### Criterios de aceptación

- [ ] `ShowCard` está envuelta en `React.memo`
- [ ] `handleAgregar` usa `useCallback` en `BrowsePage`
- [ ] Las acciones del `WatchlistProvider` están en `useCallback`
- [ ] Hay 2 capturas del Profiler (antes/después) en la carpeta `/docs/` del repo
- [ ] El README tiene una sección "Optimización" con la tabla de comparación

---

---

## Arquitectura final esperada

```
src/
├── features/
│   ├── auth/
│   │   ├── AuthContext.tsx
│   │   ├── useAuth.ts
│   │   └── mockUsers.ts
│   └── watchlist/
│       ├── WatchlistContext.tsx
│       └── useWatchlist.ts
├── hooks/
│   ├── useToggle.ts
│   ├── useLocalStorage.ts
│   ├── useShows.ts
│   ├── useShow.ts
│   └── useDebounce.ts
├── types/
│   └── index.ts
├── components/
│   ├── Navbar.tsx
│   ├── ShowCard.tsx
│   ├── Spinner.tsx
│   └── ProtectedRoute.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── BrowsePage.tsx
│   ├── ShowDetailPage.tsx
│   ├── MyListPage.tsx
│   └── LoginPage.tsx
├── layouts/
│   └── MainLayout.tsx
└── main.tsx
```

---

## 📋 Checklist de entrega

### Funcionalidad

- [ ] Todas las rutas funcionan y no rompen al refrescar (necesitás configurar el historyApiFallback en vite)
- [ ] Búsqueda debounceada conectada a la URL
- [ ] Filtro de género sobre resultados en memoria
- [ ] Fetch paralelo en el detalle (verificable en Network tab)
- [ ] Login simulado con redirección inteligente
- [ ] Lista personal separada por usuario
- [ ] Lista persiste al refrescar
- [ ] JSON corrupto en localStorage → app funciona igual

### Código

- [ ] Cero `any`
- [ ] Cero `useEffect` de fetching en componentes con JSX
- [ ] `npm run build` sin errores ni warnings
- [ ] `npm run lint` sin errores
- [ ] Ambos contextos consumidos solo a través de `useAuth` y `useWatchlist`
- [ ] Commits convencionales por feature (`feat: add auth context`, etc.)

### Optimización

- [ ] `ShowCard` envuelta en `React.memo`
- [ ] Capturas del Profiler en `/docs/`
- [ ] Tabla de comparación en el README

### Entrega

- [ ] Repositorio público en GitHub
- [ ] README con: cómo correr el proyecto, decisiones técnicas, tabla de optimización, sección de IA
- [ ] Demo funcionando (Vercel / Netlify — opcional pero suma)

---

## 🔍 Preguntas de defensa

No podés leer notas. Elegís 3 al azar.

1. Tenés 2 contextos (`AuthContext` y `WatchlistContext`). ¿Por qué no los fusionaste en uno solo?
2. ¿Qué pasa si `useWatchlist()` se llama fuera de `WatchlistProvider`? ¿Cómo lo manejás?
3. La búsqueda sincroniza con la URL. ¿Qué ventaja real le da al usuario?
4. Explicá el flujo completo de un `AbortController` en `useShows`: cuándo se crea, cuándo dispara el abort y qué pasa si llega la respuesta igual.
5. ¿Por qué `React.memo` solo sirve si `onAgregarALista` es una referencia estable?
6. Si mañana migramos `WatchlistContext` a Zustand, ¿qué archivos cambiás?
7. ¿Por qué los derivados (`totalPorStatus`, `showsFiltrados`) no son estado sino `useMemo`?
8. El `ProtectedRoute` redirige a `/login` pero guarda la ruta original. ¿Cómo funciona eso técnicamente con React Router?
9. ¿Qué problema resuelve `useDebounce` y cómo lo implementarías sin una librería externa?
10. Si dos tabs del navegador tienen el mismo usuario logueado y uno hace logout, ¿qué pasa en el otro? ¿Cómo lo resolverías?

---

## ⚡ Niveles de entrega

Para que tengas una referencia de dónde estás parado:

| Nivel         | Descripción                                                        |
| ------------- | ------------------------------------------------------------------ |
| **Mínimo**    | Features 1–3 completas, sin optimización, sin tests                |
| **Esperado**  | Features 1–5 completas, con evidencia de optimización              |
| **Destacado** | Todo lo anterior + debounce en URL + Profiler documentado + deploy |

> No hay penalidad por entregar el nivel mínimo. Sí hay diferencia en la conversación de la defensa.

---

## 📎 Recursos

- [TVMaze API docs](https://www.tvmaze.com/api)
- [React Router v6 — `useSearchParams`](https://reactrouter.com/en/main/hooks/use-search-params)
- [React Router v6 — Rutas protegidas](https://reactrouter.com/en/main/start/faq#how-do-i-add-a-not-found-404-route)
- [`Promise.all` — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
- [React Profiler](https://react.dev/reference/react/Profiler)
- [Vite — historyApiFallback para deploy](https://vite.dev/guide/build#base-public-path)
