const express = require('express');
const path = require('path');
const {port, host} = require('./config.json');
const fetch = (...args) =>
    import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'main_ejs'));
app.use(express.static('public'));

const routers = require('./routers/main.js')
app.use(routers)

app.listen(port, host, () => console.log(`${host}:${port} kuuntelee...`));