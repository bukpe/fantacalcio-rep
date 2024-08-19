import { AxiosResponse } from "axios";
import { GoalkeeperPositionEnum, PlayerDTO, RoleEnum, TeamPlayerDTO } from "../types/PlayerTypes";
import AxiosService from "./AxiosService";
import { UsersEnum } from "../types/UserTypes";

const defaultGoalkeeper: TeamPlayerDTO = {
  name: "",
  role: RoleEnum.POR,
  team: undefined,
  value: 1,
};

const mapPlayerDTOToTeamPlayerDTO = (player: PlayerDTO, value: number): TeamPlayerDTO => {
  return {
    name: player.name,
    role: player.role,
    team: player.team,
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

export const PlayerService = {
  defaultGoalkeeper,
  mapPlayerDTOToTeamPlayerDTO,
  getPlayers,
  insertGoalkeeper,
};
