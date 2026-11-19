import { ServiceCardSkeleton } from "@/components/service-card";

export default function PublicLoading() {
  return (
    <div className="container-page py-16" aria-busy="true" aria-label="Loading page">
      <div className="skeleton h-10 w-64" />
      <div className="skeleton mt-4 h-5 w-full max-w-xl" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <ServiceCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
