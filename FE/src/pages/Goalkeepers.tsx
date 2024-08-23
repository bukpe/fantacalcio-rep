import { useCallback, useEffect, useRef, useState } from "react";
import {
  GoalkeeperPositionEnum,
  PlayerDTO,
  RoleEnum,
  TeamPlayerDTO,
} from "../types/PlayerTypes";
import { PlayerService } from "../services/PlayerService";
import { UsersEnum, UserTeamDTO } from "../types/UserTypes";
import _ from "lodash";
import { SettingsDTO } from "../types/SettingsTypes";

type ComponentProps = {
  allPlayers: PlayerDTO[];
  settings: SettingsDTO;
  myTeam: UserTeamDTO | undefined;
  loadData(): Promise<void>;
};

export const Goalkeepers = ({
  allPlayers,
  settings,
  myTeam,
  loadData,
}: ComponentProps) => {
  const goalkeepersList = useRef<HTMLUListElement>(null);
  const [hide, setHide] = useState<boolean>(true);
  const [list, setList] = useState<PlayerDTO[]>([]);
  const [playerPosition, setPlayerPosition] = useState<GoalkeeperPositionEnum>(
    GoalkeeperPositionEnum.PRIMO
  );
  const [selectedUser, setSelectedUser] = useState<UsersEnum>(UsersEnum.BRIAN);
  const [purchaseValue, setPurchaseValue] = useState<number | undefined>(
    undefined
  );
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerDTO | undefined>(
    undefined
  );
  const [searchedPlayers, setSearchedPlayers] = useState<PlayerDTO[]>([]);
  const [currentBudget, setCurrentBudget] = useState<number>(settings.creds);

  useEffect(() => {
    const index = myTeam?.team.findIndex(
      (player) => player.role === RoleEnum.POR && _.isNil(player.name)
    );
    switch (index) {
      case 1:
        setPlayerPosition(GoalkeeperPositionEnum.SECONDO);
        break;
      case 2:
        setPlayerPosition(GoalkeeperPositionEnum.TERZO);
        break;
    }
  }, [myTeam?.team]);

  useEffect(() => {
    const currentPurchases = myTeam?.team.reduce((prev, curr) => {
      return prev + curr.value;
    }, 0);
    const newBudget = currentBudget - (currentPurchases || 0);
    setCurrentBudget(newBudget);
  }, [currentBudget, myTeam?.team]);

  useEffect(() => {
    const allGoalkeepers = allPlayers.filter(
      (player) => player.role === RoleEnum.POR
    );
    setList(allGoalkeepers);
  }, [allPlayers]);

  const insertGoalkeeper = useCallback(
    (
      player: TeamPlayerDTO,
      user: UsersEnum,
      position: GoalkeeperPositionEnum
    ) => {
      return PlayerService.insertGoalkeeper(player, user, position);
    },
    []
  );

  const buildList = useCallback(
    (list: PlayerDTO[]) => {
      const sortedList = hide
        ? list.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          })
        : list.sort((a, b) => {
            if (a.fvm > b.fvm) return -1;
            if (a.fvm < b.fvm) return 1;
            return 0;
          });
      return sortedList.map((el, i) => {
        return (
          <li
            style={{ display: "flex" }}
            key={i}
            onClick={() => setSelectedPlayer(el)}
          >
            <p>{`${el.name}

          ${hide ? "" : el.slot}

          ${
            hide
              ? ""
              : PlayerService.getDefendersMaxPurchaseValue(
                  el,
                  settings,
                  currentBudget
                )
          }
          
          ${el.team}`}</p>
          </li>
        );
      });
    },
    [currentBudget, hide, settings]
  );

  return (
    <div className="App">
      <button onClick={() => setHide(!hide)}>NASCONDI</button>
      <input
        type="text"
        onChange={(event) => {
          const value = event.target.value;
          const filteredList = list.filter((el) =>
            el.name.toLowerCase().includes(value.toLowerCase())
          );
          setSearchedPlayers(filteredList);
        }}
      />
      {!_.isNil(selectedPlayer) && <div>{selectedPlayer.name}</div>}
      <input
        type="text"
        value={purchaseValue}
        onChange={(event) => {
          setPurchaseValue(
            Number.isNaN(parseInt(event.target.value))
              ? undefined
              : parseInt(event.target.value)
          );
        }}
      />
      <select
        value={GoalkeeperPositionEnum[playerPosition]}
        onChange={(e) =>
          setPlayerPosition(
            GoalkeeperPositionEnum[
              e.target.value as keyof typeof GoalkeeperPositionEnum
            ]
          )
        }
      >
        {Object.keys(GoalkeeperPositionEnum).map((option, i) => {
          if (Number.isNaN(parseInt(option))) {
            return <option key={i}>{option}</option>;
          }
          return null;
        })}
      </select>
      <select
        value={UsersEnum[selectedUser]}
        onChange={(e) =>
          setSelectedUser(UsersEnum[e.target.value as keyof typeof UsersEnum])
        }
      >
        {Object.keys(UsersEnum).map((option, i) => {
          if (Number.isNaN(parseInt(option))) {
            return <option key={i}>{option}</option>;
          }
          return null;
        })}
      </select>
      <button
        disabled={purchaseValue === undefined || selectedPlayer === undefined}
        onClick={() => {
          insertGoalkeeper(
            PlayerService.mapPlayerDTOToTeamPlayerDTO(
              selectedPlayer,
              purchaseValue ?? 1
            ),
            selectedUser,
            playerPosition
          );
          setPurchaseValue(1);
          loadData();
        }}
      >
        ADD
      </button>
      <ul ref={goalkeepersList}>
        {buildList(searchedPlayers.length > 0 ? searchedPlayers : list)}
      </ul>
    </div>
  );
};
