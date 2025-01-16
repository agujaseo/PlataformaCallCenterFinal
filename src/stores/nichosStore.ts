import { create } from 'zustand';

interface Category {
  id: number;
  name: string;
}

interface NichosState {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  removeCategory: (id: number) => void;
  updateCategory: (id: number, name: string) => void;
}

export const useNichosStore = create<NichosState>((set) => ({
  categories: [
    { id: 1, name: 'Restaurantes' },
    { id: 2, name: 'Hoteles' },
    { id: 3, name: 'Clínicas Dentales' },
    { id: 4, name: 'Gimnasios' },
    { id: 5, name: 'Talleres Mecánicos' },
    { id: 6, name: 'Inmobiliarias' },
    { id: 7, name: 'Peluquerías y Salones de Belleza' }
  ],
  setCategories: (categories) => set({ categories }),
  addCategory: (category) => set((state) => ({ 
    categories: [...state.categories, category] 
  })),
  removeCategory: (id) => set((state) => ({ 
    categories: state.categories.filter(cat => cat.id !== id) 
  })),
  updateCategory: (id, name) => set((state) => ({
    categories: state.categories.map(cat => 
      cat.id === id ? { ...cat, name } : cat
    )
  }))
}));
