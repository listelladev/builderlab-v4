import { FaqEditor } from "@/components/admin/FaqEditor";

export default async function EditPricingFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <FaqEditor faqId={id} page="pricing" />;
}
