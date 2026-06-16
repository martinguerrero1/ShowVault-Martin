import { create } from "zustand"
import { persist } from "zustand/middleware";
import { MOCK_USERS } from "./mockUsers";


type AuthStore = {
  user: { id: string; name: string; email: string } | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>; // async para simular latencia
  logout: () => void;
  error: string | null;
  isLoading: boolean;
};


export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (email, password) => {
              set({
                isLoading: true,
                error: null,
              });
          
              await new Promise((resolve) => setTimeout(resolve, 800));
          
              const userFound = MOCK_USERS.find(
                (user) => user.email === email && user.password === password,
              );
          
              if (!userFound) {
                set({
                  user: null,
                  isAuthenticated: false,
                  isLoading: false,
                  error: "Email o contraseña incorrectos",
                });
            
                return;
              }
          
              const { password: _, ...userWithoutPassword } = userFound;
          
              set({
                user: userWithoutPassword,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
            },

            logout: () => {
              set({
                user: null,
                isAuthenticated: false,
                error: null,
                isLoading: false,
              });
            },
        }),
        {
            name: "showvault-auth"
        }
    )
)
