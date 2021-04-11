#!/usr/bin/env node

const { spawn, spawnSync } = require('child_process');
const express = require('express')
const crypto = require('crypto');
const app = express();
const port = 3376

app.use(express.json());
app.use('/static', express.static(__dirname + "/static"));


app.get("/", (_, res) => {
    res.status(200).sendFile("/index.html", {root: __dirname});
});


app.post("/screenshot/", (req, res) => {
    if (req.body.url == undefined) {
        res.status(500).send(JSON.stringify({"error": "you must provide a URL"}));
    }

    const url = req.body.url;
    const name = crypto.createHash('md5').update(url).digest('hex');
    const phantom = spawnSync('phantomjs', ['screenshot.js', url, name]);
    
    console.log(phantom);
    
    res.status(200).send(JSON.stringify({"image": "/static/" + name + ".png"}));
});



app.listen(port, () => {
    console.log("Application started at http://127.0.0.1:3376")
});