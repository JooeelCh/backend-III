import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./utils/db.js";

dotenv.config();

const PORT = process.env.PORT || 8080;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("No se pudo iniciar la aplicación:", error.message);
    process.exit(1);
  });
