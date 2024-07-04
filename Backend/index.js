import express from "express";
import multer from "multer";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";
import { client } from "./weaviateConnection.js";
import fs from "fs";
import util from "util";
import cors from "cors";
import { config } from "dotenv";

config();
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const lstat = util.promisify(fs.lstat);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = process.env.NODE_PORT;

const app = express();
app.use(cors());
app.use("/Images", express.static(join(__dirname, "Images")));
app.use("/uploads", express.static(join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

app.post("/search", upload.single("file"), async (req, res) => {
  try {
    const imageData = fs.readFileSync(req.file.path);
    const b64 = Buffer.from(imageData).toString("base64");
    if (req.file) {
      const resImage = await client.graphql
        .get()
        .withClassName("Dog")
        .withFields(["image", "filepath", "breed"])
        .withNearImage({ image: b64 })
        .withLimit(10)
        .do();

      return res
        .json({
          status: true,
          image: resImage.data.Get.Dog,
        })
        .status(200);
    } else {
      res.status(400).send("Failed to search for the image");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Failed to search for the image");
  }
});

app.post(
  "/upload",
  upload.fields([
    { name: "filename", maxCount: 1 },
    { name: "breedBreed", maxCount: 1 },
    { name: "dogName", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const files = req.files["file"];
      const breedBreed = req.body.breedBreed;
      const dogName = req.body.dogName;

      console.log(breedBreed);

      if (files && files.length > 0) {
        const file = files[0];
        const imageData = fs.readFileSync(file.path);
        const b64 = Buffer.from(imageData).toString("base64");

        let uploadImage = await client.data
          .creator()
          .withClassName("Dog")
          .withProperties({
            image: b64,
            breed: breedBreed || "",
            filepath: file.path,
          })
          .do();

        if (uploadImage) {
          res.status(200).json({
            imageData: uploadImage,
          });
        } else {
          res.status(400).send("Failed to upload your image");
        }
      } else {
        res.status(400).send("No file uploaded");
      }
    } catch (error) {
      console.log(error);
      res.status(400).send("Failed to upload your image here");
    }
  }
);

app.post("/bulkupload", async (req, res) => {
  try {
    const mainDirectory = "./Images";
    let batch = client.batch.objectsBatcher();
    const dataObjects = [];

    async function processFiles() {
      try {
        const breedFolders = await readdir(mainDirectory);

        for (const breedFolder of breedFolders) {
          const breedPath = path.join(mainDirectory, breedFolder);

          if ((await lstat(breedPath)).isDirectory()) {
            const breedName = breedFolder.split("-")[1];
            const imageFiles = await readdir(breedPath);

            const readPromises = imageFiles.map(async (imageFile) => {
              const imagePath = path.join(breedPath, imageFile);
              const data = await readFile(imagePath);
              console.log(imagePath);

              const base64 = Buffer.from(data).toString("base64");

              dataObjects.push({
                breed: breedName,
                image: base64,
                filepath: imagePath,
              });
            });

            await Promise.all(readPromises);
          }
        }

        const batchPromises = dataObjects.map((dataObj) => {
          batch = batch.withObject({
            class: "Dog",
            properties: dataObj,
          });
        });
        await Promise.all(batchPromises);

        let results = await batch.do();
        return results;
      } catch (err) {
        res.status(400).send("Failed to upload images");
      }
    }

    let bulkUploadsResults = await processFiles();

    if (bulkUploadsResults) {
      return res.status(200).json({
        status: true,
        bulkUploadsResults,
      });
    }

    res.status(400).send("Failed to upload images");
  } catch (error) {
    console.log(error);
    res.status(400).send("Failed to upload images");
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
