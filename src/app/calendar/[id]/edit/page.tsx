import { useParams } from "react-router-dom";
import EditRacePageClient from "./edit-client";

export default function EditRacePage() {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;
  return <EditRacePageClient raceId={id} />;
}
