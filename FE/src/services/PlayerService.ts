import { AxiosResponse } from "axios";
import { DefenderPositionEnum, GoalkeeperPositionEnum, MidfielderPositionEnum, PlayerDTO, RoleEnum, StrikerPositionEnum, TeamPlayerDTO } from "../types/PlayerTypes";
import AxiosService from "./AxiosService";
import { UsersEnum } from "../types/UserTypes";

const mapPlayerDTOToTeamPlayerDTO = (player: PlayerDTO | undefined, value: number): TeamPlayerDTO => {
  return {
    name: player?.name ?? "",
    role: player?.role ?? RoleEnum.POR,
    team: player?.team,
    value,
  };
};

const getPlayers = (): Promise<PlayerDTO[]> => {
  return AxiosService.get("/players").then((response: AxiosResponse<PlayerDTO[]>) => {
    return response.data;
  });
};

const insertGoalkeeper = (player: TeamPlayerDTO, user: UsersEnum, position: GoalkeeperPositionEnum) => {
  return AxiosService.post(`/insertGoalkeepers/${user}`, { player, position });
};

const insertDefender = (player: TeamPlayerDTO, user: UsersEnum, position: DefenderPositionEnum) => {
  return AxiosService.post(`/insertDefenders/${user}`, { player, position });
};

const insertMidfielder = (player: TeamPlayerDTO, user: UsersEnum, position: MidfielderPositionEnum) => {
  return AxiosService.post(`/insertMidfielders/${user}`, { player, position });
};

const insertStriker = (player: TeamPlayerDTO, user: UsersEnum, position: StrikerPositionEnum) => {
  return AxiosService.post(`/insertStrikers/${user}`, { player, position });
};

export const PlayerService = {
  mapPlayerDTOToTeamPlayerDTO,
  getPlayers,
  insertGoalkeeper,
  insertDefender,
  insertMidfielder,
  insertStriker,
};
