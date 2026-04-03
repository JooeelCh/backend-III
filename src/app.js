import express from "express";
import swaggerUi from "swagger-ui-express";
import usersRouter from "./routers/users.router.js";
import petsRouter from "./routers/pets.router.js";
import mocksRouter from "./routers/mocks.router.js";
import adoptionRouter from "./routers/adoption.router.js";
import { swaggerSpec } from "./docs/swagger.js";

const app = express();

app.use(express.json());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/mocks", mocksRouter);
app.use("/api/adoptions", adoptionRouter);

app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Ruta no encontrada" });
});

export default app;
