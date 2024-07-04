import { create } from "zustand";
type RegisterTalentModal = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const useImageUpload = create<RegisterTalentModal>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useImageUpload;
