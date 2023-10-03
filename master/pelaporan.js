const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const connection = require("../config/db"); // Update the path to your database connection file

// GET all Pelaporan records with related ProyekDilaporkan data
router.get("/", (req, res) => {
    connection.query(
        "SELECT pelaporan.*, proyek.NamaProyek AS ProyekDilaporkan " +
        "FROM Pelaporan pelaporan " +
        "LEFT JOIN Proyek proyek ON pelaporan.ProyekDilaporkan = proyek.IDProyek",
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: "Server Gagal",
                    error: err,
                });
            } else {
                return res.status(200).json({
                    status: true,
                    message: "Data Pelaporan",
                    data: rows,
                });
            }
        }
    );
});

// POST (STORE) a new Pelaporan record
router.post("/pelaporan", [
    // Validation
    body("TanggalLaporan").notEmpty(),
    body("ProyekDilaporkan").notEmpty(),
    body("JenisLaporan").notEmpty(),
    body("DeskripsiLaporan").notEmpty(),
    body("FileLampiran").notEmpty(),
    body("PencatatLaporan").notEmpty(),
],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array(),
            });
        }
        const data = {
            TanggalLaporan: req.body.TanggalLaporan,
            ProyekDilaporkan: req.body.ProyekDilaporkan,
            JenisLaporan: req.body.JenisLaporan,
            DeskripsiLaporan: req.body.DeskripsiLaporan,
            FileLampiran: req.body.FileLampiran,
            PencatatLaporan: req.body.PencatatLaporan,
        };

        connection.query("INSERT INTO Pelaporan SET ?", data, (err, rows) => {
            if (err) {
                console.error("Kesalahan database:", err);
                return res.status(500).json({
                    status: false,
                    message: "Coba Lagi Dude.....",
                    error: err
                });
            } else {
                return res.status(201).json({
                    status: true,
                    message: "Berhasil Menambahkan Data Pelaporan",
                    data: rows
                });
            }
        });
    }
);

// GET a specific Pelaporan record by ID
router.get("/:id", (req, res) => {
    const id = req.params.id;
    connection.query(
        "SELECT pelaporan.*, proyek.NamaProyek AS ProyekDilaporkan " +
        "FROM Pelaporan pelaporan " +
        "LEFT JOIN Proyek proyek ON pelaporan.ProyekDilaporkan = proyek.IDProyek " +
        "WHERE pelaporan.IDPelaporan = ?",
        [id],
        (error, rows) => {
            if (error) {
                return res.status(500).json({
                    status: false,
                    message: "Server Eror Dude.....",
                    error: error,
                });
            }
            if (rows.length <= 0) {
                return res.status(404).json({
                    status: false,
                    message: "Not Found, Coba Lagi Dude.....",
                });
            } else {
                return res.status(200).json({
                    status: true,
                    message: "Data Pelaporan : ",
                    data: rows[0],
                });
            }
        }
    );
});

// PATCH (UPDATE) Pelaporan record by ID
router.put("/update/:id",
    [
        // Validation
        body("TanggalLaporan").notEmpty(),
        body("ProyekDilaporkan").notEmpty(),
        body("JenisLaporan").notEmpty(),
        body("DeskripsiLaporan").notEmpty(),
        body("FileLampiran").notEmpty(),
        body("PencatatLaporan").notEmpty(),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array(),
            });
        }

        const id = req.params.id;
        const data = {
            TanggalLaporan: req.body.TanggalLaporan,
            ProyekDilaporkan: req.body.ProyekDilaporkan,
            JenisLaporan: req.body.JenisLaporan,
            DeskripsiLaporan: req.body.DeskripsiLaporan,
            FileLampiran: req.body.FileLampiran,
            PencatatLaporan: req.body.PencatatLaporan,
        };

        connection.query(
            "UPDATE Pelaporan SET ? WHERE IDPelaporan = ?",
            [data, id],
            (error, rows) => {
                if (error) {
                    return res.status(500).json({
                        status: false,
                        message: "Server Eror Dude.....",
                        error: error,
                    });
                } else {
                    return res.status(200).json({
                        status: true,
                        message: "Update Data Success Dude....",
                    });
                }
            }
        );
    }
);

// DELETE a Pelaporan record by ID
router.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
    connection.query(
        "DELETE FROM Pelaporan WHERE IDPelaporan = ?",
        [id],
        (error, result) => {
            if (error) {
                return res.status(500).json({
                    status: false,
                    message: "Server Eror Dude.....",
                    error: error,
                });
            } else {
                return res.status(200).json({
                    status: true,
                    message: "Data Sudah Sukses Dihapus Dude....",
                });
            }
        }
    );
});

module.exports = router;
