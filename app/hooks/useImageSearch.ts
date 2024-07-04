import { create } from "zustand";
type RegisterTalentModal = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const useImageSearch = create<RegisterTalentModal>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useImageSearch;
