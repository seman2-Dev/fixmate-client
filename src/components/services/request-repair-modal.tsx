"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import { createBooking } from "@/lib/mock-db";
import type { Service, User } from "@/lib/types";
import { formatUSD, todayISODate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Errors {
  phone?: string;
  address?: string;
  preferredDate?: string;
  problemDescription?: string;
}

export function RequestRepairModal({
  open,
  onClose,
  service,
  user,
}: {
  open: boolean;
  onClose: () => void;
  service: Service;
  user: User;
}) {
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState("");
  const [preferredDate, setPreferredDate] = useState(todayISODate());
  const [problem, setProblem] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);

  function validate(): Errors {
    const e: Errors = {};
    if (!/^[+\d][\d\s-]{6,17}$/.test(phone.trim())) e.phone = "Enter a valid phone number";
    if (address.trim().length < 6) e.address = "Enter the full service or pickup address";
    if (!preferredDate) e.preferredDate = "Choose a preferred date";
    else if (preferredDate < todayISODate()) e.preferredDate = "Date must be today or in the future";
    if (problem.trim().length < 20)
      e.problemDescription = `Describe the problem in at least 20 characters (${problem.trim().length}/20)`;
    return e;
  }

  function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    // Phase 2: POST /api/bookings (verifyToken + verifyCustomer)
    const res = createBooking(user, service._id, {
      customerPhone: phone,
      address,
      preferredDate,
      problemDescription: problem,
    });
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success("Repair request sent!", {
      description: "The technician has been notified.",
    });
    setDone(true);
  }

  function close() {
    onClose();
    // reset after the closing animation frame
    setTimeout(() => {
      setDone(false);
      setAddress("");
      setProblem("");
      setErrors({});
    }, 200);
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title={done ? "Request sent" : "Request a repair"}
      description={done ? undefined : `${service.title} · from ${formatUSD(service.basePrice)}`}
      size="lg"
      footer={
        done ? (
          <>
            <Button variant="outline" type="button" onClick={close}>
              Close
            </Button>
            <Button asChild>
<Link href="/dashboard/customer/bookings">
              Go to My Bookings
            </Link>
</Button>
          </>
        ) : (
          <>
            <Button variant="outline" type="button" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" form="repair-form">
              Send Request
            </Button>
          </>
        )
      }
    >
      {done ? (
        <div className="flex flex-col items-center py-6 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600">
            <CheckCircle2 className="size-9" />
          </span>
          <h3 className="mt-5 text-xl font-extrabold text-foreground">We have your request</h3>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {service.technicianName} will review it shortly. Track every step, and pay only after the job
            is completed, from My Bookings.
          </p>
        </div>
      ) : (
        <form id="repair-form" onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="rr-name">Name</Label>
            <Input id="rr-name"  value={user.name} readOnly disabled />
          </div>
          <div>
            <Label htmlFor="rr-email">Email</Label>
            <Input id="rr-email"  value={user.email} readOnly disabled />
          </div>
          <div>
            <Label htmlFor="rr-phone">Phone</Label>
            <Input
              id="rr-phone"
              
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+880 1XXX-XXXXXX"
              inputMode="tel"
              aria-invalid={!!errors.phone}
            />
            {errors.phone && <p className="field-error">{errors.phone}</p>}
          </div>
          <div>
            <Label htmlFor="rr-date">Preferred date</Label>
            <Input
              id="rr-date"
              type="date"
              
              min={todayISODate()}
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              aria-invalid={!!errors.preferredDate}
            />
            {errors.preferredDate && <p className="field-error">{errors.preferredDate}</p>}
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="rr-address">
              {service.serviceMode === "Home Visit" ? "Service address" : "Pickup address"}
            </Label>
            <Input
              id="rr-address"
              
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House, road, area, city"
              aria-invalid={!!errors.address}
            />
            {errors.address && <p className="field-error">{errors.address}</p>}
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="rr-problem">Problem description</Label>
            <Textarea
              id="rr-problem"
              rows={4}
              className="resize-y"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="What is wrong with the device? When did it start? Any error messages?"
              aria-invalid={!!errors.problemDescription}
            />
            <div className="mt-1.5 flex items-start justify-between gap-3">
              {errors.problemDescription ? (
                <p className="field-error !mt-0">{errors.problemDescription}</p>
              ) : (
                <span className="text-xs text-muted-foreground">Minimum 20 characters</span>
              )}
              <span className="text-xs tabular-nums text-muted-foreground">{problem.trim().length}</span>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}
