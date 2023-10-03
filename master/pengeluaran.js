const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const connection = require("../config/db"); // Update the path to your database connection file

// GET all Pengeluaran records
router.get("/", (req, res) => {
    connection.query("SELECT * FROM Pengeluaran", (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: "Server Gagal",
                error: err,
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Data Pengeluaran",
                data: rows,
            });
        }
    });
});

// POST (CREATE) a new Pengeluaran record
router.post("/pengeluaran", [
    // Validation
    body("TanggalPengeluaran").notEmpty(),
    body("ProyekTerkait").notEmpty(),
    body("RincianPengeluaran").notEmpty(),
    body("JumlahPengeluaran").notEmpty(),
    body("PencatatPengeluaran").notEmpty(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array(),
        });
    }

    const data = {
        TanggalPengeluaran: req.body.TanggalPengeluaran,
        ProyekTerkait: req.body.ProyekTerkait,
        RincianPengeluaran: req.body.RincianPengeluaran,
        JumlahPengeluaran: req.body.JumlahPengeluaran,
        PencatatPengeluaran: req.body.PencatatPengeluaran,
    };

    connection.query("INSERT INTO Pengeluaran SET ?", data, (err, result) => {
        if (err) {
            console.error("Kesalahan database:", err);
            return res.status(500).json({
                status: false,
                message: "Coba Lagi Dude.....",
                error: err,
            });
        } else {
            return res.status(201).json({
                status: true,
                message: "Berhasil Menambahkan Data Pengeluaran",
                data: result,
            });
        }
    });
});

// GET a specific Pengeluaran record by ID
router.get("/:id", (req, res) => {
    const id = req.params.id;
    connection.query("SELECT * FROM Pengeluaran WHERE IDPengeluaran = ?", [id], (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: "Server Eror Dude.....",
                error: err,
            });
        }
        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: "Data Pengeluaran Tidak Ditemukan",
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Data Pengeluaran : ",
                data: rows[0],
            });
        }
    });
});

// PATCH (UPDATE) a Pengeluaran record by ID
router.put("/update/:id", [
    // Validation
    body("TanggalPengeluaran").notEmpty(),
    body("ProyekTerkait").notEmpty(),
    body("RincianPengeluaran").notEmpty(),
    body("JumlahPengeluaran").notEmpty(),
    body("PencatatPengeluaran").notEmpty(),
], (req, res) => {
    const id = req.params.id;
    const data = {
        TanggalPengeluaran: req.body.TanggalPengeluaran,
        ProyekTerkait: req.body.ProyekTerkait,
        RincianPengeluaran: req.body.RincianPengeluaran,
        JumlahPengeluaran: req.body.JumlahPengeluaran,
        PencatatPengeluaran: req.body.PencatatPengeluaran,
    };

    connection.query("UPDATE Pengeluaran SET ? WHERE IDPengeluaran = ?", [data, id], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: "Server Eror Dude.....",
                error: err,
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Update Data Pengeluaran Success Dude....",
            });
        }
    });
});

// DELETE a Pengeluaran record by ID
router.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
    connection.query("DELETE FROM Pengeluaran WHERE IDPengeluaran = ?", [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: "Server Eror Dude.....",
                error: err,
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Data Sudah Sukses Dihapus Dude....",
            });
        }
    });
});


module.exports = router;