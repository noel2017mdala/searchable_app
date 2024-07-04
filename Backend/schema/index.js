export const schema = {
  class: "Dog",
  description: "Images of different dogs",
  moduleConfig: {
    "img2vec-neural": {
      imageFields: ["image"],
    },
  },
  vectorIndexType: "hnsw",
  vectorizer: "img2vec-neural",
  properties: [
    {
      name: "breed",
      dataType: ["string"],
      description: "name of dog breed",
    },
    {
      name: "image",
      dataType: ["blob"],
      description: "image",
    },
    {
      name: "filepath",
      dataType: ["string"],
      description: "filepath of the images",
    },
  ],
};
