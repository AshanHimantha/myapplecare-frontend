import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      roles: [],
      isAuthenticated: false,
      
      setAuth: (token, user, roles) => set({ 
        token, 
        user,
        roles,
        isAuthenticated: true 
      }),
      
      hasRole: (role) => {
        const { roles } = get();
        return roles.includes(role);
      },

      hasAccess: (accessTypes) => {
        const { roles } = get();
        // Handle array of access types
        if (Array.isArray(accessTypes)) {
          return accessTypes.some(type => roles.includes(type));
        }
        // Handle single access type
        return roles.includes(accessTypes);
      },

      getRedirectPath: () => {
        const { roles } = get();
        if (roles.includes('admin')) {
          return '/choose-store';
        }
        if (roles.includes('technician') && roles.includes('cashier')) {
          return '/choose-store';
        }
        if (roles.includes('cashier')) {
          return '/sales-outlet';
        }
        if (roles.includes('technician')) {
          return '/service-center';
        }
        return '/';
      },

      logout: () => set({
        token: null,
        user: null,
        roles: [],
        isAuthenticated: false
      })
    }),
    {
      name: 'auth-storage'
    }
  )
)

export default useAuthStore