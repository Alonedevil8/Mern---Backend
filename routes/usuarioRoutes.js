// Importación de módulos y funciones necesarias
import express from "express";
import {
  registrar,
  autenticar,
  confirmar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfil,
} from "../controllers/usuarioController.js";

import checkAuth from "../middleware/checkAuth.js";

// Creación de una instancia del enrutador de Express
const router = express.Router();

// Rutas para la Autenticación, Registro y Confirmación de Usuarios.

/**
 * Ruta: Registrar un nuevo usuario
 * Método: POST
 */
router.post("/", registrar);

/**
 * Ruta: Autenticar un usuario
 * Método: POST
 */
router.post("/login", autenticar);

/**
 * Ruta: Confirmar la cuenta de usuario mediante un token
 * Método: GET
 * Parámetros en la URL:
 * - :token (Token de confirmación)
 */
router.get("/confirmar/:token", confirmar);

/**
 * Ruta: Solicitar la recuperación de contraseña
 * Método: POST
 */
router.post("/olvide-password", olvidePassword);

/**
 * Ruta: Comprobar el token en la recuperación de contraseña
 * Método: GET
 * Parámetros en la URL:
 * - :token (Token de recuperación de contraseña)
 */
router.get("/olvide-password/:token", comprobarToken);

/**
 * Ruta: Establecer una nueva contraseña después de la recuperación
 * Método: POST
 * Parámetros en la URL:
 * - :token (Token de recuperación de contraseña)
 */
router.post("/olvide-password/:token", nuevoPassword);

/**
 * Ruta: Obtener el perfil del usuario (requiere autenticación)
 * Método: GET
 * Middleware: checkAuth - Verifica la autenticación del usuario
 */
router.get("/perfil", checkAuth, perfil);

// Exportación del enrutador para su uso en otros archivos
export default router;
