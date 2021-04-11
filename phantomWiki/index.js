"use strict";

const { spawnSync } = require('child_process');
const express = require('express')
const router = express();
const crypto = require('crypto');
const fs = require('fs');
const port = 3379

router.use(express.json());

router.use('/static', express.static(__dirname + "/static"));


router.get("/", (_, res) => {
    res.status(200).sendFile("/index.html", {root: __dirname});
});

router.post("/images", (req, res) => {
    if (req.body.url == undefined) {
        res.status(500).send("Error : you must provide a URL");
    } else {
        const url = req.body.url;
        const fname = crypto.createHash('md5').update(url).digest('hex');
        
        try {
            fs.mkdirSync(fname);
        } catch (err) {
            console.log("erreur: " + err);
            res.status(200).send(JSON.stringify({"url": "/static/" + fname + ".zip", "status": "already exists"}));
            return;
        }
        spawnSync("phantomjs", ["images.js", url, fname]);
        spawnSync("zip", ["-r", "static/" + fname + ".zip", fname]);
        res.status(200).send(JSON.stringify({"url": "/static/" + fname + ".zip"}));        
    }
});

router.listen(port, () => {
    console.log("Application running on http://localhost:" + port)
});