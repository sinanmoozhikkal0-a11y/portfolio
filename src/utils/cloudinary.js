import { fetchApi } from "./api";

/**
 * Reusable utility for image uploads to Cloudinary in React + Vite.
 * Supports direct unsigned Cloudinary upload with automatic backend server signed fallback.
 *
 * @param {File} file - The file object selected by the user.
 * @param {Function} [onProgress] - Optional callback function (percent: number) => void.
 * @returns {Promise<{ secure_url: string, public_id: string, width: number, height: number, raw: object }>}
 */
export async function uploadImage(file, onProgress) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "wjkinqcn";
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "ml_default";

  if (!file) {
    throw new Error("No file provided for upload.");
  }

  // Helper for server-side signed Cloudinary upload fallback
  const uploadViaBackend = async () => {
    if (typeof onProgress === "function") {
      onProgress(50);
    }
    const backendFormData = new FormData();
    backendFormData.append("file", file);

    const res = await fetchApi("/media/upload", {
      method: "POST",
      body: backendFormData
    });

    const secureUrl = res.secure_url || (res.data && res.data.url) || (res.data && res.data.secure_url);
    if (!secureUrl) {
      throw new Error(res.message || "Backend upload failed.");
    }

    if (typeof onProgress === "function") {
      onProgress(100);
    }

    return {
      secure_url: secureUrl,
      url: secureUrl,
      public_id: res.public_id || (res.data && res.data.publicId) || "",
      width: 800,
      height: 600,
      format: "jpg",
      raw: res
    };
  };

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const folder = import.meta.env.VITE_CLOUDINARY_FOLDER || "portfolio";
  if (folder) {
    formData.append("folder", folder);
  }

  try {
    return await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);

      if (xhr.upload && typeof onProgress === "function") {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            onProgress(percent);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve({
              secure_url: data.secure_url,
              url: data.url,
              public_id: data.public_id,
              width: data.width,
              height: data.height,
              format: data.format,
              raw: data,
            });
          } catch (err) {
            reject(new Error("Failed to parse response from Cloudinary."));
          }
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            reject(
              new Error(
                errorData?.error?.message || `Cloudinary upload failed with status ${xhr.status}`
              )
            );
          } catch (err) {
            reject(new Error(`Cloudinary upload failed with status ${xhr.status}`));
          }
        }
      };

      xhr.onerror = () => {
        reject(new Error("Network error occurred during Cloudinary upload."));
      };

      xhr.send(formData);
    });
  } catch (err) {
    // If unsigned preset is not whitelisted or fails, fallback to signed backend server upload!
    console.warn("Direct Cloudinary upload failed, attempting signed backend upload fallback...", err.message);
    try {
      return await uploadViaBackend();
    } catch (backendErr) {
      throw new Error(err.message || backendErr.message || "Failed to upload image.");
    }
  }
}
