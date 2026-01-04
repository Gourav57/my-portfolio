import { create } from 'zustand'

export const useStore = create((set) => ({
  colors: {
    laces: '#ffffff',
    mesh: '#333333',
    sole: '#ff0000',
  },
  setColor: (part, color) =>
    set((state) => ({
      colors: { ...state.colors, [part]: color },
    })),
}))