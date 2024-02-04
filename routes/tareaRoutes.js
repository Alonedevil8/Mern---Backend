// Importación de módulos y funciones necesarias
import express from "express";

// Importación de controladores y middleware
import {
  agregarTarea,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
  cambiarEstado,
} from "../controllers/tareaController.js";

import checkAuth from "../middleware/checkAuth.js";

// Creación de una instancia del enrutador de Express
const router = express.Router();

// Rutas para las operaciones relacionadas con tareas

/**
 * Ruta: Agregar Tarea
 * Método: POST
 * Middleware: checkAuth - Verifica la autenticación del usuario
 */
router.post("/", checkAuth, agregarTarea);

/**
 * Ruta: Obtener una tarea por su ID
 * Método: GET
 * Middleware: checkAuth - Verifica la autenticación del usuario
 */
router.get("/:id", checkAuth, obtenerTarea);

/**
 * Ruta: Actualizar Tarea por su ID
 * Método: PUT
 * Middleware: checkAuth - Verifica la autenticación del usuario
 */
router.put("/:id", checkAuth, actualizarTarea);

/**
 * Ruta: Eliminar Tarea por su ID
 * Método: DELETE
 * Middleware: checkAuth - Verifica la autenticación del usuario
 */
router.delete("/:id", checkAuth, eliminarTarea);

/**
 * Ruta: Cambiar Estado de Tarea por su ID
 * Método: POST
 * Middleware: checkAuth - Verifica la autenticación del usuario
 */
router.post("/estado/:id", checkAuth, cambiarEstado);

// Exportación del enrutador para su uso en otros archivos
export default router;
