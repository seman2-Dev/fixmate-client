"use client";

import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/** Focus the element marked data-autofocus (falls back to Radix default). */
function focusMarked(e: Event) {
  const el = (e.currentTarget as HTMLElement | null)?.querySelector<HTMLElement>("[data-autofocus]");
  if (el) {
    e.preventDefault();
    el.focus();
  }
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        onOpenAutoFocus={focusMarked}
        className={cn(size === "sm" && "sm:max-w-md", size === "md" && "sm:max-w-xl", size === "lg" && "sm:max-w-3xl")}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : (
            <DialogDescription className="sr-only">{title}</DialogDescription>
          )}
        </DialogHeader>
        <DialogBody>{children}</DialogBody>
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Keep it",
  tone = "danger",
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "primary";
  loading?: boolean;
}) {
  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent onOpenAutoFocus={focusMarked}>
        <div className="flex gap-4 px-6 pt-6">
          <span
            className={cn(
              "grid size-11 shrink-0 place-items-center rounded-full",
              tone === "danger" ? "bg-red-100 dark:bg-red-500/15 text-red-600" : "bg-brand-100 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300",
            )}
          >
            <AlertTriangle className="size-5" />
          </span>
          <div>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="mt-1.5">{message}</div>
            </AlertDialogDescription>
          </div>
        </div>
        <div className="flex flex-col-reverse gap-2 px-6 py-5 sm:flex-row sm:justify-end">
          <AlertDialogCancel asChild>
            <Button variant="outline" data-autofocus>
              {cancelLabel}
            </Button>
          </AlertDialogCancel>
          <Button variant={tone === "danger" ? "destructive" : "default"} onClick={onConfirm} disabled={loading}>
            {confirmLabel}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
