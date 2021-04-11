#!/usr/bin/env node

const { spawnSync } = require('child_process');
const express = require('express')
const crypto = require('crypto');
const fs = require('fs');
const app = express();
const ejs = require('ejs');


const port = 3_377

app.use(express.json());
app.use('/static', express.static(__dirname + "/static"));


app.get("/", (_, res) => {
    res.status(200).sendFile("/index.html", {root: __dirname});
});


app.post("/performance/", (req, res) => {
    if (req.body.url == undefined) {
        res.status(500).send(JSON.stringify({"error": "you must provide a URL"}));
    }

    const url = req.body.url;
    const fname = crypto.createHash('md5').update(url).digest('hex');
    spawnSync('phantomjs', ['performance.js', url, fname]);


    const data = JSON.parse(fs.readFileSync("static/" + fname + ".json", {encoding:'utf8', flag:'r'}));

    ejs.renderFile("templates/performance.ejs", data)
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(200).send("Erreur: " + err);
        })
});



app.listen(port, () => {
    console.log("Application started at http://127.0.0.1:" + port)
});