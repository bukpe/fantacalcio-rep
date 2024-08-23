import { AxiosResponse } from "axios";
import {
  DefenderPositionEnum,
  GoalkeeperPositionEnum,
  MidfielderPositionEnum,
  PlayerDTO,
  RoleEnum,
  StrikerPositionEnum,
  TeamPlayerDTO,
} from "../types/PlayerTypes";
import AxiosService from "./AxiosService";
import { UsersEnum } from "../types/UserTypes";
import { SettingsDTO } from "../types/SettingsTypes";

const defendersBudget = {
  primo: 35,
  secondo: 25,
  terzo: 20,
  quarto: 8,
  quinto: 5,
  sesto: 3,
  settimo: 2,
  ottavo: 2,
};

const midfieldersBudget = {
  primo: 35,
  secondo: 25,
  terzo: 20,
  quarto: 8,
  quinto: 5,
  sesto: 3,
  settimo: 2,
  ottavo: 2,
};

const strikersBudget = {
  primo: 60,
  secondo: 20,
  terzo: 10,
  quarto: 5,
  quinto: 3,
  sesto: 2,
};

const getDefendersMaxPurchaseValue = (
  player: PlayerDTO,
  settings: SettingsDTO,
  budget: number
): number => {
  switch (player.slot) {
    case 1:
      return Math.ceil(
        budget *
          (settings.defendersBudget / 100) *
          (defendersBudget.primo / 100)
      );
    case 2:
      return Math.ceil(
        budget *
          (settings.defendersBudget / 100) *
          (defendersBudget.secondo / 100)
      );
    case 3:
      return Math.ceil(
        budget *
          (settings.defendersBudget / 100) *
          (defendersBudget.terzo / 100)
      );
    case 4:
      return Math.ceil(
        budget *
          (settings.defendersBudget / 100) *
          (defendersBudget.quarto / 100)
      );
    case 5:
      return Math.ceil(
        budget *
          (settings.defendersBudget / 100) *
          (defendersBudget.quinto / 100)
      );
    case 6:
      return Math.ceil(
        budget *
          (settings.defendersBudget / 100) *
          (defendersBudget.sesto / 100)
      );
    case 7:
      return Math.ceil(
        budget *
          (settings.defendersBudget / 100) *
          (defendersBudget.settimo / 100)
      );
    case 8:
      return Math.ceil(
        budget *
          (settings.defendersBudget / 100) *
          (defendersBudget.ottavo / 100)
      );
    default:
      return 0;
  }
};

const getMidfieldersMaxPurchaseValue = (
  player: PlayerDTO,
  settings: SettingsDTO,
  budget: number
): number => {
  switch (player.slot) {
    case 1:
      return Math.ceil(
        budget *
          (settings.midfieldersBudget / 100) *
          (midfieldersBudget.primo / 100)
      );
    case 2:
      return Math.ceil(
        budget *
          (settings.midfieldersBudget / 100) *
          (midfieldersBudget.secondo / 100)
      );
    case 3:
      return Math.ceil(
        budget *
          (settings.midfieldersBudget / 100) *
          (midfieldersBudget.terzo / 100)
      );
    case 4:
      return Math.ceil(
        budget *
          (settings.midfieldersBudget / 100) *
          (midfieldersBudget.quarto / 100)
      );
    case 5:
      return Math.ceil(
        budget *
          (settings.midfieldersBudget / 100) *
          (midfieldersBudget.quinto / 100)
      );
    case 6:
      return Math.ceil(
        budget *
          (settings.midfieldersBudget / 100) *
          (midfieldersBudget.sesto / 100)
      );
    case 7:
      return Math.ceil(
        budget *
          (settings.midfieldersBudget / 100) *
          (midfieldersBudget.settimo / 100)
      );
    case 8:
      return Math.ceil(
        budget *
          (settings.midfieldersBudget / 100) *
          (midfieldersBudget.ottavo / 100)
      );
    default:
      return 0;
  }
};

const getStrikersMaxPurchaseValue = (
  player: PlayerDTO,
  settings: SettingsDTO,
  budget: number
): number => {
  switch (player.slot) {
    case 1:
      return Math.ceil(
        budget * (settings.strikersBudget / 100) * (strikersBudget.primo / 100)
      );
    case 2:
      return Math.ceil(
        budget *
          (settings.strikersBudget / 100) *
          (strikersBudget.secondo / 100)
      );
    case 3:
      return Math.ceil(
        budget * (settings.strikersBudget / 100) * (strikersBudget.terzo / 100)
      );
    case 4:
      return Math.ceil(
        budget * (settings.strikersBudget / 100) * (strikersBudget.quarto / 100)
      );
    case 5:
      return Math.ceil(
        budget * (settings.strikersBudget / 100) * (strikersBudget.quinto / 100)
      );
    case 6:
      return Math.ceil(
        budget * (settings.strikersBudget / 100) * (strikersBudget.sesto / 100)
      );
    default:
      return 0;
  }
};

const mapPlayerDTOToTeamPlayerDTO = (
  player: PlayerDTO | undefined,
  value: number
): TeamPlayerDTO => {
  return {
    name: player?.name ?? "",
    role: player?.role ?? RoleEnum.POR,
    team: player?.team,
    value,
  };
};

const getPlayers = (): Promise<PlayerDTO[]> => {
  return AxiosService.get("/players").then(
    (response: AxiosResponse<PlayerDTO[]>) => {
      return response.data;
    }
  );
};

const insertGoalkeeper = (
  player: TeamPlayerDTO,
  user: UsersEnum,
  position: GoalkeeperPositionEnum
) => {
  return AxiosService.post(`/insertGoalkeepers/${user}`, { player, position });
};

const insertDefender = (
  player: TeamPlayerDTO,
  user: UsersEnum,
  position: DefenderPositionEnum
) => {
  return AxiosService.post(`/insertDefenders/${user}`, { player, position });
};

const insertMidfielder = (
  player: TeamPlayerDTO,
  user: UsersEnum,
  position: MidfielderPositionEnum
) => {
  return AxiosService.post(`/insertMidfielders/${user}`, { player, position });
};

const insertStriker = (
  player: TeamPlayerDTO,
  user: UsersEnum,
  position: StrikerPositionEnum
) => {
  return AxiosService.post(`/insertStrikers/${user}`, { player, position });
};

export const PlayerService = {
  defendersBudget,
  getDefendersMaxPurchaseValue,
  getMidfieldersMaxPurchaseValue,
  getStrikersMaxPurchaseValue,
  getPlayers,
  mapPlayerDTOToTeamPlayerDTO,
  insertGoalkeeper,
  insertDefender,
  insertMidfielder,
  insertStriker,
};
