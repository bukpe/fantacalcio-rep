import { UsersEnum, UserTeamDTO } from "../types/UserTypes";
import { PlayerService } from "../services/PlayerService";
import styles from "./team.module.scss";
import _ from "lodash";
import { SettingsDTO } from "../types/SettingsTypes";

type ComponentProps = {
  settings: SettingsDTO;
  teams: UserTeamDTO[];
  loadData(): Promise<void>;
};

export const Team = ({ settings, teams, loadData }: ComponentProps) => {
  return (
    <div className={styles.container}>
      {teams.map((userTeam, j) => {
        const currentPurchases = userTeam.team.reduce((acc, curr) => {
          if (curr.name !== "" && !_.isNil(curr.name)) {
            return acc + curr.value;
          }
          return acc;
        }, 0);
        return (
          <ul key={j}>
            <div>
              <p>{userTeam.user.toUpperCase()}</p>
              <p>{settings.creds - currentPurchases}</p>
            </div>
            {userTeam.team.map((el, i) => {
              return (
                <div key={i} className={styles.player}>
                  <li>
                    <span>{el.role}</span>
                    <span>{el.name ?? ""}</span>
                    <span>{el.value ?? ""}</span>
                    {userTeam.user.toUpperCase() === "BRIAN" && <span>{el.slot ?? ""}</span>}
                  </li>
                  {el.name !== "" && !_.isNil(el.name) && (
                    <button
                      onClick={() => {
                        const userEnumKey = userTeam.user.toUpperCase() as keyof typeof UsersEnum;
                        PlayerService.deletePlayer(UsersEnum[userEnumKey], i + 2).then(() => {
                          loadData();
                        });
                      }}
                    >
                      CANCELLA
                    </button>
                  )}
                </div>
              );
            })}
          </ul>
        );
      })}
    </div>
  );
};
