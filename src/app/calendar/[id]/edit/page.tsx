import EditRacePageClient from "./edit-client";

// Force dynamic rendering to handle new races created after build
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

interface EditRacePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditRacePage({ params }: EditRacePageProps) {
  const { id: raceId } = await params;
  return <EditRacePageClient raceId={raceId} />;
}

