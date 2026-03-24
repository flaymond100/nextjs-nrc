import { RaceType } from "./types";

export interface RaceTypeConfig {
  label: string;
  bgColor: string;
  textColor: string;
}

export const raceTypeConfigs: Record<RaceType, RaceTypeConfig> = {
  road: {
    label: "Road",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
  },
  crit: {
    label: "Criterium",
    bgColor: "bg-red-100",
    textColor: "text-red-800",
  },
  tt: {
    label: "Time Trial",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
  },
  triathlon: {
    label: "Triathlon",
    bgColor: "bg-purple-100",
    textColor: "text-purple-800",
  },
  social: {
    label: "Social",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
  },
};

export function getRaceTypeConfig(type: RaceType): RaceTypeConfig {
  return raceTypeConfigs[type] || raceTypeConfigs.road;
}

export function formatRaceType(type: RaceType | string): string {
  const config = raceTypeConfigs[type as RaceType];
  return config ? config.label : type;
}

export function getRaceTypeBadgeClasses(type: RaceType | string): string {
  const config = raceTypeConfigs[type as RaceType] || raceTypeConfigs.road;
  return `px-2 py-1 rounded-full ${config.bgColor} ${config.textColor} font-semibold text-xs`;
}

export function getNextRaceHeading(dateString: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const raceDate = new Date(dateString);
  raceDate.setHours(0, 0, 0, 0);

  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const diffInDays = Math.round(
    (raceDate.getTime() - today.getTime()) / millisecondsPerDay
  );

  if (diffInDays <= 0) {
    return "Your Race is Today 💪";
  }

  if (diffInDays === 1) {
    return "Your Next Race in 1 Day 🔥";
  }

  return `Your Next Race in ${diffInDays} Days`;
}
