import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Definición del esquema del usuario
const usuarioSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    token: {
      type: String,
    },
    confirmado: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // Añade automáticamente campos de fecha createdAt y updatedAt
);

// Middleware ejecutado antes de guardar el usuario en la base de datos
usuarioSchema.pre("save", async function (next) {
  // Verifica si la contraseña ha sido modificada antes de aplicar hashing
  if (!this.isModified("password")) {
    next();
  }

  // Genera un salt y aplica hashing a la contraseña
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comprobar si la contraseña proporcionada coincide con la almacenada en la base de datos
usuarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
  return await bcrypt.compare(passwordFormulario, this.password);
};

// Crea el modelo 'Usuario' utilizando el esquema definido
const Usuario = mongoose.model("Usuario", usuarioSchema);

// Exporta el modelo para su uso en otras partes de la aplicación
export default Usuario;
