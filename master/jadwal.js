const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const connection = require("../config/db"); // Update the path to your database connection file

// GET all Jadwal records with related PekerjaDijadwalkan and ProyekTerjadwal data
router.get("/", (req, res) => {
    connection.query(
        "SELECT j.*, pekerja.NamaPekerja AS PekerjaDijadwalkan, proyek.NamaProyek AS ProyekTerjadwal " +
        "FROM Jadwal j " +
        "LEFT JOIN Pekerja pekerja ON j.PekerjaDijadwalkan = pekerja.IDPekerja " +
        "LEFT JOIN Proyek proyek ON j.ProyekTerjadwal = proyek.IDProyek",
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
                    message: "Data Jadwal",
                    data: rows,
                });
            }
        }
    );
});

// POST (STORE) a new Jadwal record
router.post("/jadwal", [
    // Validation
    body("Tanggal").notEmpty(),
    body("PekerjaDijadwalkan").notEmpty(),
    body("ProyekTerjadwal").notEmpty(),
    body("DetailJadwal").notEmpty(),
],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array(),
            });
        }
        const data = {
            Tanggal: req.body.Tanggal,
            PekerjaDijadwalkan: req.body.PekerjaDijadwalkan,
            ProyekTerjadwal: req.body.ProyekTerjadwal,
            DetailJadwal: req.body.DetailJadwal,
        };

        connection.query("INSERT INTO Jadwal SET ?", data, (err, rows) => {
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
                    message: "Berhasil Menambahkan Data Jadwal",
                    data: rows
                });
            }
        });
    }
);

// GET a specific Jadwal record by ID
router.get("/:id", (req, res) => {
    const id = req.params.id;
    connection.query(
        "SELECT j.*, pekerja.NamaPekerja AS PekerjaDijadwalkan, proyek.NamaProyek AS ProyekTerjadwal " +
        "FROM Jadwal j " +
        "LEFT JOIN Pekerja pekerja ON j.PekerjaDijadwalkan = pekerja.IDPekerja " +
        "LEFT JOIN Proyek proyek ON j.ProyekTerjadwal = proyek.IDProyek " +
        "WHERE j.IDJadwal = ?",
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
                    message: "Data Jadwal : ",
                    data: rows[0],
                });
            }
        }
    );
});

// PATCH (UPDATE) Jadwal record by ID
router.put("/update/:id",
    [
        // Validation
        body("Tanggal").notEmpty(),
        body("PekerjaDijadwalkan").notEmpty(),
        body("ProyekTerjadwal").notEmpty(),
        body("DetailJadwal").notEmpty(),
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
            Tanggal: req.body.Tanggal,
            PekerjaDijadwalkan: req.body.PekerjaDijadwalkan,
            ProyekTerjadwal: req.body.ProyekTerjadwal,
            DetailJadwal: req.body.DetailJadwal,
        };

        connection.query(
            "UPDATE Jadwal SET ? WHERE IDJadwal = ?",
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

// DELETE a Jadwal record by ID
router.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
    connection.query(
        "DELETE FROM Jadwal WHERE IDJadwal = ?",
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
