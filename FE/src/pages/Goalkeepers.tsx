import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GoalkeeperPositionEnum, PlayerDTO, RoleEnum, TeamEnum, TeamPlayerDTO } from "../types/PlayerTypes";
import { PlayerService } from "../services/PlayerService";
import { UsersEnum, UserTeamDTO } from "../types/UserTypes";
import _ from "lodash";
import { SettingsDTO } from "../types/SettingsTypes";
import styles from "./goalkeepers.module.scss";

type ComponentProps = {
  allPlayers: PlayerDTO[];
  settings: SettingsDTO;
  teams: UserTeamDTO[];
  soldPlayers: TeamPlayerDTO[];
  loadData(): Promise<void>;
};

export const Goalkeepers = ({ allPlayers, settings, teams, soldPlayers, loadData }: ComponentProps) => {
  const goalkeepersList = useRef<HTMLUListElement>(null);
  const [hide, setHide] = useState<boolean>(true);
  const [list, setList] = useState<PlayerDTO[]>([]);
  const [playerPosition, setPlayerPosition] = useState<GoalkeeperPositionEnum>(GoalkeeperPositionEnum.PRIMO);
  const [selectedUser, setSelectedUser] = useState<UsersEnum>(UsersEnum.BRIAN);
  const [purchaseValue, setPurchaseValue] = useState<number | undefined>(undefined);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerDTO | undefined>(undefined);
  const [searchedPlayers, setSearchedPlayers] = useState<PlayerDTO[]>([]);
  const [searchedName, setSearchedName] = useState<string | undefined>(undefined);
  const [searchedSlot, setSearchedSlot] = useState<number | undefined>(undefined);
  const [searchedTeam, setSearchedTeam] = useState<TeamEnum | undefined>(undefined);

  const goalkeepersBudget = (settings.creds * settings.goalkeepersBudget) / 100;

  const myTeam = useMemo(() => {
    return teams?.find(team => team.user === UsersEnum.BRIAN.toString().toLowerCase())?.team;
  }, [teams]);

  const getIsSold = useCallback(
    (player: PlayerDTO) => {
      return !_.isNil(soldPlayers.find(el => el.name === player.name && el.role === player.role && el.team === player.team));
    },
    [soldPlayers]
  );

  useEffect(() => {
    hide && setSearchedSlot(undefined);
  }, [hide]);

  useEffect(() => {
    let newList = list;
    if (searchedName !== "" && !_.isNil(searchedName)) {
      newList = newList.filter(el => el.name.toLowerCase().includes(searchedName.toLowerCase()));
    }
    if (!_.isNaN(searchedSlot) && !_.isNil(searchedSlot) && searchedSlot < 4 && !hide) {
      newList = newList.filter(el => el.slot === searchedSlot);
    }
    if (!_.isNil(searchedTeam)) {
      newList = newList.filter(el => el.team === searchedTeam);
    }
    setSearchedPlayers(newList);
  }, [hide, list, searchedName, searchedSlot, searchedTeam]);

  useEffect(() => {
    const index = teams
      .find(team => team.user.toLowerCase() === selectedUser.toString().toLowerCase())
      ?.team.findIndex((player, i) => {
        return player.role === RoleEnum.POR && (_.isNil(player.name) || player.name === "");
      });
    switch (index) {
      case 0:
        setPlayerPosition(GoalkeeperPositionEnum.PRIMO);
        break;
      case 1:
        setPlayerPosition(GoalkeeperPositionEnum.SECONDO);
        break;
      case 2:
        setPlayerPosition(GoalkeeperPositionEnum.TERZO);
        break;
    }
  }, [selectedUser, teams]);

  useEffect(() => {
    const allGoalkeepers = allPlayers.filter(player => player.role === RoleEnum.POR);
    setList(allGoalkeepers);
  }, [allPlayers]);

  const currentGoalkeepersPurchases = useMemo(() => {
    const currentPurchases = myTeam?.reduce((prev, curr) => {
      if (!_.isNil(curr.value) && curr.role === RoleEnum.POR) {
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

  const insertGoalkeeper = useCallback((player: TeamPlayerDTO, user: UsersEnum, position: GoalkeeperPositionEnum) => {
    return PlayerService.insertGoalkeeper(player, user, position);
  }, []);

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

          ${hide ? "" : PlayerService.getGoalkeepersMaxPurchaseValue(el, settings, currentBudget)}
          
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
              <div>{goalkeepersBudget - (currentGoalkeepersPurchases ?? 0)}</div>
            </>
          )}
          <button onClick={() => setHide(!hide)}>NASCONDI</button>
          <div>
            <label>CERCA NOME</label>
            <input
              type="text"
              onChange={event => {
                const value = event.target.value;
                setSearchedName(value);
              }}
            />
          </div>
          {!hide && (
            <div>
              <label>CERCA SLOT</label>
              <input
                type="text"
                onChange={event => {
                  const value = event.target.value;
                  setSearchedSlot(_.parseInt(value));
                }}
              />
            </div>
          )}
          <div>
            <label>CERCA SQUADRA</label>
            <select value={searchedTeam} onChange={e => setSearchedTeam(TeamEnum[e.target.value as keyof typeof TeamEnum])}>
              <option>TUTTE</option>
              {Object.keys(TeamEnum).map((option, i) => {
                if (Number.isNaN(parseInt(option))) {
                  return <option key={i}>{option}</option>;
                }
                return null;
              })}
            </select>
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
          <select value={GoalkeeperPositionEnum[playerPosition]} onChange={e => setPlayerPosition(GoalkeeperPositionEnum[e.target.value as keyof typeof GoalkeeperPositionEnum])}>
            {Object.keys(GoalkeeperPositionEnum).map((option, i) => {
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
              insertGoalkeeper(PlayerService.mapPlayerDTOToTeamPlayerDTO(selectedPlayer, purchaseValue ?? 1), selectedUser, playerPosition).then(() => {
                setPurchaseValue(undefined);
                setSelectedPlayer(undefined);
                loadData();
              });
            }}
          >
            ADD
          </button>
        </div>
        <ul ref={goalkeepersList}>{buildList(searchedPlayers.length > 0 ? searchedPlayers : list)}</ul>
      </div>
    );
  }, [
    buildList,
    currentBudget,
    currentGoalkeepersPurchases,
    goalkeepersBudget,
    hide,
    insertGoalkeeper,
    list,
    loadData,
    playerPosition,
    purchaseValue,
    searchedPlayers,
    searchedTeam,
    selectedPlayer,
    selectedUser,
  ]);

  return buildContent();
};
