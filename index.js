const express = require('express');
const fs = require('fs');
const line = require('line-by-line');

const app = express();
const port = 8080;

app.get('/data', (req, res) => {
  const { n, m } = req.query;

  if (!n) {
    return res.status(400).send('Missing required parameter: n');
  }

  const filePath = `./data/${n}.txt`;

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }

  if (m) {
    // Read specific line
    const lr = new line(filePath);

    let currentLine = 1;

    lr.on('line', (lineContent) => {
      if (currentLine == m) {
        lr.close();
        res.send(lineContent);
      }
      currentLine++;
    });

    lr.on('end', () => {
      res.status(404).send('Line not found');
    });
  } else {
    // Read entire file
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    res.send(fileContent);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
     