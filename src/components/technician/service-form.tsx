"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef, useState, type FormEvent } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { ServiceInput } from "@/lib/mock-db";
import { CATEGORIES, SERVICE_MODES, type Category, type ServiceMode, type User } from "@/lib/types";
import { uploadImage } from "@/lib/upload-image";

interface Errors {
  title?: string;
  category?: string;
  description?: string;
  basePrice?: string;
  estimatedDuration?: string;
  serviceArea?: string;
  image?: string;
}

export function ServiceForm({
  tech,
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  tech: User;
  initial?: ServiceInput;
  submitLabel: string;
  onSubmit: (values: ServiceInput) => void;
  onCancel?: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState<Category | "">(initial?.category ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [basePrice, setBasePrice] = useState(initial ? String(initial.basePrice) : "");
  const [duration, setDuration] = useState(initial?.estimatedDuration ?? "");
  const [mode, setMode] = useState<ServiceMode>(initial?.serviceMode ?? "Home Visit");
  const [area, setArea] = useState(initial?.serviceArea ?? tech.area);
  const [image, setImage] = useState(initial?.image ?? "");
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      setImage(await uploadImage(file));
      setErrors((e) => ({ ...e, image: undefined }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  function submit(ev: FormEvent) {
    ev.preventDefault();
    const e: Errors = {};
    if (title.trim().length < 5) e.title = "Title must be at least 5 characters";
    if (!category) e.category = "Choose a category";
    if (description.trim().length < 30) e.description = "Describe the service in at least 30 characters";
    const price = Number(basePrice);
    if (!basePrice || !Number.isFinite(price) || price <= 0) e.basePrice = "Enter a price greater than 0";
    if (!duration.trim()) e.estimatedDuration = "Estimated duration is required";
    if (!area.trim()) e.serviceArea = "Service area is required";
    if (!image) e.image = "Upload a service image";
    setErrors(e);
    if (Object.keys(e).length) return;

    onSubmit({
      title: title.trim(),
      category: category as Category,
      description: description.trim(),
      image,
      basePrice: Math.round(price * 100) / 100,
      estimatedDuration: duration.trim(),
      serviceMode: mode,
      serviceArea: area.trim(),
    });
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label htmlFor="sf-title" className="field-label">Service title</label>
        <input id="sf-title" className="field" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. iPhone Screen Replacement" aria-invalid={!!errors.title} />
        {errors.title && <p className="field-error">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="sf-category" className="field-label">Category</label>
        <select id="sf-category" className="field cursor-pointer" value={category} onChange={(e) => setCategory(e.target.value as Category)} aria-invalid={!!errors.category}>
          <option value="">Select a category</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        {errors.category && <p className="field-error">{errors.category}</p>}
      </div>

      <div>
        <label htmlFor="sf-price" className="field-label">Base price (USD)</label>
        <input id="sf-price" type="number" min="0" step="0.01" inputMode="decimal" className="field" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} placeholder="e.g. 45" aria-invalid={!!errors.basePrice} />
        {errors.basePrice && <p className="field-error">{errors.basePrice}</p>}
      </div>

      <div>
        <label htmlFor="sf-duration" className="field-label">Estimated duration</label>
        <input id="sf-duration" className="field" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 2-3 hours" aria-invalid={!!errors.estimatedDuration} />
        {errors.estimatedDuration && <p className="field-error">{errors.estimatedDuration}</p>}
      </div>

      <div>
        <label htmlFor="sf-mode" className="field-label">Service mode</label>
        <select id="sf-mode" className="field cursor-pointer" value={mode} onChange={(e) => setMode(e.target.value as ServiceMode)}>
          {SERVICE_MODES.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="sf-area" className="field-label">Service area</label>
        <input id="sf-area" className="field" value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g. Dhanmondi, Dhaka" aria-invalid={!!errors.serviceArea} />
        {errors.serviceArea && <p className="field-error">{errors.serviceArea}</p>}
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="sf-desc" className="field-label">Description</label>
        <textarea id="sf-desc" rows={5} className="field resize-y" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What does the service include? Which devices and brands? Any warranty?" aria-invalid={!!errors.description} />
        {errors.description && <p className="field-error">{errors.description}</p>}
      </div>

      <div className="grid gap-5 sm:col-span-2 sm:grid-cols-2">
        <div>
          <label htmlFor="sf-tname" className="field-label">Technician name</label>
          <input id="sf-tname" className="field" value={tech.name} readOnly disabled />
        </div>
        <div>
          <label htmlFor="sf-temail" className="field-label">Technician email</label>
          <input id="sf-temail" className="field" value={tech.email} readOnly disabled />
        </div>
      </div>

      <div className="sm:col-span-2">
        <span className="field-label">Service image</span>
        <input ref={fileRef} id="sf-image" type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="grid aspect-[16/10] w-full max-w-[240px] shrink-0 place-items-center overflow-hidden rounded-2xl border-2 border-dashed border-ink-200 bg-ink-50">
            {image ? <img src={image} alt="Service preview" className="size-full object-cover" /> : <ImagePlus className="size-8 text-ink-300" />}
          </div>
          <div>
            <label htmlFor="sf-image" className="btn btn-outline cursor-pointer">
              {uploading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
              {image ? "Replace image" : "Upload image"}
            </label>
            <p className="mt-2 text-xs text-ink-400">JPG, PNG or WebP up to 5MB. Landscape works best.</p>
          </div>
        </div>
        {errors.image && <p className="field-error">{errors.image}</p>}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-ink-100 pt-5 sm:col-span-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" disabled={uploading} className="btn btn-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
