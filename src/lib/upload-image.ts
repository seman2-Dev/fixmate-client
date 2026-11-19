/**
 * Image upload helper.
 * Resizes the chosen file in the browser, then uploads it to ImgBB using
 * NEXT_PUBLIC_IMGBB_API_KEY and returns the hosted URL. Without a key it falls
 * back to a data URL so local UI work keeps functioning.
 */
export const MAX_IMAGE_MB = 5;

function readAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the image"));
    reader.readAsDataURL(blob);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("That file is not a valid image"));
    el.src = src;
  });
}

async function resize(file: File, maxWidth: number): Promise<Blob> {
  const img = await loadImage(await readAsDataUrl(file));
  const scale = Math.min(1, maxWidth / img.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not process the image"))),
      "image/jpeg",
      0.82,
    );
  });
}

export async function uploadImage(file: File, maxWidth = 900): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file");
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) throw new Error(`Image must be under ${MAX_IMAGE_MB}MB`);

  const blob = await resize(file, maxWidth);
  const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!key) return readAsDataUrl(blob);

  const form = new FormData();
  form.append("image", blob, "fixmate.jpg");
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(key)}`, {
    method: "POST",
    body: form,
  });
  const json = (await res.json().catch(() => null)) as
    | { data?: { url?: string }; error?: { message?: string } }
    | null;
  if (!res.ok || !json?.data?.url) {
    throw new Error(json?.error?.message || "Image upload failed");
  }
  return json.data.url;
}
