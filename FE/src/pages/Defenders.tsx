import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DefenderPositionEnum,
  PlayerDTO,
  RoleEnum,
  TeamPlayerDTO,
} from "../types/PlayerTypes";
import { UsersEnum, UserTeamDTO } from "../types/UserTypes";
import { PlayerService } from "../services/PlayerService";
import _ from "lodash";
import { SettingsDTO } from "../types/SettingsTypes";

type ComponentProps = {
  allPlayers: PlayerDTO[];
  settings: SettingsDTO;
  myTeam: UserTeamDTO | undefined;
  loadData(): Promise<void>;
};

export const Defenders = ({
  allPlayers,
  settings,
  myTeam,
  loadData,
}: ComponentProps) => {
  const defendersList = useRef<HTMLUListElement>(null);
  const [hide, setHide] = useState<boolean>(true);
  const [list, setList] = useState<PlayerDTO[]>([]);
  const [playerPosition, setPlayerPosition] = useState<DefenderPositionEnum>(
    DefenderPositionEnum.PRIMO
  );
  const [selectedUser, setSelectedUser] = useState<UsersEnum>(UsersEnum.BRIAN);
  const [purchaseValue, setPurchaseValue] = useState<number | undefined>(
    undefined
  );
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerDTO | undefined>(
    undefined
  );
  const [searchedPlayers, setSearchedPlayers] = useState<PlayerDTO[]>([]);

  const currentDefendersPurchases = useMemo(() => {
    const currentPurchases = myTeam?.team.reduce((prev, curr) => {
      if (!_.isNil(curr.value) && curr.role === RoleEnum.DIF) {
        return prev + curr.value;
      }
      return prev + 0;
    }, 0);
    return currentPurchases;
  }, [myTeam?.team]);

  const currentBudget = useMemo(() => {
    let currentPurchases = myTeam?.team.reduce((prev, curr) => {
      if (!_.isNil(curr.value)) {
        return prev + curr.value;
      }
      return prev + 0;
    }, 0);
    if (_.isNaN(currentPurchases)) {
      currentPurchases = 0;
    }
    const newBudget = settings.creds - (currentPurchases ?? 0);
    return newBudget;
  }, [myTeam?.team, settings.creds]);

  useEffect(() => {
    const index = myTeam?.team.findIndex(
      (player) => player.role === RoleEnum.DIF && _.isNil(player.name)
    );
    switch (index) {
      case 4:
        setPlayerPosition(DefenderPositionEnum.SECONDO);
        break;
      case 5:
        setPlayerPosition(DefenderPositionEnum.TERZO);
        break;
      case 6:
        setPlayerPosition(DefenderPositionEnum.QUARTO);
        break;
      case 7:
        setPlayerPosition(DefenderPositionEnum.QUINTO);
        break;
      case 8:
        setPlayerPosition(DefenderPositionEnum.SESTO);
        break;
      case 9:
        setPlayerPosition(DefenderPositionEnum.SETTIMO);
        break;
      case 10:
        setPlayerPosition(DefenderPositionEnum.OTTAVO);
        break;
    }
  }, [myTeam?.team]);

  useEffect(() => {
    const allDefenders = allPlayers.filter(
      (player) => player.role === RoleEnum.DIF
    );
    setList(allDefenders);
  }, [allPlayers]);

  const insertDefender = useCallback(
    (
      player: TeamPlayerDTO,
      user: UsersEnum,
      position: DefenderPositionEnum
    ) => {
      return PlayerService.insertDefender(player, user, position);
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
      <div>{currentBudget}</div>
      <div>
        {(settings.creds * settings.defendersBudget) / 100 -
          (currentDefendersPurchases ?? 0)}
      </div>
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
        value={DefenderPositionEnum[playerPosition]}
        onChange={(e) =>
          setPlayerPosition(
            DefenderPositionEnum[
              e.target.value as keyof typeof DefenderPositionEnum
            ]
          )
        }
      >
        {Object.keys(DefenderPositionEnum).map((option, i) => {
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
          insertDefender(
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
      <ul ref={defendersList}>
        {buildList(searchedPlayers.length > 0 ? searchedPlayers : list)}
      </ul>
    </div>
  );
};
