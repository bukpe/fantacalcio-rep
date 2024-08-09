const express = require('express');
const router = express.Router();
const xlsx = require('xlsx');
const path = require('path')

const filePath = path.join(__dirname, '../../Fanta.xlsx');

router.get('/goalkeepers', (req, res) => {

  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    res.json(data);
  } catch (error) {
    res.status(500).send('Errore nella lettura del file Excel.');
  }
});

router.get('/defenders', (req, res) => {

  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[1];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    res.json(data);
  } catch (error) {
    res.status(500).send('Errore nella lettura del file Excel.');
  }
});

router.get('/midfielders', (req, res) => {

  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[2];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    res.json(data);
  } catch (error) {
    res.status(500).send('Errore nella lettura del file Excel.');
  }
});

router.get('/strikers', (req, res) => {

  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[3];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    res.json(data);
  } catch (error) {
    res.status(500).send('Errore nella lettura del file Excel.');
  }
});

router.get('/team', (req, res) => {

  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[4];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    res.json(data);
  } catch (error) {
    res.status(500).send('Errore nella lettura del file Excel.');
  }
});

router.post('/insertGoalkeepers', (req, res)=>{
    try {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[4];
        const sheet = workbook.Sheets[sheetName];
        const { goalkeepers } = req.body;
        console.log(req.body)

        goalkeepers.forEach((player, index) => {
            const row = 2 + index;

            sheet[`A${row}`] = { t: 's', v: player.name }; 
            sheet[`B${row}`] = { t: 'n', v: player.value };
            sheet[`C${row}`] = { t: 's', v: player.team }; 
        });

        const maxRow = 2 + goalkeepers.length - 1;
        const range = xlsx.utils.decode_range(sheet['!ref']);
        range.e.r = Math.max(range.e.r, maxRow);
        range.e.c = Math.max(range.e.c, 2);
        sheet['!ref'] = xlsx.utils.encode_range(range);

        xlsx.writeFile(workbook, filePath);
        res.status(200).send(workbook);
    } catch(error) {
        res.status(500).send('Errore durante la scrittura nel file Excel.');
    }
})

router.post('/insertDefenders', (req, res)=>{
    try {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[4];
        const sheet = workbook.Sheets[sheetName];
        const { defenders } = req.body;
        console.log(req.body)

        defenders.forEach((player, index) => {
            const row = 5 + index;

            sheet[`A${row}`] = { t: 's', v: player.name }; 
            sheet[`B${row}`] = { t: 'n', v: player.value };
            sheet[`C${row}`] = { t: 's', v: player.team }; 
        });

        const maxRow = 5 + defenders.length - 1;
        const range = xlsx.utils.decode_range(sheet['!ref']);
        range.e.r = Math.max(range.e.r, maxRow);
        range.e.c = Math.max(range.e.c, 2);
        sheet['!ref'] = xlsx.utils.encode_range(range);

        xlsx.writeFile(workbook, filePath);
        res.status(200).send(workbook);
    } catch(error) {
        res.status(500).send('Errore durante la scrittura nel file Excel.');
    }
})

router.post('/insertMidfielders', (req, res)=>{
    try {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[4];
        const sheet = workbook.Sheets[sheetName];
        const { midfielders } = req.body;

        midfielders.forEach((player, index) => {
            const row = 13 + index;

            sheet[`A${row}`] = { t: 's', v: player.name }; 
            sheet[`B${row}`] = { t: 'n', v: player.value };
            sheet[`C${row}`] = { t: 's', v: player.team }; 
        });

        const maxRow = 13 + midfielders.length - 1;
        const range = xlsx.utils.decode_range(sheet['!ref']);
        range.e.r = Math.max(range.e.r, maxRow);
        range.e.c = Math.max(range.e.c, 2);
        sheet['!ref'] = xlsx.utils.encode_range(range);

        xlsx.writeFile(workbook, filePath);
        res.status(200).send(workbook);
    } catch(error) {
        res.status(500).send(error);
    }
})

router.post('/insertStrikers', (req, res) => {
    try {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[4];
        const sheet = workbook.Sheets[sheetName];
        const { strikers } = req.body;
        console.log(strikers)

        strikers.forEach((player, index) => {
            const row = 21 + index;

            sheet[`A${row}`] = { t: 's', v: player.name }; 
            sheet[`B${row}`] = { t: 'n', v: player.value };
            sheet[`C${row}`] = { t: 's', v: player.team }; 
        });
        console.log(strikers)

        const maxRow = 21 + strikers.length - 1;
        const range = xlsx.utils.decode_range(sheet['!ref']);
        range.e.r = Math.max(range.e.r, maxRow);
        range.e.c = Math.max(range.e.c, 2);
        sheet['!ref'] = xlsx.utils.encode_range(range);

        xlsx.writeFile(workbook, filePath);
        res.status(200).send('Attaccanti inseriti correttamente.');
    } catch (error) {
        res.status(500).send('Errore durante la scrittura nel file Excel.');
    }
});

router.delete('/empty', (req, res)=>{
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[4];
    const sheet = workbook.Sheets[sheetName];

    for (let row = 2; row <= 26; row++) {
      for (let col of ['A', 'B', 'C']) {
        const cellAddress = `${col}${row}`;
        if (sheet[cellAddress]) {
          sheet[cellAddress].v = '';
        }
      }
    }

    xlsx.writeFile(workbook, filePath);
    res.status(200).send('Le celle da A2 a C26 sono state svuotate.');
  } catch (error) {
    res.status(500).send('Errore durante la scrittura nel file Excel.');
  }
})

module.exports = router;
