import { Dimensions } from "react-native";

export const getDimensions = () => {
  return {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  };
};

const teamAbbreviations: { [key: string]: string } = {
  Arsenal: "ARS",
  "Aston Villa": "AVL",
  "AFC Bournemouth": "BOU",
  Brentford: "BRE",
  "Brighton & Hove Albion": "BHA",
  Burnley: "BUR",
  Chelsea: "CHE",
  "Crystal Palace": "CRY",
  Everton: "EVE",
  Fulham: "FUL",
  "Ipswich Town": "IPS",
  "Leeds United": "LEE",
  "Leicester City": "LEI",
  "Liverpool FC": "LIV",
  "Manchester City": "MCI",
  "Manchester United": "MUN",
  "Newcastle United": "NEW",
  "Nottingham Forest": "NFO",
  "Sheffield United": "SHU",
  Southampton: "SOU",
  "Tottenham Hotspur": "TOT",
  "West Ham United": "WHU",
  "Wolverhampton Wanderers": "WOL",
  Sunderland: "SUN",
};

export function getTeamAbbreviation(teamName: string): string {
  return teamAbbreviations[teamName] || teamName;
}

export function timeAgo(epochMillis: number): string {
  const now = Date.now();
  const diff = now - epochMillis;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (seconds < 60) return `${seconds} seconds ago`;
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  return `${days} days ago`;
}
