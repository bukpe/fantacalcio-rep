import express, { Request, Response } from "express";
import xlsx from "xlsx";
import path from "path";
import { ExcelPageEnum } from "../src/types/FileTypes";
import { PlayerDTO, TeamPlayerDTO } from "../src/types/PlayerTypes";

const filePath = path.join(__dirname, "../../Fanta.xlsx");
const router = express.Router();

router.get("/users", (req, res) => {
  try {
    const users: string[] = [];
    const workbook = xlsx.readFile(filePath);
    for (let i = 2; i < 12; i++) {
      users.push(workbook.SheetNames[i]);
    }
    res.json(users);
  } catch (error) {
    res.status(500).send(error);
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

router.get("/team/:user", (req, res) => {
  try {
    const { params } = req;
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[params.user.toUpperCase()];
    const data = xlsx.utils.sheet_to_json(sheet);

    res.json(data);
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

router.post("/insertDefenders", (req, res) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[4];
    const sheet = workbook.Sheets[sheetName];
    const { defenders } = req.body;
    console.log(req.body);

    defenders.forEach((player: any, index: number) => {
      const row = 5 + index;

      sheet[`A${row}`] = { t: "s", v: player.name };
      sheet[`B${row}`] = { t: "n", v: player.value };
      sheet[`C${row}`] = { t: "s", v: player.team };
    });

    const maxRow = 5 + defenders.length - 1;
    const range = xlsx.utils.decode_range(sheet["!ref"] || "");
    range.e.r = Math.max(range.e.r, maxRow);
    range.e.c = Math.max(range.e.c, 2);
    sheet["!ref"] = xlsx.utils.encode_range(range);

    xlsx.writeFile(workbook, filePath);
    res.status(200).send(workbook);
  } catch (error) {
    res.status(500).send("Errore durante la scrittura nel file Excel.");
  }
});

router.post("/insertMidfielders", (req, res) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[4];
    const sheet = workbook.Sheets[sheetName];
    const { midfielders } = req.body;

    midfielders.forEach((player: any, index: number) => {
      const row = 13 + index;

      sheet[`A${row}`] = { t: "s", v: player.name };
      sheet[`B${row}`] = { t: "n", v: player.value };
      sheet[`C${row}`] = { t: "s", v: player.team };
    });

    const maxRow = 13 + midfielders.length - 1;
    const range = xlsx.utils.decode_range(sheet["!ref"] || "");
    range.e.r = Math.max(range.e.r, maxRow);
    range.e.c = Math.max(range.e.c, 2);
    sheet["!ref"] = xlsx.utils.encode_range(range);

    xlsx.writeFile(workbook, filePath);
    res.status(200).send(workbook);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/insertStrikers", (req, res) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[4];
    const sheet = workbook.Sheets[sheetName];
    const { strikers } = req.body;

    strikers.forEach((player: any, index: number) => {
      const row = 21 + index;

      sheet[`A${row}`] = { t: "s", v: player.name };
      sheet[`B${row}`] = { t: "n", v: player.value };
      sheet[`C${row}`] = { t: "s", v: player.team };
    });

    const maxRow = 21 + strikers.length - 1;
    const range = xlsx.utils.decode_range(sheet["!ref"] || "");
    range.e.r = Math.max(range.e.r, maxRow);
    range.e.c = Math.max(range.e.c, 2);
    sheet["!ref"] = xlsx.utils.encode_range(range);

    xlsx.writeFile(workbook, filePath);
    res.status(200).send("Attaccanti inseriti correttamente.");
  } catch (error) {
    res.status(500).send("Errore durante la scrittura nel file Excel.");
  }
});

router.post("/insertStrikersTo", (req, res) => {
  try {
    const { selectedUser, strikers } = req.body;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[4];
    const sheet = workbook.Sheets[sheetName];

    strikers.forEach((player: any, index: number) => {
      const row = 21 + index;

      sheet[`A${row}`] = { t: "s", v: player.name };
      sheet[`B${row}`] = { t: "n", v: player.value };
      sheet[`C${row}`] = { t: "s", v: player.team };
    });

    const maxRow = 21 + strikers.length - 1;
    const range = xlsx.utils.decode_range(sheet["!ref"] || "");
    range.e.r = Math.max(range.e.r, maxRow);
    range.e.c = Math.max(range.e.c, 2);
    sheet["!ref"] = xlsx.utils.encode_range(range);

    xlsx.writeFile(workbook, filePath);
    res.status(200).send("Attaccanti inseriti correttamente.");
  } catch (error) {
    res.status(500).send("Errore durante la scrittura nel file Excel.");
  }
});

router.delete("/empty", (req, res) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[4];
    const sheet = workbook.Sheets[sheetName];

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
