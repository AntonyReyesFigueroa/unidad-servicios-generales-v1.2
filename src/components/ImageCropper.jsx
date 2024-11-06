import React, { useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const ImageCropper = ({ imageSrc, onCropComplete, onClose }) => {
  const cropperRef = useRef(null);

  const handleCrop = () => {
    const cropper = cropperRef.current.cropper;
    cropper.getCroppedCanvas().toBlob((blob) => {
      onCropComplete(blob);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-xs md:max-w-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 text-center">Ajusta la imagen</h2>
        <div className="w-full">
          <Cropper
            src={imageSrc}
            style={{ height: 300, width: "100%" }}
            aspectRatio={1}
            guides={false}
            ref={cropperRef}
            className="rounded-lg"
            background={false}
            responsive={true}
            autoCropArea={1}
            viewMode={1}
          />
        </div>
        <div className="flex justify-between mt-4">
          <button
            type="button"
            className="bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-lg"
            onClick={handleCrop}
          >
            Aceptar
          </button>
          <button
            type="button"
            className="bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded-lg"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
