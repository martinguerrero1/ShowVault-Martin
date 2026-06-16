STACK: 
proy setup: Vite react typescript tailwind 

libraries: react dom 
zustand

toolkit: eslint prettier husky commitlint lint-staged

feature 1 y 2: arquitectura del proyecto y autentificacion:
- Tome la decision de usar zustand ya que es lo mas prolijo y organizado en el codigo, ademas tambien me brinda mayor facilidad para la persistencia de los datos.
- 

- [x] Navegar entre rutas no recarga la página (SPA)
- [x] La Navbar siempre es visible excepto en /login
- [x] Ir a /my-list sin sesión redirige a /login
- [x] El botón back del navegador funciona correctamente

- [x] Login con credenciales incorrectas muestra error, no crashea
- [x] Login exitoso redirige a la ruta que el usuario intentaba visitar
- [x] Refrescar la página conserva la sesión (localStorage)
- [x] Logout limpia la sesión y redirige a `/login`
- [x] El formulario tiene loading state mientras espera