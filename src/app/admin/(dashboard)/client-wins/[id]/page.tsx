import { ClientWinEditor } from "@/components/admin/ClientWinEditor";

export default async function EditClientWinPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ClientWinEditor winId={id} />;
}
