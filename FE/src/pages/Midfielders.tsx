import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MidfielderPositionEnum, PlayerDTO, RoleEnum, TeamPlayerDTO } from "../types/PlayerTypes";
import { UsersEnum, UserTeamDTO } from "../types/UserTypes";
import { PlayerService } from "../services/PlayerService";
import _ from "lodash";
import { SettingsDTO } from "../types/SettingsTypes";
import styles from "./midfielders.module.scss";

type ComponentProps = {
  allPlayers: PlayerDTO[];
  settings: SettingsDTO;
  teams: UserTeamDTO[];
  soldPlayers: TeamPlayerDTO[];
  loadData(): Promise<void>;
};

export const Midfielders = ({ allPlayers, settings, teams, soldPlayers, loadData }: ComponentProps) => {
  const midfieldersList = useRef<HTMLUListElement>(null);
  const [hide, setHide] = useState<boolean>(true);
  const [list, setList] = useState<PlayerDTO[]>([]);
  const [playerPosition, setPlayerPosition] = useState<MidfielderPositionEnum>(MidfielderPositionEnum.PRIMO);
  const [selectedUser, setSelectedUser] = useState<UsersEnum>(UsersEnum.BRIAN);
  const [purchaseValue, setPurchaseValue] = useState<number | undefined>(undefined);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerDTO | undefined>(undefined);
  const [searchedPlayers, setSearchedPlayers] = useState<PlayerDTO[]>([]);

  const midfieldersBudget = (settings.creds * settings.midfieldersBudget) / 100;

  const myTeam = useMemo(() => {
    return teams?.find(team => team.user === UsersEnum.BRIAN.toString().toLowerCase())?.team;
  }, [teams]);

  const getIsSold = useCallback(
    (player: PlayerDTO) => {
      return !_.isNil(soldPlayers.find(el => el.name === player.name && el.role === player.role && el.team === player.team));
    },
    [soldPlayers]
  );

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
    return Math.ceil((goalkeepersBudget - (goalkeepersPurchases ?? 0) + defendersBudget - (defendersPurchases ?? 0)) / 2);
  }, [myTeam, settings.creds, settings.defendersBudget, settings.goalkeepersBudget]);

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

  const currentMidfieldersPurchases = useMemo(() => {
    const currentPurchases = myTeam?.reduce((prev, curr) => {
      if (!_.isNil(curr.value) && curr.role === RoleEnum.CEN) {
        return prev + curr.value;
      }
      return prev + 0;
    }, 0);
    return currentPurchases;
  }, [myTeam]);

  useEffect(() => {
    const index = teams
      .find(team => team.user.toLowerCase() === selectedUser.toString().toLowerCase())
      ?.team.findIndex((player, i) => {
        return player.role === RoleEnum.CEN && (_.isNil(player.name) || player.name === "");
      });
    switch (index) {
      case 11:
        setPlayerPosition(MidfielderPositionEnum.PRIMO);
        break;
      case 12:
        setPlayerPosition(MidfielderPositionEnum.SECONDO);
        break;
      case 13:
        setPlayerPosition(MidfielderPositionEnum.TERZO);
        break;
      case 14:
        setPlayerPosition(MidfielderPositionEnum.QUARTO);
        break;
      case 15:
        setPlayerPosition(MidfielderPositionEnum.QUINTO);
        break;
      case 16:
        setPlayerPosition(MidfielderPositionEnum.SESTO);
        break;
      case 17:
        setPlayerPosition(MidfielderPositionEnum.SETTIMO);
        break;
      case 18:
        setPlayerPosition(MidfielderPositionEnum.OTTAVO);
        break;
    }
  }, [selectedUser, teams]);

  useEffect(() => {
    const allMidfielders = allPlayers.filter(player => player.role === RoleEnum.CEN);
    setList(allMidfielders);
  }, [allPlayers]);

  const insertMidfielder = useCallback((player: TeamPlayerDTO, user: UsersEnum, position: MidfielderPositionEnum) => {
    return PlayerService.insertMidfielder(player, user, position);
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

          ${hide ? "" : PlayerService.getMidfieldersMaxPurchaseValue(el, settings, currentBudget)}
          
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
              <div>{midfieldersBudget - (currentMidfieldersPurchases ?? 0) + deficit}</div>
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
          <select value={MidfielderPositionEnum[playerPosition]} onChange={e => setPlayerPosition(MidfielderPositionEnum[e.target.value as keyof typeof MidfielderPositionEnum])}>
            {Object.keys(MidfielderPositionEnum).map((option, i) => {
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
              insertMidfielder(PlayerService.mapPlayerDTOToTeamPlayerDTO(selectedPlayer, purchaseValue ?? 1), selectedUser, playerPosition).then(() => {
                setPurchaseValue(undefined);
                setSelectedPlayer(undefined);
                loadData();
              });
            }}
          >
            ADD
          </button>
        </div>
        <ul ref={midfieldersList}>{buildList(searchedPlayers.length > 0 ? searchedPlayers : list)}</ul>
      </div>
    );
  }, [
    buildList,
    currentBudget,
    currentMidfieldersPurchases,
    deficit,
    hide,
    insertMidfielder,
    list,
    loadData,
    midfieldersBudget,
    playerPosition,
    purchaseValue,
    searchedPlayers,
    selectedPlayer,
    selectedUser,
  ]);

  return buildContent();
};
