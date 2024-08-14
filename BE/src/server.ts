import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import apiRoutes from "./../routes/api";

const app = express();
const port = 3000;

app.use(express.json());

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use("/api", apiRoutes);

app.listen(port, () => {
  console.log(`Server in esecuzione su http://localhost:${port}`);
});
