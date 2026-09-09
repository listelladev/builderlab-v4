import { FaqEditor } from "@/components/admin/FaqEditor";

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <FaqEditor faqId={id} />;
}
