"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const api_1 = __importDefault(require("./../routes/api"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use("/api", api_1.default);
app.listen(port, () => {
    console.log(`Server in esecuzione su http://localhost:${port}`);
});
