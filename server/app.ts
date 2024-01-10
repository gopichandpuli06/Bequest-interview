import express from "express";
import cors from "cors";
import crypto from "crypto-js";
import winston from "winston"; //event logging

const PORT = 8080;
const app = express();
const initialData = "";
const initialHash = calculateHash(initialData);
const database = { data: initialData, hash: initialHash };

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(), //timestamp to check when the post request has been sent
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'server.log' })
  ]
});

app.use(cors());
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  res.json(database);
});

app.post("/", (req, res) => {
  const newData = req.body.data || "";
  const newHash = req.body.hash || "";
  //database.data = req.body.data;
  database.data = newData;
  database.hash = newHash;
  logger.info('Data updated successfully.', { newData, newHash });
  res.sendStatus(200);
  // Verify data integrity before updating the database
  /*if (newHash === calculateHash(newData)) {
    database.data = newData;
    database.hash = newHash;
    // Log a successful data update event
    logger.info('Data updated successfully.', { newData, newHash });
    res.sendStatus(200);
  } else {
    // Log a data integrity check failure event
    logger.error('Data integrity check failed. Possible tampering!', { newData, newHash });
    res.status(400).json({ error: "Data integrity check failed. Possible tampering!" });
  }*/
});


app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

function calculateHash(data: string) {
  // Use a strong hashing algorithm (e.g., SHA-256)
  return crypto.SHA256(data).toString();
}