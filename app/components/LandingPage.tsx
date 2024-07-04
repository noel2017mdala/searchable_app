"use client";
import Image from "next/image";
import React from "react";
import Container from "./Container";
import useImageSearch from "@/app/hooks/useImageSearch";
import useImageUpload from "@/app/hooks/useImageUpload";

const LandingPage = () => {
  const imageSearch = useImageSearch();
  const imageUpload = useImageUpload();
  return (
    <div className="bg-gray-50  flex flex-col items-center">
      <header className="w-full p-6 flex justify-between items-center">
        <div className="text-2xl font-bold">Searchable</div>
        <div className="space-x-4">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-full items-center justify-ce"
            onClick={() => {
              imageUpload.onOpen();
            }}
          >
            Upload Photo
          </button>
        </div>
      </header>
      <Container>
        <main className="flex flex-col-reverse md:flex-row items-center justify-center">
          <div>
            <h1 className="text-4xl font-bold mt-6">
              Search for Your Dog's Look-Alikes
            </h1>
            <p className="text-gray-600 mt-2 max-w-lg">
              A dog is the only thing on earth that loves you more than you love
              yourself. When the dog looks at you, the dog is not thinking what
              kind of a person you are.
            </p>

            <p className="text-gray-600 mt-2  max-w-lg">
              Upload a photo of your furry friend and let us fetch similar dog
              images! Our smart search will leave you howling with joy.
            </p>
            <button
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full items-center justify-center"
              onClick={() => {
                imageSearch.onOpen();
              }}
            >
              Dog Search
            </button>
          </div>

          <div className="">
            <Image
              src="/web/dog.png"
              alt="Smart Dog"
              className="text-center"
              width={500}
              height={500}
            />
          </div>
        </main>
      </Container>
    </div>
  );
};

export default LandingPage;
