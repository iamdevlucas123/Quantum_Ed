import { create } from 'zustand';

type UiState = {
  isLoginModalOpen: boolean;
};

type UiActions = {
  openLoginModal: () => void;
  closeLoginModal: () => void;
};

type UiStore = UiState & UiActions;

export const useUiStore = create<UiStore>((set) => ({
  isLoginModalOpen: false,

  openLoginModal: () => {
    set({ isLoginModalOpen: true });
  },

  closeLoginModal: () => {
    set({ isLoginModalOpen: false });
  },
}));
