"use client";

import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { useDashboardUser } from "@/components/dashboard/user-context";
import { ServiceForm } from "@/components/technician/service-form";
import { apiRequest } from "@/lib/api-client";
import { Card } from "@/components/ui/card";

export default function AddServicePage() {
  const user = useDashboardUser();
  const router = useRouter();

  return (
    <>
      <PageHeader title="Add a Service" description="List a repair service. It goes live after an admin approves it." />
      <Card className="gap-0 py-0 max-w-4xl p-5 sm:p-8">
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-amber-50 dark:bg-amber-500/15 p-4 text-sm leading-relaxed text-amber-900 dark:text-amber-300">
          <Info className="mt-0.5 size-5 shrink-0" />
          <p>
            New services start as <strong>Pending</strong> and are hidden from the public until approved.
          </p>
        </div>
        <ServiceForm
          tech={user}
          submitLabel="Submit for approval"
          onSubmit={async (values) => {
            // Phase 2: POST /api/services (verifyToken + verifyTechnician)
            try {
              await apiRequest("/api/services", {
                protectedRequest: true,
                method: "POST",
                body: JSON.stringify(values),
              });
              toast.success("Service submitted", { description: "It is waiting for admin approval." });
              router.push("/dashboard/technician/my-services");
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "Could not submit service");
            }
          }}
        />
      </Card>
    </>
  );
}
