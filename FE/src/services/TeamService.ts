import { AxiosResponse } from "axios";
import AxiosService from "./AxiosService";
import { UsersEnum, UserTeamDTO } from "../types/UserTypes";

const getTeamByUser = (selectedUser: UsersEnum): Promise<UserTeamDTO> => {
  const user = selectedUser.toLowerCase();
  return AxiosService.get(`/team/${user.toLowerCase()}`).then(
    (response: AxiosResponse<UserTeamDTO>) => {
      return response.data;
    }
  );
};

export const TeamService = {
  getTeamByUser,
};
