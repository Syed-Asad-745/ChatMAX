// app/api/profile/picture/route.ts

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import cloudinary from "@/lib/cloudinary";
import { fileTypeFromBuffer } from "file-type";
import type { UploadApiResponse } from "cloudinary";

const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "You must be logged in first!" }, { status: 401 });
    }

    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json({ error: "Select an Image please" }, { status: 400 });
    }

    if (image.size === 0) {
      return NextResponse.json({ error: "The selected image is empty!" }, { status: 400 });
    }

    if (image.size > MAX_SIZE) {
      return NextResponse.json({ error: "Image must be smaller than 5 MB!" }, { status: 400 });
    }

    const buffer = Buffer.from(await image.arrayBuffer());

    const fileType = await fileTypeFromBuffer(buffer);

    if (!fileType || !["image/jpeg", "image/png", "image/webp"].includes(fileType.mime)) {
      return NextResponse.json({ error: "Only JPEG, PNG and WebP images are allowed!" }, { status: 400 });
    }

    const existingPicture = await pool.query(
      `
      SELECT profile_pic_public_id
      FROM users
      WHERE id = $1`,
      [user.id],
    );

    const oldPublicId = existingPicture.rows[0]?.profile_pic_public_id;

    const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "chatmax/profile-pictures",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve(result);
          else reject(new Error("Cloudinary returned no result"));
        },
      );

      uploadStream.end(buffer);
    });

    try {
      await pool.query(
        `
        UPDATE users
        SET profile_pic_url = $1,
        profile_pic_public_id = $2
        WHERE id = $3`,
        [uploadResult.secure_url, uploadResult.public_id, user.id],
      );
    } catch (error) {
      try {
        await cloudinary.uploader.destroy(uploadResult.public_id);
      } catch (cleanupError) {
        console.error("Failed to clean up uploaded image:", cleanupError);
      }

      throw error;
    }

    if (oldPublicId && oldPublicId !== uploadResult.public_id) {
      try {
        await cloudinary.uploader.destroy(oldPublicId);
      } catch (error) {
        console.error("Failed to delete old profile picture:", error);
      }
    }

    return NextResponse.json(
      {
        success: true,
        profilePicUrl: uploadResult.secure_url,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Profile picture upload error:", error);

    return NextResponse.json({ error: "Something went wrong while uploading your image." }, { status: 500 });
  }
}
