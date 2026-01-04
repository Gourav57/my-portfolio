import { create } from 'zustand'

export const useStore = create((set) => ({
  colors: {
    laces: '#ffffff',
    mesh: '#333333',
    sole: '#ff0000',
    inner: '#ffffff', // This controls the inside of the shoe
  },
  
  // This function updates the specific part when you click a button
  setColor: (part, color) =>
    set((state) => ({
      colors: { ...state.colors, [part]: color },
    })),
}))