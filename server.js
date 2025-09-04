import express from "express";
import pkg from "pg";
import cors from "cors";

const { Pool } = pkg;
const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.post("/signup", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).send("Email required");

  try {
    await pool.query("INSERT INTO waitlist(email) VALUES($1)", [email]);
    res.send("Thanks for signing up!");
  } catch (err) {
    if (err.code === "23505") {
      res.status(409).send("Already signed up.");
    } else {
      console.error(err);
      res.status(500).send("Error saving email");
    }
  }
});

app.listen(3000, () => console.log("Server running"));
