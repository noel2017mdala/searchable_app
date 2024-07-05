"use client";
import "react-datepicker/dist/react-datepicker.css";
import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import Modal from "./Modal";
import useImageUpload from "@/app/hooks/useImageUpload";
import { toast } from "react-hot-toast";
import Image from "next/image";
import dogBreeds, { DogBreed } from "@/types/dogBreed";
import axios from "axios";

enum STEPS {
  GREETINGS = 0,
  DOG_INFO = 1,
  UPLOAD = 2,
}

const ImageUploadModal = () => {
  const [steps, setSteps] = useState(STEPS.GREETINGS);
  const imageUpload = useImageUpload();

  const [loader, setLoader] = useState<boolean>(false);
  const [files, setFiles] = useState<any[]>();
  const [dogName, setDogName] = useState<string>("");
  const [dogBreed, setDogBread] = useState<string>("");
  const [inputErrors, setInputErrors] = useState({
    upload: false,
    dogName: false,
    dogBreed: false,
  });
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DogBreed[]>([]);

  function searchDogBreeds(query: string): DogBreed[] {
    const lowerCaseQuery = query.toLowerCase();
    const uniqueResults = new Set<DogBreed>();

    dogBreeds.forEach((breed) => {
      if (breed.label.toLowerCase().includes(lowerCaseQuery)) {
        uniqueResults.add(breed);
      }
    });

    return Array.from(uniqueResults);
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setDogBread(value);
    setQuery(value);
    setResults(searchDogBreeds(value));
    setInputErrors({
      dogBreed: false,
      upload: false,
      dogName: false,
    });
    if (value === "") {
      setResults([]);
    }
  };

  const actionLabel = useMemo(() => {
    if (STEPS.UPLOAD === steps) {
      return "Submit";
    }

    return "Next";
  }, [steps]);

  const secondaryActionLabel = useMemo(() => {
    if (steps === STEPS.GREETINGS) return undefined;
    return "Back";
  }, [steps]);

  const onBack = useCallback(() => {
    setSteps((value) => value - 1);
  }, []);

  const onNext = useCallback(() => {
    setSteps((value) => value + 1);
  }, []);

  const onPrevious = useCallback(async () => {
    return onBack();
  }, [steps]);

  const handleUpload = async () => {
    if (steps === STEPS.UPLOAD) {
      if (files) {
        setLoader(true);
        const formData = new FormData();
        formData.append("filename", files[0].name);
        formData.append("breedBreed", dogBreed);
        formData.append("dogName", dogName);
        formData.append("file", files[0]);

        const uploadDogImage = await axios.post(
          `${process.env.NEXT_PUBLIC_NEXT_SERVER_URL}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (uploadDogImage.status === 200) {
          setLoader(false);
          setDogName("");
          setFiles([""]);
          setDogBread("");
          setSteps(STEPS.GREETINGS);
          toast.success("Image uploaded successfully");
          imageUpload.onClose();

          return uploadDogImage.data;
        } else {
          setLoader(false);
          setFiles([""]);
          toast.error("Failed to upload your image please try again later");
        }
      } else {
        setLoader(false);
        // setFiles([""]);
        toast.error("Please upload your image");
      }
    } else if (steps === STEPS.DOG_INFO) {
      if (dogName === "") {
        setInputErrors({
          dogBreed: false,
          upload: false,
          dogName: true,
        });
      } else if (dogBreed === "") {
        setInputErrors({
          dogBreed: true,
          upload: false,
          dogName: false,
        });
      } else {
        return onNext();
      }
    } else {
      return onNext();
    }

    try {
    } catch (error) {}
  };

  const onDrop = useCallback(async (acceptedFiles: any) => {
    const acceptedFormats = ["jpg", "jpeg", "png"];
    let newText = acceptedFiles[0].name;
    let fileFormat = newText
      .slice((Math.max(0, newText.lastIndexOf(".")) || Infinity) + 1)
      .toLowerCase();

    if (fileFormat && acceptedFormats.includes(fileFormat)) {
      setInputErrors({
        upload: false,
        dogBreed: false,
        dogName: false,
      });
      setFiles(acceptedFiles);
    } else {
      toast.error("Invalid file format provided");
      if (acceptedFiles.length === 0) {
        setInputErrors({
          upload: true,
          dogBreed: false,
          dogName: false,
        });
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <div>
        <Image
          src="/web/happy_dog_community.png"
          alt="Welcome Image"
          className="w-2/4 h-2/4 mx-auto"
          width={200}
          height={200}
        />

        <div className="pt-4 w-4/5 mx-auto">
          <p className="text-gray-600 mb-4">
            Help us expand our dog knowledge by adding your dog&apos;s
            information and photo. It&apos;s paw-some to have you here!
          </p>
          <p className="text-gray-600 mb-4">
            Uploading images is crucial as it helps us improve our search
            capabilities and provides better matching results for everyone.
            Plus, it&apos;s a great way to show off your furry friend! 😅
          </p>
        </div>
      </div>
    </div>
  );

  if (steps === STEPS.DOG_INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <div>
          <div className="">
            <h2 className="text-2xl font-bold mb-4">Tell Us About Your Dog</h2>
            <p className="text-gray-600 mb-4">
              We&apos;d love to know more about your furry friend. Please fill
              out the information below:
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-4 w-full">
            <div>
              <input
                type="text"
                className={`
              shadow
              appearance-none
              border
              rounded
              w-full
              p-4
              text-gray-500
              leading-tight
              focus:outline-none focus:shadow-outline

                        ${
                          inputErrors.dogName
                            ? ` border-solid
              border-red-500
                border-3`
                            : null
                        }
              `}
                placeholder="Dog Name"
                required
                value={dogName}
                onChange={(e) => {
                  setInputErrors({
                    dogBreed: false,
                    upload: false,
                    dogName: false,
                  });
                  setDogName(e.target.value);
                }}
              />
            </div>

            <div>
              <input
                type="text"
                className={`
              shadow
              appearance-none
              border
              rounded
              w-full
              p-4
              text-gray-500
              leading-tight
              focus:outline-none focus:shadow-outline

                       ${
                         inputErrors.dogBreed
                           ? ` border-solid
              border-red-500
                border-3`
                           : null
                       }
              `}
                placeholder="Search for a dog breed"
                required
                value={dogBreed}
                onChange={handleSearch}
              />
              {results.length > 0 && (
                <ul className="list-none p-0 m-0 max-h-56 overflow-y-auto border border-gray-300 rounded bg-white mt-4">
                  {results.map((breed) => (
                    <li
                      key={breed.value}
                      className="p-2 border-b last:border-b-0 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setResults([]);
                        setDogBread(breed.label);
                      }}
                    >
                      {breed.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (steps === STEPS.UPLOAD) {
    bodyContent = (
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Upload Your Dog&apos;s Photo
        </h2>
        <p className="text-gray-600 mb-4">
          Finally, please upload a photo of your dog to complete the process:
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
                  <span className="font-semibold">
                    Drop your files here ...
                  </span>
                ) : (
                  <>
                    {!isDragActive && files ? (
                      <p>{files[0].name}</p>
                    ) : (
                      <>
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
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
  }

  return (
    <Modal
      isOpen={imageUpload.isOpen}
      onClose={imageUpload.onClose}
      onSubmit={handleUpload}
      title={
        steps === STEPS.GREETINGS
          ? "Welcome to the Dog Database!"
          : steps === STEPS.DOG_INFO
          ? "Tell Us About Your Dog"
          : steps === STEPS.UPLOAD
          ? "Upload Your Dogs Photo"
          : "🐕‍🦺"
      }
      actionLabel={actionLabel}
      body={bodyContent}
      disabled={loader}
      secondaryActonLabel={secondaryActionLabel}
      secondaryAction={steps === STEPS.GREETINGS ? undefined : onPrevious}
    />
  );
};

export default ImageUploadModal;
