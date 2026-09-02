import { TestimonialEditor } from "@/components/admin/TestimonialEditor";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TestimonialEditor testimonialId={id} />;
}
