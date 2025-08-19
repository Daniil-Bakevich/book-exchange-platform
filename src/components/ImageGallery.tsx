"use client";

import { useState } from "react";
import Image from "next/image";

type ImageGalleryProps = {
  images: string[];
  title: string;
};

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="space-y-4">
      <div className="relative w-3/4 mx-auto overflow-hidden bg-gray-100 rounded-lg aspect-square">
        <Image
          src={selectedImage}
          alt={`Cover of ${title}`}
          layout="fill"
          objectFit="cover"
          className="transition-opacity duration-300"
        />
      </div>
      <div className="flex justify-center space-x-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(image)}
            className={`relative w-16 h-16 overflow-hidden rounded-md transition ${selectedImage === image ? "ring-2 ring-primary ring-offset-2" : ""}`}
          >
            <Image src={image} alt={`Thumbnail ${index + 1}`} layout="fill" objectFit="cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
