import { ServiceDetail } from "@/components/services/service-detail";

export default async function ServiceDetailsPage({ params }: PageProps<"/services/[id]">) {
  const { id } = await params;
  return <ServiceDetail id={id} />;
}
