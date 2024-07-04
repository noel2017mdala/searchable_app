import create from "zustand";

interface ImagesStore {
  images: Image[];
  setImages: (newImages: Image[]) => void;
}

const useImagesStore = create<ImagesStore>(
  (set: (arg0: { images: any }) => any) => ({
    images: [],

    setImages: (newImages: any) => set({ images: newImages }),
  })
);

export default useImagesStore;
