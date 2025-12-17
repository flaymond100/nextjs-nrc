// components
import { Navbar, Footer } from "@/components";
import { RaceDetailSection } from "@/components/race-detail";

// Force dynamic rendering to handle new races created after build
export const dynamic = "force-dynamic";
export const dynamicParams = true;

interface RaceDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RaceDetailPage({ params }: RaceDetailPageProps) {
  const { id: raceId } = await params;

  return (
    <>
      <Navbar />
      <RaceDetailSection raceId={raceId} />
      <Footer />
    </>
  );
}
