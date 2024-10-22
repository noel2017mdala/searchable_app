# searchable_app

This project is an image search application built using Weaviate, JavaScript, and TypeScript. It allows users to upload an image and find similar images from a dataset using vector embeddings.

## Features

- **Image Upload:** Users can upload a Dog image to search for similar images.
- **Similarity Search:** Utilizes Weaviate to find and display images similar to the uploaded image based on vector embeddings.
- **User Interface:** A clean and intuitive interface built with Next.js and TailwindCSS.
- **Backend:** Node.js.

- ## Demo
- App image https://drive.google.com/file/d/1oooeNnKVB0LjrGUGz3VqrdotgR3gpKSf/view?usp=drive_link

- Demo video of the app https://drive.google.com/file/d/18v5k-FAmuEnXeQ0bs0o294hBrpi6ruUG/view?usp=drive_link

## Getting Started

### Prerequisites

- Next.js
- TailwindCss
- Node.js
- Docker
- Weaviate instance (local or cloud)

### Installation

1. **Clone the Repository:**

````bash
git clone https://github.com/noel2017mdala/searchable_app
cd searchable_app


2. **Install FrontEnd Dependencies:**

```bash
npm install

2. **Install Backend Dependencies:**

```bash
cd Backend

```bash
npm install

3. **Generate docker-compose file and start the container:**


```bash
curl -o docker-compose.yml "https://configuration.weaviate.io/v2/docker-compose/docker-compose.yml?generative_anyscale=false&generative_aws=false&generative_cohere=false&generative_mistral=false&generative_octoai=false&generative_ollama=false&generative_openai=false&generative_palm=false&image_neural_model=pytorch-resnet50&media_type=image&modules=modules&ref2vec_centroid=false&reranker_cohere=false&reranker_transformers=false&runtime=docker-compose&weaviate_version=v1.25.4&weaviate_volume=host-binding"

```bash
docker-compose up -d


4. **Configure Backend and start the server:**

```bash
Add .env file and configure the NODE_PORT to your port of choice the default port is 3001


```bash
node index.js

5. **Configure Frontend:**

From your terminal navigate to the frontend code

6. **Configure FrontEnd:**

```bash
Add .env file and configure the NEXT_PUBLIC_NEXT_SERVER_URL url for the Backend the default is http://[serverurl:port]

7. **Start frontend code:**

```bash
npm run start

## Technologies Used
- **/Frontend:** React Next.js, TailwindCss, Zustand
- **/Backend:** Node.js, Express.js, Weaviate


## Dataset Used
- https://www.kaggle.com/datasets/jessicali9530/stanford-dogs-dataset

## To import the images
- Downoad the images from the link ubove
- the structure of the images  downloaded is as archive -> images -> the images copy from the images into Backend/Images
- from Postman run http://[serverurl:port]/bulkupload  to import the images


## Contact
- For any questions or inquiries, please contact me at noelmdala2017@gmail.com.



````
