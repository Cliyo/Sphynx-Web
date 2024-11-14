const multicast = require('./assets/js/utils/testeConexao.js');
const express = require('express');
const path = require('path');
var cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/pages', express.static(path.join(__dirname, 'pages')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/multicast', cors({"Access-Control-Allow-Origin": "*"}), async function (req, res) {
    multicast(req, res);
});                                      

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
