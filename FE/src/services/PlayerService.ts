import { AxiosResponse } from "axios";
import { PlayerDTO } from "../types/PlayerTypes";
import AxiosService from "./AxiosService";

const getPlayers = (): Promise<PlayerDTO[]> => {
  return AxiosService.get("/players").then(
    (response: AxiosResponse<PlayerDTO[]>) => {
      return response.data;
    }
  );
};

export const PlayerService = {
  getPlayers,
};
