import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";

import { emailRegistro, emailRecuperar } from "../helpers/email.js";

// Función para registrar un nuevo usuario
const registrar = async (req, res) => {
  // Evitar registros duplicados
  const { email } = req.body;
  const existeUsuario = await Usuario.findOne({ email });

  if (existeUsuario) {
    const error = new Error("Usuario ya registrado");
    return res.status(400).json({ msg: error.message });
  }

  try {
    // Crear un nuevo usuario y asignar un token único
    const usuario = new Usuario(req.body);
    usuario.token = generarId();
    await usuario.save();
    //
    emailRegistro({
      nombre: usuario.nombre,
      email: usuario.email,
      token: usuario.token,
    });
    //
    res.json({
      msg: "Usuario Creado Correctamente, Revisa Tu Email Para Confirmar",
    });
  } catch (error) {
    console.log(error);
  }
};

// Función para autenticar un usuario
const autenticar = async (req, res) => {
  const { email, password } = req.body;

  // Comprobar si el usuario existe
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    const error = new Error("Usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  // Comprobar que esté confirmado
  if (!usuario.confirmado) {
    const error = new Error("Tu cuenta no ha sido confirmada");
    return res.status(403).json({ msg: error.message });
  }

  // Comprobar la contraseña
  if (await usuario.comprobarPassword(password)) {
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      jwt: generarJWT(usuario._id),
    });
  } else {
    const error = new Error("Contraseña incorrecta");
    return res.status(403).json({ msg: error.message });
  }
};

// Función para confirmar la cuenta de usuario
const confirmar = async (req, res) => {
  const { token } = req.params;
  const usuarioConfirmar = await Usuario.findOne({ token });

  if (!usuarioConfirmar) {
    const error = new Error("Token no válido");
    return res.status(403).json({ msg: error.message });
  }

  try {
    // Confirmar la cuenta del usuario y limpiar el token
    usuarioConfirmar.confirmado = true;
    usuarioConfirmar.token = "";
    await usuarioConfirmar.save();
    res.status(200).json({ msg: "Usuario confirmado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

// Función para solicitar la recuperación de contraseña
const olvidePassword = async (req, res) => {
  const { email } = req.body;

  // Comprobar si el usuario existe
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    const error = new Error("Usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  // Comprobar que esté confirmado
  if (!usuario.confirmado) {
    const error = new Error("Tu cuenta no ha sido confirmada");
    return res.status(403).json({ msg: error.message });
  }

  try {
    // Generar un nuevo token para la recuperación de contraseña
    usuario.token = generarId();
    await usuario.save();

    //
    emailRecuperar({
      nombre: usuario.nombre,
      email: usuario.email,
      token: usuario.token,
    });

    res
      .status(200)
      .json({ msg: "Hemos enviado un email con las instrucciones" });
  } catch (error) {
    console.log(error);
  }
};

// Función para comprobar la validez de un token en la recuperación de contraseña
const comprobarToken = async (req, res) => {
  const { token } = req.params;

  const tokenValido = await Usuario.findOne({ token });
  if (tokenValido) {
    res.json({ msg: "Cambio Permitido" });
  } else {
    const error = new Error("Cambio No Permitido");
    return res.status(404).json({ msg: error.message });
  }
};

// Función para establecer una nueva contraseña después de la recuperación
const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const usuario = await Usuario.findOne({ token });

  if (usuario) {
    // Establecer la nueva contraseña y limpiar el token
    usuario.password = password;
    usuario.token = "";

    try {
      await usuario.save();
      res.json({ msg: "Contraseña ha sido modificada" });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error("Token no válido");
    return res.status(404).json({ msg: error.message });
  }
};

// Función para obtener el perfil del usuario (requiere autenticación)
const perfil = async (req, res) => {
  const { usuario } = req;
  res.json(usuario);
};

export {
  registrar,
  autenticar,
  confirmar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfil,
};
