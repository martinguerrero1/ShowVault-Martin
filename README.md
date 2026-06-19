# ShowVault

ShowVault es una SPA para explorar series de TV, ver detalles y guardar una lista personal de series.

## Stack utilizado

### Setup base
- Vite
- React
- TypeScript

### Librerías
- Tailwind CSS
- React Router DOM
- Zustand
- Axios

### API
- TVMaze API

### Herramientas de calidad y desarrollo
- ESLint
- Prettier
- Husky
- Commitlint
- lint-staged

## Funcionalidades principales

* Navegación entre páginas con React Router.
* Búsqueda de series usando la API de TVMaze.
* Filtros por género y ordenamiento.
* Página de detalle de cada serie.
* Login simulado.
* Ruta protegida para la lista personal.
* Watchlist persistente por usuario.
* Estados de carga y error.
* Optimización con React.memo, useMemo y useCallback.

## Cuentas de prueba

```txt
Email: neriheredia@appwise.com
Password: 1234

Email: martinguerrero@appwise.com
Password: 1234
```

## Cómo correr el proyecto

```bash
npm install
npm run dev
```

## Optimización

Se realizó una medición inicial con React DevTools Profiler y luego se aplicaron optimizaciones en componentes de cards usando `React.memo`, `useMemo` y `useCallback`.

| Métrica                                  |     Antes |   Después |
| ---------------------------------------- | --------: | --------: |
| Re-renders de ShowCard al cambiar género | 13 | 10 |

Las capturas del Profiler se encuentran en la carpeta `/docs`.

## API utilizada

Este proyecto utiliza la API pública de TVMaze:

```txt
https://api.tvmaze.com
```