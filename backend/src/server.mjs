import express from "express";
import multer from "multer";
import mysql from "mysql2";
import cors from "cors";
import fs from "fs";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// conexão MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "olamundo",
  database: "upload_db"
});

// config do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname;
    cb(null, unique);
  }
});

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const upload = multer({ storage });
app.use("/uploads", express.static("uploads"));


// rota upload
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Nenhum arquivo enviado" });
  }

  const { filename, path: filePath } = req.file;

  db.query(
    "INSERT INTO images (filename, path) VALUES (?, ?)",
    [filename, filePath],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Upload feito com sucesso", filename });
    }
  );
});

app.get("/images", (req, res) => {
  db.query("SELECT * FROM images ORDER BY created_at DESC", (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }

    const images = results.map(img => ({
      id: img.id,
      url: `http://localhost:3000/${img.path}`,
      filename: img.filename
    }));

    res.json(images);
  });
});


app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
