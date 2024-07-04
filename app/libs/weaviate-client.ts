import weaviate, { WeaviateClient, ApiKey } from "weaviate-ts-client";

export const client: WeaviateClient = weaviate.client({
  scheme: "https",
  host: "",
  apiKey: new ApiKey(""),
});

export default client;

const schemaConfig = {
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

async function createSchema() {
  try {
    // Check if the class already exists
    const schemaRes = await client.schema.getter().do();

    if (schemaRes && schemaRes.classes) {
      const classExists = schemaRes.classes.some(
        (c: { class?: string }) => c.class === "Dog"
      );

      if (!classExists) {
        await client.schema.classCreator().withClass(schemaConfig).do();
        console.log("Schema created successfully");
      } else {
        console.log('Class "Image" already exists in the schema');
      }
    } else {
      console.error(
        "Error: Unable to fetch existing classes or classes property is undefined"
      );
    }
  } catch (error) {
    console.error("Error creating schema:", error);
  }
}

createSchema();
