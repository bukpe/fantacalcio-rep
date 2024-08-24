import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StrikerPositionEnum, PlayerDTO, RoleEnum, TeamPlayerDTO } from "../types/PlayerTypes";
import { UsersEnum, UserTeamDTO } from "../types/UserTypes";
import { PlayerService } from "../services/PlayerService";
import _ from "lodash";
import { SettingsDTO } from "../types/SettingsTypes";
import styles from "./strikers.module.scss";

type ComponentProps = {
  allPlayers: PlayerDTO[];
  settings: SettingsDTO;
  teams: UserTeamDTO[];
  soldPlayers: TeamPlayerDTO[];
  loadData(): Promise<void>;
};

export const Strikers = ({ allPlayers, settings, teams, soldPlayers, loadData }: ComponentProps) => {
  const strikersList = useRef<HTMLUListElement>(null);
  const [hide, setHide] = useState<boolean>(true);
  const [list, setList] = useState<PlayerDTO[]>([]);
  const [playerPosition, setPlayerPosition] = useState<StrikerPositionEnum>(StrikerPositionEnum.PRIMO);
  const [selectedUser, setSelectedUser] = useState<UsersEnum>(UsersEnum.BRIAN);
  const [purchaseValue, setPurchaseValue] = useState<number | undefined>(undefined);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerDTO | undefined>(undefined);
  const [searchedPlayers, setSearchedPlayers] = useState<PlayerDTO[]>([]);

  const strikersBudget = (settings.creds * settings.strikersBudget) / 100;

  const getIsSold = useCallback(
    (player: PlayerDTO) => {
      return !_.isNil(soldPlayers.find(el => el.name === player.name && el.role === player.role && el.team === player.team));
    },
    [soldPlayers]
  );

  const myTeam = useMemo(() => {
    return teams?.find(team => team.user === UsersEnum.BRIAN.toString().toLowerCase())?.team;
  }, [teams]);

  const deficit = useMemo(() => {
    const goalkeepersPurchases = myTeam?.reduce((prev, curr) => {
      if (!_.isNil(curr.value) && curr.role === RoleEnum.POR) {
        return prev + curr.value;
      }
      return prev + 0;
    }, 0);
    const goalkeepersBudget = (settings.creds * settings.goalkeepersBudget) / 100;
    const defendersPurchases = myTeam?.reduce((prev, curr) => {
      if (!_.isNil(curr.value) && curr.role === RoleEnum.DIF) {
        return prev + curr.value;
      }
      return prev + 0;
    }, 0);
    const defendersBudget = (settings.creds * settings.defendersBudget) / 100;
    const midfieldersPurchases = myTeam?.reduce((prev, curr) => {
      if (!_.isNil(curr.value) && curr.role === RoleEnum.CEN) {
        return prev + curr.value;
      }
      return prev + 0;
    }, 0);
    const midfieldersBudget = (settings.creds * settings.midfieldersBudget) / 100;
    return Math.ceil(goalkeepersBudget - (goalkeepersPurchases ?? 0) + defendersBudget - (defendersPurchases ?? 0) + midfieldersBudget - (midfieldersPurchases ?? 0));
  }, [myTeam, settings.creds, settings.defendersBudget, settings.goalkeepersBudget, settings.midfieldersBudget]);

  const currentStrikersPurchases = useMemo(() => {
    const currentPurchases = myTeam?.reduce((prev, curr) => {
      if (!_.isNil(curr.value) && curr.role === RoleEnum.ATT) {
        return prev + curr.value;
      }
      return prev + 0;
    }, 0);
    return currentPurchases;
  }, [myTeam]);

  const currentBudget = useMemo(() => {
    let currentPurchases = myTeam?.reduce((prev, curr) => {
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
  }, [myTeam, settings.creds]);

  useEffect(() => {
    const allStrikers = allPlayers.filter(player => player.role === RoleEnum.ATT);
    setList(allStrikers);
  }, [allPlayers]);

  const insertStriker = useCallback((player: TeamPlayerDTO, user: UsersEnum, position: StrikerPositionEnum) => {
    return PlayerService.insertStriker(player, user, position);
  }, []);

  useEffect(() => {
    const index = teams
      .find(team => team.user.toLowerCase() === selectedUser.toString().toLowerCase())
      ?.team.findIndex((player, i) => {
        return player.role === RoleEnum.ATT && (_.isNil(player.name) || player.name === "");
      });
    switch (index) {
      case 19:
        setPlayerPosition(StrikerPositionEnum.PRIMO);
        break;
      case 20:
        setPlayerPosition(StrikerPositionEnum.SECONDO);
        break;
      case 21:
        setPlayerPosition(StrikerPositionEnum.TERZO);
        break;
      case 22:
        setPlayerPosition(StrikerPositionEnum.QUARTO);
        break;
      case 23:
        setPlayerPosition(StrikerPositionEnum.QUINTO);
        break;
      case 24:
        setPlayerPosition(StrikerPositionEnum.SESTO);
        break;
    }
  }, [selectedUser, teams]);

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
          <li className={getIsSold(el) ? styles.sold : ""} key={i} onClick={() => setSelectedPlayer(el)}>
            <p>{`${el.name}

          ${hide ? "" : el.slot}

          ${hide ? "" : PlayerService.getStrikersMaxPurchaseValue(el, settings, currentBudget)}
          
          ${el.team}`}</p>
          </li>
        );
      });
    },
    [currentBudget, getIsSold, hide, settings]
  );

  const buildContent = useCallback(() => {
    return (
      <div className="App">
        <div>
          {!hide && (
            <>
              <div>{currentBudget}</div>
              <div>{strikersBudget - (currentStrikersPurchases ?? 0) + deficit}</div>
            </>
          )}
          <button onClick={() => setHide(!hide)}>NASCONDI</button>
          <div>
            <label>CERCA NOME</label>
            <input
              type="text"
              onChange={event => {
                const value = event.target.value;
                const filteredList = list.filter(el => el.name.toLowerCase().includes(value.toLowerCase()));
                setSearchedPlayers(filteredList);
              }}
            />
          </div>
        </div>
        <div>
          {!_.isNil(selectedPlayer) && <div>{selectedPlayer.name}</div>}
          <div>
            <label>INSERISCI VALORE</label>
            <input
              type="text"
              value={purchaseValue ?? ""}
              onChange={event => {
                setPurchaseValue(Number.isNaN(parseInt(event.target.value)) ? undefined : parseInt(event.target.value));
              }}
            />
          </div>
          <select value={StrikerPositionEnum[playerPosition]} onChange={e => setPlayerPosition(StrikerPositionEnum[e.target.value as keyof typeof StrikerPositionEnum])}>
            {Object.keys(StrikerPositionEnum).map((option, i) => {
              if (Number.isNaN(parseInt(option))) {
                return <option key={i}>{option}</option>;
              }
              return null;
            })}
          </select>
          <select value={UsersEnum[selectedUser]} onChange={e => setSelectedUser(UsersEnum[e.target.value as keyof typeof UsersEnum])}>
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
              insertStriker(PlayerService.mapPlayerDTOToTeamPlayerDTO(selectedPlayer, purchaseValue ?? 1), selectedUser, playerPosition).then(() => {
                setPurchaseValue(undefined);
                setSelectedPlayer(undefined);
                loadData();
              });
            }}
          >
            ADD
          </button>
        </div>
        <ul ref={strikersList}>{buildList(searchedPlayers.length > 0 ? searchedPlayers : list)}</ul>
      </div>
    );
  }, [buildList, currentBudget, currentStrikersPurchases, hide, insertStriker, list, loadData, playerPosition, purchaseValue, searchedPlayers, selectedPlayer, selectedUser, strikersBudget, deficit]);

  return buildContent();
};
