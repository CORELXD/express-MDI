const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const connection = require("../config/db"); // Update the path to your database connection file

// GET all Pekerja records with related ProyekDitugaskan data
router.get("/", (req, res) => {
    connection.query(
        "SELECT pekerja.*, GROUP_CONCAT(proyek.NamaProyek) AS ProyekDitugaskan " +
        "FROM Pekerja pekerja " +
        "LEFT JOIN Proyek proyek ON pekerja.ProyekDitugaskan = proyek.IDProyek " +
        "GROUP BY pekerja.IDPekerja",
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
                    message: "Data Pekerja",
                    data: rows,
                });
            }
        }
    );
});

// POST (STORE) a new Pekerja record
router.post("/pekerja", [
    // Validation
    body("NamaPekerja").notEmpty(),
    body("Jabatan").notEmpty(),
    body("Alamat").notEmpty(),
    body("NomorTelepon").notEmpty(),
    body("Gaji").notEmpty(),
    body("ProyekDitugaskan").notEmpty(),
],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array(),
            });
        }
        const data = {
            NamaPekerja: req.body.NamaPekerja,
            Jabatan: req.body.Jabatan,
            Alamat: req.body.Alamat,
            NomorTelepon: req.body.NomorTelepon,
            Gaji: req.body.Gaji,
            ProyekDitugaskan: req.body.ProyekDitugaskan,
        };

        connection.query("INSERT INTO Pekerja SET ?", data, (err, rows) => {
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
                    message: "Berhasil Menambahkan Data Pekerja",
                    data: rows
                });
            }
        });
    }
);

// GET a specific Pekerja record by ID
router.get("/:id", (req, res) => {
    const id = req.params.id;
    connection.query(
        "SELECT pekerja.*, GROUP_CONCAT(proyek.NamaProyek) AS ProyekDitugaskan " +
        "FROM Pekerja pekerja " +
        "LEFT JOIN Proyek proyek ON pekerja.ProyekDitugaskan = proyek.IDProyek " +
        "WHERE pekerja.IDPekerja = ?",
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
                    message: "Data Pekerja : ",
                    data: rows[0],
                });
            }
        }
    );
});

// PATCH (UPDATE) Pekerja record by ID
router.put("/update/:id",
    [
        // Validation
        body("NamaPekerja").notEmpty(),
        body("Jabatan").notEmpty(),
        body("Alamat").notEmpty(),
        body("NomorTelepon").notEmpty(),
        body("Gaji").notEmpty(),
        body("ProyekDitugaskan").notEmpty(),
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
            NamaPekerja: req.body.NamaPekerja,
            Jabatan: req.body.Jabatan,
            Alamat: req.body.Alamat,
            NomorTelepon: req.body.NomorTelepon,
            Gaji: req.body.Gaji,
            ProyekDitugaskan: req.body.ProyekDitugaskan,
        };

        connection.query(
            "UPDATE Pekerja SET ? WHERE IDPekerja = ?",
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

// DELETE a Pekerja record by ID
router.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
    connection.query(
        "DELETE FROM Pekerja WHERE IDPekerja = ?",
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
