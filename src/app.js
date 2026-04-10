import express from "express";
import swaggerUi from "swagger-ui-express";
import sessionsRouter from "./routes/sessions.router.js";
import usersRouter from "./routes/users.router.js";
import petsRouter from "./routes/pets.router.js";
import adoptionRouter from "./routes/adoption.router.js";
import { swaggerSpec } from "./utils/swagger.js";

const app = express();

app.use(express.json());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/adoptions", adoptionRouter);

app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Ruta no encontrada" });
});

export default app;
