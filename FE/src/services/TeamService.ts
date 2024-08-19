import { AxiosResponse } from "axios";
import { TeamPlayerDTO } from "../types/PlayerTypes";
import AxiosService from "./AxiosService";
import { UsersEnum } from "../types/UserTypes";

const getTeamByUser = (selectedUser: UsersEnum): Promise<TeamPlayerDTO[]> => {
  const user = selectedUser.toLowerCase();
  return AxiosService.get(`/team/${user.toLowerCase()}`).then((response: AxiosResponse<TeamPlayerDTO[]>) => {
    return response.data;
  });
};

export const TeamService = {
  getTeamByUser,
};
