import { SettingsDTO } from "../types/SettingsTypes";
import AxiosService from "./AxiosService";

const getSettings = (): Promise<SettingsDTO> => {
  return AxiosService.get("settings").then((response) => {
    return response.data;
  });
};

export const SettingsService = {
  getSettings,
};
