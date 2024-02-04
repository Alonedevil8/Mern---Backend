// Importación de modelos
import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";
import Usuario from "../models/Usuario.js";

const agregarTarea = async (req, res) => {
  //
  const { proyecto } = req.body;

  if (proyecto.match(/^[0-9a-fA-F]{24}$/)) {
    try {
      // Buscar el proyecto por proyecto
      const existeProyecto = await Proyecto.findById(proyecto.trim());
      //
      if (!existeProyecto) {
        const error = new Error("1. No existe el Proyecto");
        return res.status(404).json({ msg: error.message });
      }
      //
      if (existeProyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error(
          "No Tienes Los Permisos Adecuados para Adicionar una Tarea"
        );
        return res.status(401).json({ msg: error.message });
      }
      //
      const tareaAlmacenada = await Tarea.create(req.body);
      // Almacenar el Id en el proyecto
      existeProyecto.tareas.push(tareaAlmacenada._id);
      //
      await existeProyecto.save();
      //
      res.json(tareaAlmacenada);
      //
    } catch (error) {
      console.log("Error al editar el proyecto:", error);
      res
        .status(500)
        .json({ msg: "Error interno del servidor al editar el proyecto" });
    }
  } else {
    const error = new Error("2. No existe el Proyecto");
    res.status(404).json({ msg: error.message });
  }
};

const obtenerTarea = async (req, res) => {
  const { id } = req.params;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    try {
      // Buscar el proyecto por ID
      const tarea = await Tarea.findById(id).populate("proyecto");

      if (!tarea) {
        const error = new Error("No existe el Proyecto");
        return res.status(404).json({ msg: error.message });
      }

      if (tarea.proyecto[0].creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Acción no válida: No eres el Creador");
        return res.status(401).json({ msg: error.message });
      }

      // Enviar el proyecto como respuesta
      res.json(tarea);
    } catch (error) {
      console.log("Error al obtener el proyecto:", error);
      res
        .status(403)
        .json({ msg: "Error interno del servidor al obtener el proyecto" });
    }
  } else {
    const error = new Error("ID suministrado no válido");
    res.status(400).json({ msg: error.message });
  }
};

const actualizarTarea = async (req, res) => {
  const { id } = req.params;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    try {
      // Buscar el proyecto por ID
      const tarea = await Tarea.findById(id).populate("proyecto");

      if (!tarea) {
        const error = new Error("No existe el Proyecto");
        return res.status(404).json({ msg: error.message });
      }

      if (tarea.proyecto[0].creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Acción no válida: No eres el Creador");
        return res.status(401).json({ msg: error.message });
      }

      // Actualizar los campos del proyecto con los nuevos valores proporcionados en la solicitud
      tarea.nombre = req.body.nombre || tarea.nombre;
      tarea.descripcion = req.body.descripcion || tarea.descripcion;
      tarea.prioridad = req.body.prioridad || tarea.prioridad;
      tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;

      // Guardar los cambios en el proyecto
      const tareaAlmacenada = await tarea.save();
      // Enviar el proyecto actualizado como respuesta
      res.json(tareaAlmacenada);
      //
    } catch (error) {
      console.log("Error al editar el proyecto:", error);
      res
        .status(500)
        .json({ msg: "Error interno del servidor al editar el proyecto" });
    }
  } else {
    const error = new Error("ID suministrado no válido");
    res.status(400).json({ msg: error.message });
  }
};

const eliminarTarea = async (req, res) => {
  const { id } = req.params;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    try {
      const tarea = await Tarea.findById(id).populate("proyecto");

      if (!tarea) {
        return res.status(404).json({ msg: "No existe la Tarea" });
      }

      if (tarea.proyecto[0].creador.toString() !== req.usuario._id.toString()) {
        return res
          .status(401)
          .json({ msg: "Acción no válida: No eres el Creador" });
      }

      const proyecto = await Proyecto.findById(tarea.proyecto);

      if (!proyecto) {
        return res.status(404).json({ msg: "No existe el Proyecto" });
      }

      proyecto.tareas.pull(tarea._id);

      await Promise.allSettled([proyecto.save(), tarea.deleteOne()]);

      res.json({ msg: "La Tarea se eliminó correctamente" });
    } catch (error) {
      console.log("Error al eliminar la tarea", error);
      res.status(500).json({
        msg: "Error interno del servidor al eliminar la tarea",
      });
    }
  } else {
    res.status(400).json({ msg: "ID suministrado no válido" });
  }
};

// (por implementar)
const cambiarEstado = async (req, res) => {
  const { id } = req.params;

  const tarea = await Tarea.findById(id).populate("proyecto");

  if (!tarea) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).json({ msg: error.message });
  }

  if (
    tarea.proyecto[0].creador.toString() !== req.usuario._id.toString() &&
    !tarea.proyecto[0].colaboradores.some(
      (colaborador) => colaborador._id.toString() === req.usuario._id.toString()
    )
  ) {
    const error = new Error("Acción no válida");
    return res.status(403).json({ msg: error.message });
  }

  tarea.estado = !tarea.estado;
  tarea.completado = req.usuario._id;
  await tarea.save();

  const tareaAlmacenada = await Tarea.findById(id)
    .populate("proyecto")
    .populate("completado");
  res.json(tareaAlmacenada);
};

export {
  agregarTarea,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
  cambiarEstado,
};
