import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import usersRouter from "./routers/users.router.js";
import petsRouter from "./routers/pets.router.js";
import mocksRouter from "./routers/mocks.router.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo conectado"))
  .catch((err) => console.log(err));

app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/mocks", mocksRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
