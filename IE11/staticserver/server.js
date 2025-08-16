const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Статические файлы находятся в папке "build"
app.use(express.static(path.join(__dirname, 'build')));

// Если имя файла не будет указано, то будет возвращён файл "index.html"
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
