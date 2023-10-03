const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const connection = require("../config/db"); // Update the path to your database connection file

// GET all Tugas records with related PekerjaDitugaskan data
router.get("/", (req, res) => {
    connection.query(
        "SELECT t.*, pekerja.NamaPekerja AS PekerjaDitugaskan " +
        "FROM Tugas t " +
        "LEFT JOIN Pekerja pekerja ON t.PekerjaDitugaskan = pekerja.IDPekerja",
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
                    message: "Data Tugas",
                    data: rows,
                });
            }
        }
    );
});

// POST (STORE) a new Tugas record
router.post("/tugas", [
    // Validation
    body("NamaTugas").notEmpty(),
    body("DeskripsiTugas").notEmpty(),
    body("TanggalMulai").notEmpty(),
    body("TanggalSelesai").notEmpty(),
    body("PekerjaDitugaskan").notEmpty(),
    body("StatusTugas").notEmpty(),
],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array(),
            });
        }
        const data = {
            NamaTugas: req.body.NamaTugas,
            DeskripsiTugas: req.body.DeskripsiTugas,
            TanggalMulai: req.body.TanggalMulai,
            TanggalSelesai: req.body.TanggalSelesai,
            PekerjaDitugaskan: req.body.PekerjaDitugaskan,
            StatusTugas: req.body.StatusTugas,
        };

        connection.query("INSERT INTO Tugas SET ?", data, (err, rows) => {
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
                    message: "Berhasil Menambahkan Data Tugas",
                    data: rows
                });
            }
        });
    }
);

// GET a specific Tugas record by ID
router.get("/:id", (req, res) => {
    const id = req.params.id;
    connection.query(
        "SELECT t.*, pekerja.NamaPekerja AS PekerjaDitugaskan " +
        "FROM Tugas t " +
        "LEFT JOIN Pekerja pekerja ON t.PekerjaDitugaskan = pekerja.IDPekerja " +
        "WHERE t.IDTugas = ?",
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
                    message: "Data Tugas : ",
                    data: rows[0],
                });
            }
        }
    );
});

// PATCH (UPDATE) Tugas record by ID
router.put("/update/:id",
    [
        // Validation
        body("NamaTugas").notEmpty(),
        body("DeskripsiTugas").notEmpty(),
        body("TanggalMulai").notEmpty(),
        body("TanggalSelesai").notEmpty(),
        body("PekerjaDitugaskan").notEmpty(),
        body("StatusTugas").notEmpty(),
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
            NamaTugas: req.body.NamaTugas,
            DeskripsiTugas: req.body.DeskripsiTugas,
            TanggalMulai: req.body.TanggalMulai,
            TanggalSelesai: req.body.TanggalSelesai,
            PekerjaDitugaskan: req.body.PekerjaDitugaskan,
            StatusTugas: req.body.StatusTugas,
        };

        connection.query(
            "UPDATE Tugas SET ? WHERE IDTugas = ?",
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

// DELETE a Tugas record by ID
router.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
    connection.query(
        "DELETE FROM Tugas WHERE IDTugas = ?",
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
