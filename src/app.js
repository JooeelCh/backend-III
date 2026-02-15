import express from "express";
import mongoose from "mongoose";
import usersRouter from "./routers/users.router.js";
import petsRouter from "./routers/pets.router.js";
import mocksRouter from "./routers/mocks.router.js";

const app = express();

app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/coderhouse")
  .then(() => console.log("Mongo conectado"))
  .catch((err) => console.log(err));

app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/mocks", mocksRouter);

app.listen(8080, () => {
  console.log("Servidor corriendo en puerto 8080");
});
