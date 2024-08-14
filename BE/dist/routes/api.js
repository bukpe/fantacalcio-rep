"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const xlsx_1 = __importDefault(require("xlsx"));
const path_1 = __importDefault(require("path"));
const FileTypes_1 = require("./../types/FileTypes");
const filePath = path_1.default.join(__dirname, "../../Fanta.xlsx");
const router = express_1.default.Router();
router.get("/users", (req, res) => {
    try {
        const users = [];
        const workbook = xlsx_1.default.readFile(filePath);
        for (let i = 2; i < 12; i++) {
            users.push(workbook.SheetNames[i]);
        }
        res.json(users);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
router.get("/players", (req, res) => {
    try {
        console.log(req, res, FileTypes_1.ExcelPageEnum.GIOCATORI);
        const workbook = xlsx_1.default.readFile(filePath);
        const sheet = workbook.Sheets[FileTypes_1.ExcelPageEnum.GIOCATORI];
        const data = xlsx_1.default.utils.sheet_to_json(sheet);
        res.json(data);
    }
    catch (error) {
        res.status(500).send("Errore nella lettura del file Excel.");
    }
});
router.get("/team/:user", (req, res) => {
    try {
        const { user } = req.body;
        const workbook = xlsx_1.default.readFile(filePath);
        const sheet = workbook.Sheets[user];
        const data = xlsx_1.default.utils.sheet_to_json(sheet);
        res.json(data);
    }
    catch (error) {
        res.status(500).send("Errore nella lettura del file Excel.");
    }
});
router.post("/insertGoalkeepers", (req, res) => {
    try {
        const workbook = xlsx_1.default.readFile(filePath);
        const sheetName = workbook.SheetNames[4];
        const sheet = workbook.Sheets[sheetName];
        const { goalkeepers } = req.body;
        goalkeepers.forEach((player, index) => {
            const row = 2 + index;
            sheet[`A${row}`] = { t: "s", v: player.name };
            sheet[`B${row}`] = { t: "n", v: player.value };
            sheet[`C${row}`] = { t: "s", v: player.team };
        });
        const maxRow = 2 + goalkeepers.length - 1;
        const range = xlsx_1.default.utils.decode_range(sheet["!ref"] || "");
        range.e.r = Math.max(range.e.r, maxRow);
        range.e.c = Math.max(range.e.c, 2);
        sheet["!ref"] = xlsx_1.default.utils.encode_range(range);
        xlsx_1.default.writeFile(workbook, filePath);
        res.status(200).send(workbook);
    }
    catch (error) {
        res.status(500).send("Errore durante la scrittura nel file Excel.");
    }
});
router.post("/insertDefenders", (req, res) => {
    try {
        const workbook = xlsx_1.default.readFile(filePath);
        const sheetName = workbook.SheetNames[4];
        const sheet = workbook.Sheets[sheetName];
        const { defenders } = req.body;
        console.log(req.body);
        defenders.forEach((player, index) => {
            const row = 5 + index;
            sheet[`A${row}`] = { t: "s", v: player.name };
            sheet[`B${row}`] = { t: "n", v: player.value };
            sheet[`C${row}`] = { t: "s", v: player.team };
        });
        const maxRow = 5 + defenders.length - 1;
        const range = xlsx_1.default.utils.decode_range(sheet["!ref"] || "");
        range.e.r = Math.max(range.e.r, maxRow);
        range.e.c = Math.max(range.e.c, 2);
        sheet["!ref"] = xlsx_1.default.utils.encode_range(range);
        xlsx_1.default.writeFile(workbook, filePath);
        res.status(200).send(workbook);
    }
    catch (error) {
        res.status(500).send("Errore durante la scrittura nel file Excel.");
    }
});
router.post("/insertMidfielders", (req, res) => {
    try {
        const workbook = xlsx_1.default.readFile(filePath);
        const sheetName = workbook.SheetNames[4];
        const sheet = workbook.Sheets[sheetName];
        const { midfielders } = req.body;
        midfielders.forEach((player, index) => {
            const row = 13 + index;
            sheet[`A${row}`] = { t: "s", v: player.name };
            sheet[`B${row}`] = { t: "n", v: player.value };
            sheet[`C${row}`] = { t: "s", v: player.team };
        });
        const maxRow = 13 + midfielders.length - 1;
        const range = xlsx_1.default.utils.decode_range(sheet["!ref"] || "");
        range.e.r = Math.max(range.e.r, maxRow);
        range.e.c = Math.max(range.e.c, 2);
        sheet["!ref"] = xlsx_1.default.utils.encode_range(range);
        xlsx_1.default.writeFile(workbook, filePath);
        res.status(200).send(workbook);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
router.post("/insertStrikers", (req, res) => {
    try {
        const workbook = xlsx_1.default.readFile(filePath);
        const sheetName = workbook.SheetNames[4];
        const sheet = workbook.Sheets[sheetName];
        const { strikers } = req.body;
        strikers.forEach((player, index) => {
            const row = 21 + index;
            sheet[`A${row}`] = { t: "s", v: player.name };
            sheet[`B${row}`] = { t: "n", v: player.value };
            sheet[`C${row}`] = { t: "s", v: player.team };
        });
        const maxRow = 21 + strikers.length - 1;
        const range = xlsx_1.default.utils.decode_range(sheet["!ref"] || "");
        range.e.r = Math.max(range.e.r, maxRow);
        range.e.c = Math.max(range.e.c, 2);
        sheet["!ref"] = xlsx_1.default.utils.encode_range(range);
        xlsx_1.default.writeFile(workbook, filePath);
        res.status(200).send("Attaccanti inseriti correttamente.");
    }
    catch (error) {
        res.status(500).send("Errore durante la scrittura nel file Excel.");
    }
});
router.post("/insertStrikersTo", (req, res) => {
    try {
        const { selectedUser, strikers } = req.body;
        const workbook = xlsx_1.default.readFile(filePath);
        const sheetName = workbook.SheetNames[4];
        const sheet = workbook.Sheets[sheetName];
        strikers.forEach((player, index) => {
            const row = 21 + index;
            sheet[`A${row}`] = { t: "s", v: player.name };
            sheet[`B${row}`] = { t: "n", v: player.value };
            sheet[`C${row}`] = { t: "s", v: player.team };
        });
        const maxRow = 21 + strikers.length - 1;
        const range = xlsx_1.default.utils.decode_range(sheet["!ref"] || "");
        range.e.r = Math.max(range.e.r, maxRow);
        range.e.c = Math.max(range.e.c, 2);
        sheet["!ref"] = xlsx_1.default.utils.encode_range(range);
        xlsx_1.default.writeFile(workbook, filePath);
        res.status(200).send("Attaccanti inseriti correttamente.");
    }
    catch (error) {
        res.status(500).send("Errore durante la scrittura nel file Excel.");
    }
});
router.delete("/empty", (req, res) => {
    try {
        const workbook = xlsx_1.default.readFile(filePath);
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
        xlsx_1.default.writeFile(workbook, filePath);
        res.status(200).send("Le celle da A2 a C26 sono state svuotate.");
    }
    catch (error) {
        res.status(500).send("Errore durante la scrittura nel file Excel.");
    }
});
exports.default = router;
