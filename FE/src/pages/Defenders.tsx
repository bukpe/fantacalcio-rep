import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DefenderPositionEnum, PlayerDTO, RoleEnum, TeamEnum, TeamPlayerDTO } from "../types/PlayerTypes";
import { UsersEnum, UserTeamDTO } from "../types/UserTypes";
import { PlayerService } from "../services/PlayerService";
import _ from "lodash";
import styles from "./defenders.module.scss";
import { SettingsDTO } from "../types/SettingsTypes";

type ComponentProps = {
  allPlayers: PlayerDTO[];
  settings: SettingsDTO;
  teams: UserTeamDTO[];
  soldPlayers: TeamPlayerDTO[];
  loadData(): Promise<void>;
};

export const Defenders = ({ allPlayers, settings, teams, soldPlayers, loadData }: ComponentProps) => {
  const defendersList = useRef<HTMLUListElement>(null);
  const [hide, setHide] = useState<boolean>(true);
  const [list, setList] = useState<PlayerDTO[]>([]);
  const [playerPosition, setPlayerPosition] = useState<DefenderPositionEnum>(DefenderPositionEnum.PRIMO);
  const [selectedUser, setSelectedUser] = useState<UsersEnum>(UsersEnum.BRIAN);
  const [purchaseValue, setPurchaseValue] = useState<number | undefined>(undefined);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerDTO | undefined>(undefined);
  const [searchedPlayers, setSearchedPlayers] = useState<PlayerDTO[]>([]);
  const [searchedName, setSearchedName] = useState<string | undefined>(undefined);
  const [searchedSlot, setSearchedSlot] = useState<number | undefined>(undefined);
  const [searchedTeam, setSearchedTeam] = useState<TeamEnum | undefined>(undefined);
  const [sameTeamOfPurchased, setSameTeamOfPurchased] = useState<TeamEnum[]>();

  const defendersBudget = (settings.creds * settings.defendersBudget) / 100;

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
    const myDefenders = myTeam?.filter(player => player.role === RoleEnum.DIF);
    const newTeams: TeamEnum[] = [];
    myDefenders?.forEach(defender => {
      if (!_.isNil(defender.team)) {
        newTeams.push(defender.team);
      }
    });
    setSameTeamOfPurchased(newTeams);
  }, [myTeam]);

  useEffect(() => {
    hide && setSearchedSlot(undefined);
  }, [hide]);

  useEffect(() => {
    let newList = list;
    if (searchedName !== "" && !_.isNil(searchedName)) {
      newList = newList.filter(el => el.name.toLowerCase().includes(searchedName.toLowerCase()));
    }
    if (!_.isNaN(searchedSlot) && !_.isNil(searchedSlot) && searchedSlot < 9 && !hide) {
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
        return player.role === RoleEnum.DIF && (_.isNil(player.name) || player.name === "");
      });
    switch (index) {
      case 3:
        setPlayerPosition(DefenderPositionEnum.PRIMO);
        break;
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
  }, [selectedUser, teams]);

  useEffect(() => {
    const allDefenders = allPlayers.filter(player => player.role === RoleEnum.DIF);
    setList(allDefenders);
  }, [allPlayers]);

  const currentDefendersPurchases = useMemo(() => {
    const currentPurchases = myTeam?.reduce((prev, curr) => {
      if (!_.isNil(curr.value) && curr.role === RoleEnum.DIF) {
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

  const deficit = useMemo(() => {
    const goalkeepersPurchases = myTeam?.reduce((prev, curr) => {
      if (!_.isNil(curr.value) && curr.role === RoleEnum.POR) {
        return prev + curr.value;
      }
      return prev + 0;
    }, 0);
    const goalkeepersBudget = (settings.creds * settings.goalkeepersBudget) / 100;
    return Math.ceil((goalkeepersBudget - (goalkeepersPurchases ?? 0)) / 3);
  }, [myTeam, settings.creds, settings.goalkeepersBudget]);

  const insertDefender = useCallback((player: TeamPlayerDTO, user: UsersEnum, position: DefenderPositionEnum) => {
    return PlayerService.insertDefender(player, user, position);
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
          <li className={`${getIsSold(el) ? styles.sold : ""} ${!hide && sameTeamOfPurchased?.includes(el.team) ? styles.inTeam : ""}`} key={i} onClick={() => setSelectedPlayer(el)}>
            <p>{`${el.name}

          ${hide ? "" : el.slot}

          ${hide ? "" : PlayerService.getDefendersMaxPurchaseValue(el, settings, currentBudget)}
          
          ${el.team}`}</p>
          </li>
        );
      });
    },
    [currentBudget, getIsSold, hide, sameTeamOfPurchased, settings]
  );

  const buildContent = useCallback(() => {
    return (
      <div className="App">
        <div>
          {!hide && (
            <>
              <div>{currentBudget}</div>
              <div>{defendersBudget - (currentDefendersPurchases ?? 0) + deficit}</div>
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
          <select value={DefenderPositionEnum[playerPosition]} onChange={e => setPlayerPosition(DefenderPositionEnum[e.target.value as keyof typeof DefenderPositionEnum])}>
            {Object.keys(DefenderPositionEnum).map((option, i) => {
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
              insertDefender(PlayerService.mapPlayerDTOToTeamPlayerDTO(selectedPlayer, purchaseValue ?? 1), selectedUser, playerPosition).then(() => {
                setPurchaseValue(undefined);
                setSelectedPlayer(undefined);
                loadData();
              });
            }}
          >
            ADD
          </button>
        </div>
        <ul ref={defendersList}>{buildList(searchedPlayers.length > 0 ? searchedPlayers : list)}</ul>
      </div>
    );
  }, [
    buildList,
    currentBudget,
    currentDefendersPurchases,
    defendersBudget,
    deficit,
    hide,
    insertDefender,
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
