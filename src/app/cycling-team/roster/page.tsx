"use client";
// components
import { Footer, Navbar } from "@/components";

// sections
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";

export default function RosterPage() {
  return (
    <>
      <Navbar />
      <Roster />
      <Footer />
    </>
  );
}

const Roster = () => {
  const riders = [
    {
      id: 1,
      name: "Jane Doe",
      role: "Sprinter",
      // photoUrl: "/image/riders/jane-doe.jpg",
      bio: "Jane is a fierce competitor who specializes in high-power sprints.",
    },
    {
      id: 2,
      name: "John Smith",
      role: "Climber",
      // photoUrl: "/image/riders/john-smith.jpg",
      bio: "John excels in mountainous terrain and long-distance hill climbs.",
    },
    {
      id: 3,
      name: "John Smith",
      role: "Climber",
      // photoUrl: "/image/riders/john-smith.jpg",
      bio: "John excels in mountainous terrain and long-distance hill climbs.",
    },
    {
      id: 4,
      name: "John Smith",
      role: "Climber",
      // photoUrl: "/image/riders/john-smith.jpg",
      bio: "John excels in mountainous terrain and long-distance hill climbs.",
    },
    {
      id: 5,
      name: "John Smith",
      role: "Climber",
      // photoUrl: "/image/riders/john-smith.jpg",
      bio: "John excels in mountainous terrain and long-distance hill climbs.",
    },
    // ... more riders
  ];
  return (
    <section className="container mx-auto py-10 px-6">
      <h1 className="mb-8 text-center text-5xl font-bold">
        NRC Cycling Team Roster
      </h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {riders.map((rider) => (
          <Card key={rider.id} className="shadow-lg">
            {/* CardHeader for Rider Photo */}
            <CardHeader className="h-64 relative">Image</CardHeader>

            {/* CardBody for Rider Info */}
            <CardBody>
              <Typography variant="h5" className="mb-2 font-bold">
                {rider.name}
              </Typography>
              <Typography variant="small" className="text-gray-500 mb-4">
                {rider.role}
              </Typography>
              <Typography className="mb-4">{rider.bio}</Typography>

              {/* Optional Action Buttons */}
              <Button
                variant="filled"
                size="sm"
                className="bg-purple-800 hover:bg-purple-700"
              >
                View Profile
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
};
