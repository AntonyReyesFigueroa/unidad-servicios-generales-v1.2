import Image from 'next/image';
import React, { useState } from 'react';
import ImageCropper from "@/components/ImageCropper";

export default function ComponentSubirImg({ getUrlImage, setGetUrlImage }) {
  const [imageToCrop, setImageToCrop] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleButtonClick = async () => {
    const filePicker = document.createElement('input');
    filePicker.type = 'file';
    filePicker.accept = 'image/*';

    filePicker.onchange = (event) => {
      const file = event.target.files[0];
      if (!file) {
        console.log("No se ha seleccionado ningún archivo.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result);
      };
      reader.readAsDataURL(file);
    };

    filePicker.click();
  };

  const handleCropComplete = async (croppedBlob) => {
    const formData = new FormData();
    formData.append('image', croppedBlob);
    setLoading(true);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setGetUrlImage(data.url);
      setImageToCrop(null);
      setLoading(false);
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mb-6 md:mb-0 md:mr-6">
      {loading ? (
        <p className="text-white mt-4">Subiendo imagen...</p>
      ) : imageToCrop ? (
        <ImageCropper
          imageSrc={imageToCrop}
          onCropComplete={handleCropComplete}
          onClose={() => setImageToCrop(null)}
        />
      ) : (
        <Image
          src={getUrlImage || "/user.avif"}
          alt="Imagen de usuario"
          className="rounded-full border-4 border-indigo-600"
          width={120}
          height={120}
          priority
        />
      )}
      {!loading && !imageToCrop && (
        <button
          type="button"
          className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-lg"
          onClick={handleButtonClick}
        >
          Subir imagen
        </button>
      )}
    </div>
  );
}
