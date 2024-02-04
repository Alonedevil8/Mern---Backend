// Importación de modelos
import Proyecto from "../models/Proyecto.js";
import Usuario from "../models/Usuario.js";
import Tarea from "../models/Tarea.js";

// Función para crear un nuevo proyecto
const nuevoProyecto = async (req, res) => {
  // Crear una nueva instancia del modelo Proyecto con los datos de la solicitud
  const proyecto = new Proyecto(req.body);
  // Asignar el ID del usuario autenticado como creador del proyecto
  proyecto.creador = req.usuario._id;

  try {
    // Guardar el proyecto en la base de datos
    const proyectoAlmacenado = await proyecto.save();
    console.log("Nuevo Proyecto Creado:", proyectoAlmacenado);
    res.status(200).json({ msg: "Proyecto Creado Satisfactoriamente" });
  } catch (error) {
    console.log("Error al crear el proyecto:", error);
    res
      .status(500)
      .json({ msg: "Error interno del servidor al crear el proyecto" });
  }
};

// Función para obtener todos los proyectos en los que el usuario es colaborador o creador
const obtenerProyectos = async (req, res) => {
  try {
    // Buscar proyectos que tengan al usuario como colaborador o creador
    const proyectos = await Proyecto.find({
      $or: [
        { colaboradores: { $in: req.usuario._id } },
        { creador: req.usuario._id },
      ],
    });
    // Enviar la lista de proyectos como respuesta

    res.json(proyectos);
  } catch (error) {
    console.log("Error al obtener proyectos:", error);
    res
      .status(500)
      .json({ msg: "Error interno del servidor al obtener proyectos" });
  }
};

// Función para obtener un proyecto específico por su ID
const obtenerProyecto = async (req, res) => {
  const { id } = req.params;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    try {
      // Buscar el proyecto por ID
      const proyecto = await Proyecto.findById(id.trim())
        .populate({ path: "tareas", populate: { path: "completado" } })
        .populate("colaboradores", "nombre email");

      if (!proyecto) {
        const error = new Error("No existe el Proyecto");
        return res.status(404).json({ msg: error.message });
      }

      if (
        proyecto.creador.toString() !== req.usuario._id.toString() &&
        !proyecto.colaboradores.some(
          (colaborador) =>
            colaborador._id.toString() === req.usuario._id.toString()
        )
      ) {
        const error = new Error("Acción no válida: No eres el Creador");
        return res.status(401).json({ msg: error.message });
      }
      res.json(proyecto);
    } catch (error) {
      console.log("Error al obtener el proyecto:", error);
      res
        .status(500)
        .json({ msg: "Error interno del servidor al obtener el proyecto" });
    }
  } else {
    const error = new Error("ID suministrado no válido");
    res.status(400).json({ msg: error.message });
  }
};

// Función para editar un proyecto específico por su ID
const editarProyecto = async (req, res) => {
  const { id } = req.params;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    try {
      // Buscar el proyecto por ID
      const proyecto = await Proyecto.findById(id.trim());

      if (!proyecto) {
        const error = new Error("No existe el Proyecto");
        return res.status(404).json({ msg: error.message });
      }

      if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Acción no válida: No eres el Creador");
        return res.status(401).json({ msg: error.message });
      }

      // Actualizar los campos del proyecto con los nuevos valores proporcionados en la solicitud
      proyecto.nombre = req.body.nombre || proyecto.nombre;
      proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
      proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
      proyecto.cliente = req.body.cliente || proyecto.cliente;

      // Guardar los cambios en el proyecto
      const proyectoAlmacenado = await proyecto.save();
      // Enviar el proyecto actualizado como respuesta
      res.json(proyectoAlmacenado);
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

// Función para eliminar un proyecto específico por su ID
const eliminarProyecto = async (req, res) => {
  const { id } = req.params;

  try {
    // Buscar el proyecto por ID
    const proyecto = await Proyecto.findById(id.trim());

    if (!proyecto) {
      const error = new Error("No existe el Proyecto");
      return res.status(404).json({ msg: error.message });
    }

    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error("Acción no válida: No eres el Creador");
      return res.status(401).json({ msg: error.message });
    }

    // Eliminar el proyecto de la base de datos
    await proyecto.deleteOne();
    res.json({ msg: "Proyecto Eliminado" });
  } catch (error) {
    console.log("Error al eliminar el proyecto:", error);
    res
      .status(500)
      .json({ msg: "Error interno del servidor al eliminar el proyecto" });
  }
};

// -------------  ***Colaborador y Tareas***  ----------------------

// Función para buscar un colaborador de un proyecto
const buscarColaborador = async (req, res) => {
  const { email } = req.body;

  try {
    const usuario = await Usuario.findOne(email);

    if (!usuario) {
      const error = new Error("Usuario no encontrado");
      return res.status(404).json({ msg: error.message });
    }

    res.json(usuario);
  } catch (error) {
    console.log("Error al obtener el proyecto:", error);
    res
      .status(500)
      .json({ msg: "Error interno del servidor al obtener el proyecto" });
  }
};

// Función para agregar un colaborador a un proyecto
const agregarColaborador = async (req, res) => {
  //
  const proyecto = await Proyecto.findById(req.params.id);

  if (!proyecto) {
    const error = new Error("Proyecto No Encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(404).json({ msg: error.message });
  }

  const { email } = req.body;
  const usuario = await Usuario.findOne({ email }).select(
    "-confirmado -createdAt -password -token -updatedAt -__v "
  );

  if (!usuario) {
    const error = new Error("Usuario no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  // El colaborador no es el admin del proyecto
  if (proyecto.creador.toString() === usuario._id.toString()) {
    const error = new Error("El Creador del Proyecto no puede ser colaborador");
    return res.status(404).json({ msg: error.message });
  }

  // Revisar que no este ya agregado al proyecto
  if (proyecto.colaboradores.includes(usuario._id)) {
    const error = new Error("El Usuario ya pertenece al Proyecto");
    return res.status(404).json({ msg: error.message });
  }

  // Esta bien, se puede agregar
  proyecto.colaboradores.push(usuario._id);
  await proyecto.save();
  res.json({ msg: "Colaborador Agregado Correctamente" });
};

// Función para eliminar un colaborador de un proyecto
const eliminarColaborador = async (req, res) => {
  const proyecto = await Proyecto.findById(req.params.id);

  if (!proyecto) {
    const error = new Error("Proyecto No Encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(404).json({ msg: error.message });
  }

  // Esta bien, se puede Eliminar
  proyecto.colaboradores.pull(req.body.id);
  await proyecto.save();
  res.json({ msg: "Colaborador Eliminado Correctamente" });
};

// Exportación de las funciones para su uso en otras partes del código
export {
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  agregarColaborador,
  eliminarColaborador,
  buscarColaborador,
};
