// server.js
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors'); // Importa il pacchetto cors
const app = express();
const port = 3000;

// Middleware per il parsing del corpo delle richieste in formato JSON
app.use(express.json());

// Importa le rotte dall'altro file
app.use(morgan('dev'))
app.use(cors());
app.use(bodyParser.json())
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Avvia il server
app.listen(port, () => {
  console.log(`Server in esecuzione su http://localhost:${port}`);
});
