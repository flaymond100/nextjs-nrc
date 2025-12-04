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
    bgColor: "bg-orange-100",
    textColor: "text-orange-800",
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

