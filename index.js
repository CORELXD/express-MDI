const express = require("express");
const app = express();
const port = 2100;

const bodyPs = require('body-parser');
app.use(bodyPs.urlencoded({ extended: true}));
app.use(bodyPs.json());


const j = require("./master/jadwal"); //Jadwal
const p = require("./master/pekerja"); //Pekerja
const laporan = require("./master/pelaporan"); //pelaporan
const pl = require("./master/pengeluaran"); //pengeluaran
const pr = require("./master/proyek");// Proyek
const sd = require("./master/sumberdaya");//sumberdaya
const tg = require("./master/tugas");//Tugas

app.get("/", (req, res) => {
    res.send("EXPRESS MID PANTANG PULANG!!!🔥");
  });

app.use("/api/j", j);//jadwal
app.use("/api/p", p);//pekerja
app.use("/api/laporan", laporan);//pelaporan
app.use("/api/pl", pl);//pengeluaran
app.use("/api/pr", pr);//proyek
app.use("/api/sd", sd);//sumberdaya
app.use("/api/tg", tg);//tugas

app.listen(port, () =>{
    console.log(`aplikasi berjalan di http://localhost:${port}`)
});