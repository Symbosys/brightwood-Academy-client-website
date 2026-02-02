import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

// Validate required environment variables
// if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
//     throw new Error("Missing required Cloudinary environment variables: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET");
// }


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Single file upload function
export const uploadToCloudinary = (
    fileBuffer: Buffer,
    folder: string
): Promise<{ public_id: string; secure_url: string }> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) {
                    return reject(
                        new Error("Failed to upload image to Cloudinary: " + error.message)
                    );
                }
                if (!result?.secure_url || !result.public_id) {
                    return reject(
                        new Error(
                            "Failed to retrieve public_id or URL from Cloudinary response"
                        )
                    );
                }
                resolve({
                    public_id: result.public_id,
                    secure_url: result.secure_url,
                });
            }
        );

        const stream = Readable.from(fileBuffer);
        stream.pipe(uploadStream);
    });
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
