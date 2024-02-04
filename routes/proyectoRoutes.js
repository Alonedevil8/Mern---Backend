// Importación de módulos y funciones necesarias
import express from "express";
import {
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  agregarColaborador,
  eliminarColaborador,
  buscarColaborador,
} from "../controllers/proyectoController.js";

import checkAuth from "../middleware/checkAuth.js";

// Creación de una instancia del enrutador de Express
const router = express.Router();

// Rutas con middleware para verificar la autenticación (checkAuth)

/**
 * Ruta: Obtener todos los proyectos
 * Método: GET
 * Middleware: checkAuth - Verifica la autenticación del usuario
 */
router.get("/", checkAuth, obtenerProyectos);

/**
 * Ruta: Crear un nuevo proyecto
 * Método: POST
 * Middleware: checkAuth - Verifica la autenticación del usuario
 */
router.post("/", checkAuth, nuevoProyecto);

/**
 * Ruta: Obtener un proyecto específico por ID
 * Método: GET
 * Middleware: checkAuth - Verifica la autenticación del usuario
 */
router.get("/:id", checkAuth, obtenerProyecto);

/**
 * Ruta: Editar un proyecto específico por ID
 * Método: PUT
 * Middleware: checkAuth - Verifica la autenticación del usuario
 */
router.put("/:id", checkAuth, editarProyecto);

/**
 * Ruta: Eliminar un proyecto específico por ID
 * Método: DELETE
 * Middleware: checkAuth - Verifica la autenticación del usuario
 */
router.delete("/:id", checkAuth, eliminarProyecto);

// Rutas para la gestión de tareas

/**
 * Ruta: Buscar un colaborador a un proyecto específico por ID
 * Método: POST
 * Middleware: checkAuth - Verifica la autenticación del usuario
 */
router.post("/colaboradores", checkAuth, buscarColaborador);

/**
 * Ruta: Agregar un colaborador a un proyecto específico por ID
 * Método: POST
 * Middleware: checkAuth - Verifica la autenticación del usuario
 */
router.post("/colaboradores/:id", checkAuth, agregarColaborador);

/**
 * Ruta: Eliminar un colaborador de un proyecto específico por ID
 * Método: POST
 * Middleware: checkAuth - Verifica la autenticación del usuario
 */
router.post("/eliminar-colaborador/:id", checkAuth, eliminarColaborador);

// Exportación del enrutador para su uso en otros archivos
export default router;
