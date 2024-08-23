import { TeamPlayerDTO } from "./PlayerTypes";

export enum UsersEnum {
  BRIAN = "BRIAN",
  SIMO = "SIMO",
  PIER = "PIER",
  MICHE = "MICHE",
  MICHI = "MICHI",
  LAZZA = "LAZZA",
  VAVA = "VAVA",
  PIANTA = "PIANTA",
  SUPER = "SUPER",
  TIZI = "TIZI",
}

export type UserTeamDTO = {
  user: string;
  team: TeamPlayerDTO[];
};
