import express, { Response } from "express";
import xlsx from "xlsx";
import path from "path";
import { ExcelPageEnum } from "../src/types/FileTypes";
import { PlayerDTO, TeamPlayerDTO } from "../src/types/PlayerTypes";
import { SettingsDTO } from "../src/types/SettingsTypes";
import { UsersEnum, UserTeamDTO } from "../src/types/UserTypes";

const filePath = path.join(__dirname, "../../Fanta.xlsx");
const router = express.Router();

router.get("/settings", (req, res: Response<SettingsDTO>) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[ExcelPageEnum.IMPOSTAZIONI];
    const data: any[] = xlsx.utils.sheet_to_json(sheet);

    res.json({
      creds: data[0].creds,
      goalkeepersBudget: data[0].POR,
      defendersBudget: data[0].DIF,
      midfieldersBudget: data[0].CEN,
      strikersBudget: data[0].ATT,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error message: ", error.message);
    } else {
      console.error("Unknown error message");
    }
  }
});

router.get("/players", (req, res: Response<PlayerDTO[]>) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[ExcelPageEnum.GIOCATORI];
    const data: PlayerDTO[] = xlsx.utils.sheet_to_json(sheet);

    res.json(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error message: ", error.message);
    } else {
      console.error("Unknown error message");
    }
  }
});

router.get("/team/:user", (req, res: Response<UserTeamDTO | string>) => {
  try {
    const { params } = req;
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[params.user.toUpperCase()];
    const data: TeamPlayerDTO[] = xlsx.utils.sheet_to_json(sheet);

    res.json({ user: params.user, team: data });
  } catch (error) {
    res.status(500).send("Errore nella lettura del file Excel.");
  }
});

router.post("/insertGoalkeepers/:user", (req, res) => {
  try {
    const { params, body } = req;
    const { player, position } = body;
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[params.user.toUpperCase()];

    // Calcola la riga basata sulla posizione specificata nell'URL
    const row = 2 + parseInt(position, 10);

    // Inserisci i dati del player nel foglio di lavoro
    sheet[`A${row}`] = { t: "s", v: player.name };
    sheet[`B${row}`] = { t: "n", v: player.value };
    sheet[`C${row}`] = { t: "s", v: player.team };

    // Aggiorna l'intervallo del foglio di lavoro
    const range = xlsx.utils.decode_range(sheet["!ref"] || "");
    range.e.r = Math.max(range.e.r, row);
    range.e.c = Math.max(range.e.c, 2);
    sheet["!ref"] = xlsx.utils.encode_range(range);

    // Salva il file Excel
    xlsx.writeFile(workbook, filePath);

    res.status(200).send(sheet);
  } catch (error) {
    res.status(500).send("Errore durante la scrittura nel file Excel.");
  }
});

router.post("/insertDefenders/:user", (req, res) => {
  try {
    const { params, body } = req;
    const { player, position } = body;
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[params.user.toUpperCase()];

    // Calcola la riga basata sulla posizione specificata nell'URL
    const row = 5 + parseInt(position, 10);

    // Inserisci i dati del player nel foglio di lavoro
    sheet[`A${row}`] = { t: "s", v: player.name };
    sheet[`B${row}`] = { t: "n", v: player.value };
    sheet[`C${row}`] = { t: "s", v: player.team };

    // Aggiorna l'intervallo del foglio di lavoro
    const range = xlsx.utils.decode_range(sheet["!ref"] || "");
    range.e.r = Math.max(range.e.r, row);
    range.e.c = Math.max(range.e.c, 2);
    sheet["!ref"] = xlsx.utils.encode_range(range);

    // Salva il file Excel
    xlsx.writeFile(workbook, filePath);

    res.status(200).send(sheet);
  } catch (error) {
    res.status(500).send("Errore durante la scrittura nel file Excel.");
  }
});

router.post("/insertMidfielders/:user", (req, res) => {
  try {
    const { params, body } = req;
    const { player, position } = body;
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[params.user.toUpperCase()];

    // Calcola la riga basata sulla posizione specificata nell'URL
    const row = 13 + parseInt(position, 10);

    // Inserisci i dati del player nel foglio di lavoro
    sheet[`A${row}`] = { t: "s", v: player.name };
    sheet[`B${row}`] = { t: "n", v: player.value };
    sheet[`C${row}`] = { t: "s", v: player.team };

    // Aggiorna l'intervallo del foglio di lavoro
    const range = xlsx.utils.decode_range(sheet["!ref"] || "");
    range.e.r = Math.max(range.e.r, row);
    range.e.c = Math.max(range.e.c, 2);
    sheet["!ref"] = xlsx.utils.encode_range(range);

    // Salva il file Excel
    xlsx.writeFile(workbook, filePath);

    res.status(200).send(sheet);
  } catch (error) {
    res.status(500).send("Errore durante la scrittura nel file Excel.");
  }
});

router.post("/insertStrikers/:user", (req, res) => {
  try {
    const { params, body } = req;
    const { player, position } = body;
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[params.user.toUpperCase()];

    // Calcola la riga basata sulla posizione specificata nell'URL
    const row = 21 + parseInt(position, 10);

    // Inserisci i dati del player nel foglio di lavoro
    sheet[`A${row}`] = { t: "s", v: player.name };
    sheet[`B${row}`] = { t: "n", v: player.value };
    sheet[`C${row}`] = { t: "s", v: player.team };

    // Aggiorna l'intervallo del foglio di lavoro
    const range = xlsx.utils.decode_range(sheet["!ref"] || "");
    range.e.r = Math.max(range.e.r, row);
    range.e.c = Math.max(range.e.c, 2);
    sheet["!ref"] = xlsx.utils.encode_range(range);

    // Salva il file Excel
    xlsx.writeFile(workbook, filePath);

    res.status(200).send(sheet);
  } catch (error) {
    res.status(500).send("Errore durante la scrittura nel file Excel.");
  }
});

router.delete("/empty/:user", (req, res) => {
  try {
    const { params } = req;
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[params.user.toUpperCase()];

    for (let row = 2; row <= 26; row++) {
      for (let col of ["A", "B", "C"]) {
        const cellAddress = `${col}${row}`;
        if (sheet[cellAddress]) {
          sheet[cellAddress].v = "";
        }
      }
    }

    xlsx.writeFile(workbook, filePath);
    res.status(200).send("Le celle da A2 a C26 sono state svuotate.");
  } catch (error) {
    res.status(500).send("Errore durante la scrittura nel file Excel.");
  }
});

export default router;
