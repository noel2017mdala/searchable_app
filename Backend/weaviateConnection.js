import weaviate from "weaviate-ts-client";
import { schema } from "./schema/index.js";
export const client = weaviate.client({
  scheme: "http",
  host: "localhost:8080",
});

async function createSchema() {
  try {
    const existingClasses = await client.schema.getter().do();

    if (existingClasses && existingClasses.classes) {
      const classExists = existingClasses.classes.some(
        (c) => c.class === "Dog"
      );

      if (!classExists) {
        await client.schema.classCreator().withClass(schema).do();
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
