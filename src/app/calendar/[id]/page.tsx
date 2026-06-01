import { useParams } from "react-router-dom";
import { Navbar, Footer } from "@/components";
import { RaceDetailSection } from "@/components/race-detail";

export default function RaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;
  return (
    <>
      <Navbar />
      <RaceDetailSection raceId={id} />
      <Footer />
    </>
  );
}
