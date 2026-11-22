"use client";

import { useState, type FormEvent } from "react";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { useDashboardUser } from "@/components/dashboard/user-context";
import { Avatar } from "@/components/ui/avatar";
import { RoleBadge } from "@/components/ui/badges";
import { apiRequest } from "@/lib/api-client";
import { uploadImage } from "@/lib/upload-image";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

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
    try {
      await apiRequest("/api/users/profile", {
        protectedRequest: true,
        method: "PATCH",
        body: JSON.stringify({ name, phone, area, bio, image }),
      });
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update profile");
    }
  }

  return (
    <>
      <PageHeader title="Update Profile" description="Your name and photo update everywhere straight away." />
      <form onSubmit={onSubmit} noValidate className="grid max-w-4xl gap-6 lg:grid-cols-[280px_1fr]">
        <Card className="gap-0 py-0 flex flex-col items-center p-6 text-center">
          <Avatar name={name || user.name} image={image} size="xl" />
          <p className="mt-4 text-lg font-extrabold text-foreground">{name || user.name}</p>
          <div className="mt-2">
            <RoleBadge role={user.role} />
          </div>
          <input id="pf-photo" type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
          <label htmlFor="pf-photo" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-5 cursor-pointer")}>
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
            Change photo
          </label>
          {image && (
            <button type="button" className="mt-2 cursor-pointer text-xs font-semibold text-muted-foreground hover:text-red-600" onClick={() => setImage("")}>
              Remove photo
            </button>
          )}
        </Card>

        <Card className="gap-0 py-0 grid gap-5 p-5 sm:grid-cols-2 sm:p-8">
          <div className="sm:col-span-2">
            <Label htmlFor="pf-name">Full name</Label>
            <Input id="pf-name"  value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!nameError} />
            {nameError && <p className="field-error">{nameError}</p>}
          </div>
          <div>
            <Label htmlFor="pf-email">Email</Label>
            <Input id="pf-email"  value={user.email} readOnly disabled />
          </div>
          <div>
            <Label htmlFor="pf-role">Role</Label>
            <Input id="pf-role" className="capitalize" value={user.role} readOnly disabled />
          </div>
          <div>
            <Label htmlFor="pf-phone">Phone</Label>
            <Input id="pf-phone"  value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+880 1XXX-XXXXXX" inputMode="tel" />
          </div>
          <div>
            <Label htmlFor="pf-area">Area</Label>
            <Input id="pf-area"  value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g. Mirpur, Dhaka" />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="pf-bio">Bio</Label>
            <Textarea id="pf-bio" rows={4} className="resize-y" value={bio} onChange={(e) => setBio(e.target.value)} placeholder={user.role === "technician" ? "Your skills, experience and the devices you repair" : "A short note about you"} />
          </div>
          <div className="flex justify-end border-t border-border pt-5 sm:col-span-2">
            <Button type="submit" disabled={uploading}>
              Save changes
            </Button>
          </div>
        </Card>
      </form>
    </>
  );
}
