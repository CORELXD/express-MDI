const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const connection = require("../config/db"); // Update the path to your database connection file

// GET all SumberDaya records
router.get("/", (req, res) => {
    connection.query("SELECT * FROM SumberDaya", (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: "Server Gagal",
                error: err,
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Data SumberDaya",
                data: rows,
            });
        }
    });
});

// POST (CREATE) a new SumberDaya record
router.post("/sumberdaya", [
    // Validation
    body("NamaSumberDaya").notEmpty(),
    body("JenisSumberDaya").notEmpty(),
    body("StokTersedia").notEmpty(),
    body("Pemasok").notEmpty(),
    body("HargaPerUnit").notEmpty(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array(),
        });
    }

    const data = {
        NamaSumberDaya: req.body.NamaSumberDaya,
        JenisSumberDaya: req.body.JenisSumberDaya,
        StokTersedia: req.body.StokTersedia,
        Pemasok: req.body.Pemasok,
        HargaPerUnit: req.body.HargaPerUnit,
    };

    connection.query("INSERT INTO SumberDaya SET ?", data, (err, result) => {
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
                message: "Berhasil Menambahkan Data SumberDaya",
                data: result,
            });
        }
    });
});

// GET a specific SumberDaya record by ID
router.get("/:id", (req, res) => {
    const id = req.params.id;
    connection.query("SELECT * FROM SumberDaya WHERE IDSumberDaya = ?", [id], (err, rows) => {
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
                message: "Data SumberDaya Tidak Ditemukan",
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Data SumberDaya : ",
                data: rows[0],
            });
        }
    });
});

// PATCH (UPDATE) a SumberDaya record by ID
router.put("/update/:id", [
    // Validation
    body("NamaSumberDaya").notEmpty(),
    body("JenisSumberDaya").notEmpty(),
    body("StokTersedia").notEmpty(),
    body("Pemasok").notEmpty(),
    body("HargaPerUnit").notEmpty(),
], (req, res) => {
    const id = req.params.id;
    const data = {
        NamaSumberDaya: req.body.NamaSumberDaya,
        JenisSumberDaya: req.body.JenisSumberDaya,
        StokTersedia: req.body.StokTersedia,
        Pemasok: req.body.Pemasok,
        HargaPerUnit: req.body.HargaPerUnit,
    };

    connection.query("UPDATE SumberDaya SET ? WHERE IDSumberDaya = ?", [data, id], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: "Server Eror Dude.....",
                error: err,
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Update Data SumberDaya Success Dude....",
            });
        }
    });
});

// DELETE a SumberDaya record by ID
router.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
    connection.query("DELETE FROM SumberDaya WHERE IDSumberDaya = ?", [id], (err, result) => {
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