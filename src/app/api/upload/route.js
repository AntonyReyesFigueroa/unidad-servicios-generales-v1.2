import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configuración de Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET
});




export async function POST(request) {
  try {
    const data = await request.formData();
    const image = data.get("image");

    if (!image) {
      return NextResponse.json("No se ha subido ninguna imagen", {
        status: 400,
      });
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Subir el buffer directamente a Cloudinary usando una Promesa
    const response = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "empleados", resource_type: "auto" },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    console.log(response);
    

    return NextResponse.json({
      message: "Archivo subido exitosamente",
      url: response.secure_url,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
