import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Problem Forge is Active");
});

export default app;