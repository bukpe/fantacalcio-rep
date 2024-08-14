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
  maxValue: number;
  team: TeamEnum;
  role: RoleEnum;
};
