"use client";
import "react-datepicker/dist/react-datepicker.css";
import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import Modal from "./Modal";
import useImageSearch from "@/app/hooks/useImageSearch";
import { toast } from "react-hot-toast";
import axios from "axios";
import useImagesStore from "@/app/store/imagesStore";

const ImageSearchModal = () => {
  const imageSearch = useImageSearch();
  const actionLabel = useMemo(() => {
    return "Search";
  }, []);

  const secondaryActionLabel = useMemo(() => {
    return "Back";
  }, []);
  const [loader, setLoader] = useState<boolean>(false);
  const [files, setFiles] = useState<any[]>();
  const [inputErrors, setInputErrors] = useState({
    upload: false,
  });

  const { setImages } = useImagesStore();

  const handleUpload = async () => {
    try {
      if (files) {
        setLoader(true);
        const formData = new FormData();
        formData.append("file", files[0]);

        const searchRequest = await axios.post(
          `${process.env.NEXT_PUBLIC_NEXT_SERVER_URL}/search`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (searchRequest.status === 200) {
          setLoader(false);
          toast.success("Your results are ready 🦴🐕‍🦺");
          imageSearch.onClose();
          setImages(searchRequest.data.image);
          return searchRequest.data;
        } else {
          setLoader(false);

          toast.error("Failed to search for an image please try again later");
        }

        setFiles([""]);
        return searchRequest;
      } else {
        toast.error("Please upload your image");
      }
    } catch (error) {
      toast.error("Failed to search for an image please try again later");
      setLoader(false);
    }
  };
  const onBack = useCallback(() => {}, []);

  const onPrevious = useCallback(async () => {
    return onBack();
  }, []);

  const onDrop = useCallback(async (acceptedFiles: any) => {
    const acceptedFormats = ["jpg", "jpeg", "png"];
    let newText = acceptedFiles[0].name;
    let fileFormat = newText
      .slice((Math.max(0, newText.lastIndexOf(".")) || Infinity) + 1)
      .toLowerCase();

    if (fileFormat && acceptedFormats.includes(fileFormat)) {
      setInputErrors({
        upload: false,
      });
      setFiles(acceptedFiles);
    } else {
      toast.error("Invalid file format provided");
      if (acceptedFiles.length === 0) {
        setInputErrors({
          upload: true,
        });
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  let bodyContent = (
    <div>
      <p className="text-gray-600 mb-4">
        Ready to find your dog's long-lost twin? Upload a photo and let the
        tail-wagging fun begin!
      </p>

      <div
        className="flex items-center justify-center w-full uploadContent"
        {...getRootProps()}
      >
        <div
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  hover:bg-gray-100
            ${isDragActive ? "hover:bg-gray-100" : ""}
            
            `}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 ">
              {isDragActive && !files ? (
                <span className="font-semibold">Drop your files here ...</span>
              ) : (
                <>
                  {!isDragActive && files ? (
                    <p>{files[0].name}</p>
                  ) : (
                    <>
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </>
                  )}
                </>
              )}
            </p>
            <p className="text-xs text-gray-500">jpg, jpeg, png (MAX. 5MB)</p>
          </div>
          <input
            {...getInputProps()}
            name="file"
            accept=".pdf, application/pdf"
          />
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={imageSearch.isOpen}
      onClose={imageSearch.onClose}
      onSubmit={handleUpload}
      title="Upload Your Dog's Photo 🐶"
      actionLabel={actionLabel}
      body={bodyContent}
      disabled={loader}
      secondaryActonLabel={secondaryActionLabel}
    />
  );
};

export default ImageSearchModal;
