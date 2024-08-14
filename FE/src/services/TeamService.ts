import { AxiosResponse } from "axios";
import { PlayerDTO } from "../types/PlayerTypes";
import AxiosService from "./AxiosService";
import { UsersEnum } from "../types/UserTypes";

const getTeamByUser = (selectedUser: UsersEnum): Promise<PlayerDTO[]> => {
  const user = selectedUser.toLowerCase();
  return AxiosService.get(`/team/${user.toLowerCase()}`).then(
    (response: AxiosResponse<PlayerDTO[]>) => {
      return response.data;
    }
  );
};

export const TeamService = {
  getTeamByUser,
};
