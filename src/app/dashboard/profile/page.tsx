"use client";

import { useState, type FormEvent } from "react";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { useDashboardUser } from "@/components/dashboard/user-context";
import { Avatar } from "@/components/ui/avatar";
import { RoleBadge } from "@/components/ui/badges";
import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/lib/upload-image";

export default function ProfilePage() {
  const user = useDashboardUser();
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [area, setArea] = useState(user.area);
  const [bio, setBio] = useState(user.bio);
  const [image, setImage] = useState(user.image);
  const [uploading, setUploading] = useState(false);
  const [nameError, setNameError] = useState("");

  async function onFile(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      setImage(await uploadImage(file, 400));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return setNameError("Name must be at least 2 characters");
    setNameError("");
    const { error } = await authClient.updateUser({
      name: name.trim(),
      phone,
      area,
      bio,
      image,
    });
    if (error) {
      toast.error(error.message || "Could not update your profile");
      return;
    }
    authClient.$store.notify("$sessionSignal");
    toast.success("Profile updated");
  }

  return (
    <>
      <PageHeader title="Update Profile" description="Your name and photo update everywhere straight away." />
      <form onSubmit={onSubmit} noValidate className="grid max-w-4xl gap-6 lg:grid-cols-[280px_1fr]">
        <div className="card flex flex-col items-center p-6 text-center">
          <Avatar name={name || user.name} image={image} size="xl" />
          <p className="mt-4 text-lg font-extrabold text-ink-900">{name || user.name}</p>
          <div className="mt-2">
            <RoleBadge role={user.role} />
          </div>
          <input id="pf-photo" type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
          <label htmlFor="pf-photo" className="btn btn-outline btn-sm mt-5 cursor-pointer">
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
            Change photo
          </label>
          {image && (
            <button type="button" className="mt-2 cursor-pointer text-xs font-semibold text-ink-400 hover:text-red-600" onClick={() => setImage("")}>
              Remove photo
            </button>
          )}
        </div>

        <div className="card grid gap-5 p-5 sm:grid-cols-2 sm:p-8">
          <div className="sm:col-span-2">
            <label htmlFor="pf-name" className="field-label">Full name</label>
            <input id="pf-name" className="field" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!nameError} />
            {nameError && <p className="field-error">{nameError}</p>}
          </div>
          <div>
            <label htmlFor="pf-email" className="field-label">Email</label>
            <input id="pf-email" className="field" value={user.email} readOnly disabled />
          </div>
          <div>
            <label htmlFor="pf-role" className="field-label">Role</label>
            <input id="pf-role" className="field capitalize" value={user.role} readOnly disabled />
          </div>
          <div>
            <label htmlFor="pf-phone" className="field-label">Phone</label>
            <input id="pf-phone" className="field" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+880 1XXX-XXXXXX" inputMode="tel" />
          </div>
          <div>
            <label htmlFor="pf-area" className="field-label">Area</label>
            <input id="pf-area" className="field" value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g. Mirpur, Dhaka" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="pf-bio" className="field-label">Bio</label>
            <textarea id="pf-bio" rows={4} className="field resize-y" value={bio} onChange={(e) => setBio(e.target.value)} placeholder={user.role === "technician" ? "Your skills, experience and the devices you repair" : "A short note about you"} />
          </div>
          <div className="flex justify-end border-t border-ink-100 pt-5 sm:col-span-2">
            <button type="submit" disabled={uploading} className="btn btn-primary">
              Save changes
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
