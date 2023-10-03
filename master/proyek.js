const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const connection = require("../config/db"); // Update the path to your database connection file

// GET all Proyek records with related ManajerProyek and PekerjaDitugaskan data
router.get("/", (req, res) => {
    connection.query("SELECT * FROM Proyek", (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: "Server Gagal",
                error: err,
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Data Proyek",
                data: rows,
            });
        }
    });
});

// POST (STORE) a new Proyek record
router.post("/proyek",[
    // Validation
    body("NamaProyek").notEmpty(),
    body("LokasiProyek").notEmpty(),
    body("TanggalMulai").notEmpty(),
    body("TanggalSelesai").notEmpty(),
    body("AnggaranProyek").notEmpty(),
    body("StatusProyek").notEmpty(),
    body("ManajerProyek").notEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }
    const data = {
      NamaProyek: req.body.NamaProyek,
      LokasiProyek: req.body.LokasiProyek,
      TanggalMulai: req.body.TanggalMulai,
      TanggalSelesai: req.body.TanggalSelesai,
      AnggaranProyek: req.body.AnggaranProyek,
      StatusProyek: req.body.StatusProyek,
      ManajerProyek: req.body.ManajerProyek,
    };

    connection.query("INSERT INTO Proyek SET ?", data, (err, rows) => {
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
          message: "Berhasil Menambahkan Data Proyek",
          data: rows
        });
      }
    });    
  }
);

// GET a specific Proyek record by ID
router.get("/:id", (req, res) => {
    const id = req.params.id;
    connection.query(
      "SELECT * FROM Proyek WHERE IDProyek = ?",
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
            message: "Data Proyek : ",
            data: rows[0],
          });
        }
      }
    );
  });
  


// PATCH (UPDATE) Proyek record by ID
router.put("/update/:id",
  [
    // Validation
    body("NamaProyek").notEmpty(),
    body("LokasiProyek").notEmpty(),
    body("TanggalMulai").notEmpty(),
    body("TanggalSelesai").notEmpty(),
    body("AnggaranProyek").notEmpty(),
    body("StatusProyek").notEmpty(),
    body("ManajerProyek").notEmpty(),
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
      NamaProyek: req.body.NamaProyek,
      LokasiProyek: req.body.LokasiProyek,
      TanggalMulai: req.body.TanggalMulai,
      TanggalSelesai: req.body.TanggalSelesai,
      AnggaranProyek: req.body.AnggaranProyek,
      StatusProyek: req.body.StatusProyek,
      ManajerProyek: req.body.ManajerProyek,
    };

    connection.query(
      "UPDATE Proyek SET ? WHERE IDProyek = ?",
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

// DELETE a Proyek record by ID
router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "DELETE FROM Proyek WHERE IDProyek = ?",
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
