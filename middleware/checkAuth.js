// Importa la librería 'jsonwebtoken' y el modelo de Usuario
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

// Middleware de autenticación
const checkAuth = async (req, res, next) => {
  let token;

  // Verifica si la solicitud tiene la cabecera 'Authorization' y si comienza con 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extrae el token de la cabecera 'Authorization'
      token = req.headers.authorization.split(" ")[1];

      // Verifica y decodifica el token utilizando la clave secreta almacenada en el entorno
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Busca al usuario en la base de datos utilizando el ID decodificado del token
      // y excluye algunos campos sensibles del objeto usuario
      req.usuario = await Usuario.findById(decoded.id).select(
        "-password -confirmado -token -createdAt -updatedAt -__v"
      );

      // Si la verificación y la búsqueda son exitosas, pasa al siguiente middleware
      return next();
    } catch (error) {
      // Si hay un error en la verificación del token, devuelve un error 404
      return res.status(404).json({ msg: "Hubo un error" });
    }
  }

  // Si no hay un token válido en la cabecera 'Authorization', devuelve un error 401
  if (!token) {
    const error = new Error("Token no válido");
    return res.status(401).json({ msg: error.message });
  }

  // Si todo está bien, pasa al siguiente middleware
  next();
};

// Exporta el middleware para su uso en otros archivos
export default checkAuth;
