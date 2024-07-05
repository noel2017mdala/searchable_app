"use client";
import React, { useState } from "react";
import Container from "./Container";
import useImagesStore from "@/app/store/imagesStore";

const ViewImages = () => {
  const { images } = useImagesStore();
  return (
    <>
      {images && images.length > 0 && (
        <Container>
          <div className="mb-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">
                Your Fetched Dog Gallery
              </h1>
              <p className="text-gray-600">
                Here are the adorable look-alikes we&apos;ve found based on your
                uploaded photo. Enjoy browsing through these paw-some matches!
              </p>
            </div>

            <div className="mt-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image: Image, index: number) => (
                  <div key={index} className="overflow-hidden rounded-lg">
                    <img
                      src={`${process.env.NEXT_PUBLIC_NEXT_SERVER_URL}/${image.filepath}`}
                      alt={`${image.breed}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      )}
    </>
  );
};

export default ViewImages;
