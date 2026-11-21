/**
 * Image upload helper.
 * Phase 1: resizes the chosen file in the browser and returns a data URL so previews and
 * the mock database work offline. Phase 2: same signature, uploads to the ImgBB API with
 * NEXT_PUBLIC_IMGBB_API_KEY and returns the hosted URL.
 */
export const MAX_IMAGE_MB = 5;

export async function uploadImage(file: File, maxWidth = 900): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file");
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) throw new Error(`Image must be under ${MAX_IMAGE_MB}MB`);

  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (apiKey) {
    const form = new FormData();
    form.set("image", file);
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      body: form,
    });
    const payload = await response.json() as { data?: { url?: string }; error?: { message?: string } };
    if (!response.ok || !payload.data?.url) {
      throw new Error(payload.error?.message || "Could not upload the image");
    }
    return payload.data.url;
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the image"));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("That file is not a valid image"));
    el.src = dataUrl;
  });

  const scale = Math.min(1, maxWidth / img.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.82);
}
