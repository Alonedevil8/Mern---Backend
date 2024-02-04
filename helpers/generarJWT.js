import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Función para generar un token JWT
const generarJWT = (id) => {
  // Utiliza el método sign de la librería jsonwebtoken para firmar un token
  // El token incluye el ID proporcionado y se firma con la clave secreta JWT_SECRET del archivo .env
  // El token expirará después de 7 días (esto puede ajustarse según tus necesidades)
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Exporta la función para su uso en otras partes de la aplicación
export default generarJWT;
