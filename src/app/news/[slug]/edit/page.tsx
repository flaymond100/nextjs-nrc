import { useParams } from "react-router-dom";
import EditNewsPageClient from "./edit-client";

export default function EditNewsPage() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return null;
  return <EditNewsPageClient slug={slug} />;
}
