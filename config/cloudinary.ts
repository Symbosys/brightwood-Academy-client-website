import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

// Validate required environment variables
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error("Missing Cloudinary environment variables:", {
        cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
        api_key: !!process.env.CLOUDINARY_API_KEY,
        api_secret: !!process.env.CLOUDINARY_API_SECRET
    });
}


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Single file upload function using base64 (more reliable in some serverless environments)
export const uploadToCloudinary = async (
    fileBuffer: Buffer,
    folder: string,
    fileType: string = 'image'
): Promise<{ public_id: string; secure_url: string }> => {
    try {
        const base64Data = fileBuffer.toString('base64');
        const dataURI = `data:${fileType};base64,${base64Data}`;
        
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: folder,
            resource_type: 'auto'
        });

        if (!result?.secure_url || !result.public_id) {
            throw new Error("Failed to retrieve public_id or URL from Cloudinary response");
        }

        return {
            public_id: result.public_id,
            secure_url: result.secure_url,
        };
    } catch (error: any) {
        console.error("Cloudinary upload error:", error);
        throw new Error(error.message || "Failed to upload image to Cloudinary");
    }
};

// Multi-file upload function
export const uploadMultipleToCloudinary = async (
    fileBuffers: Buffer[],
    folder: string
): Promise<{ public_id: string; secure_url: string }[]> => {
    return Promise.all(fileBuffers.map((buffer) => uploadToCloudinary(buffer, folder)));
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        throw new Error(`Failed to delete image with public_id ${publicId} from Cloudinary`);
    }
};

export const extractPublicId = (url: string): string | null => {
    try {
        const regex = /\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/;
        const match = url.match(regex);
        return (match && match[1]) || null;
    } catch (error) {
        return null;
    }
};
