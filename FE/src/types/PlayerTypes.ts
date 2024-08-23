export enum TeamEnum {
  MILAN = "MILAN",
  ATALANTA = "ATALANTA",
  BOLOGNA = "BOLOGNA",
  CAGLIARI = "CAGLIARI",
  COMO = "COMO",
  EMPOLI = "EMPOLI",
  FIORENTINA = "FIORENTINA",
  GENOA = "GENOA",
  INTER = "INTER",
  JUVENTUS = "JUVENTUS",
  LAZIO = "LAZIO",
  LECCE = "LECCE",
  MONZA = "MONZA",
  NAPOLI = "NAPOLI",
  PARMA = "PARMA",
  ROMA = "ROMA",
  TORINO = "TORINO",
  UDINESE = "UDINESE",
  VENEZIA = "VENEZIA",
  VERONA = "VERONA",
}

export enum RoleEnum {
  POR = "POR",
  DIF = "DIF",
  CEN = "CEN",
  ATT = "ATT",
}

export type PlayerDTO = {
  name: string;
  fvm: number;
  starting: number;
  slot: number;
  team: TeamEnum;
  role: RoleEnum;
};

export type TeamPlayerDTO = {
  name: string;
  value: number;
  team: TeamEnum | undefined;
  role: RoleEnum;
};

export enum GoalkeeperPositionEnum {
  PRIMO = 0,
  SECONDO = 1,
  TERZO = 2,
}

export enum DefenderPositionEnum {
  PRIMO = 0,
  SECONDO = 1,
  TERZO = 2,
  QUARTO = 3,
  QUINTO = 4,
  SESTO = 5,
  SETTIMO = 6,
  OTTAVO = 7,
}

export enum MidfielderPositionEnum {
  PRIMO = 0,
  SECONDO = 1,
  TERZO = 2,
  QUARTO = 3,
  QUINTO = 4,
  SESTO = 5,
  SETTIMO = 6,
  OTTAVO = 7,
}

export enum StrikerPositionEnum {
  PRIMO = 0,
  SECONDO = 1,
  TERZO = 2,
  QUARTO = 3,
  QUINTO = 4,
  SESTO = 5,
}

export type PlayerPositionEnum =
  | GoalkeeperPositionEnum
  | DefenderPositionEnum
  | MidfielderPositionEnum
  | StrikerPositionEnum;
