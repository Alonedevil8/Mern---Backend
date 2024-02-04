import mongoose from "mongoose";

// Función para conectar a la base de datos MongoDB
const conectarDB = async () => {
  try {
    // Intenta establecer una conexión con la base de datos utilizando la URI proporcionada en las variables de entorno
    const connection = await mongoose.connect(
      process.env.MONGO_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    // Obtiene la información de host y puerto de la conexión
    const url = `${connection.connection.host}:${connection.connection.port}`;

    // Imprime un mensaje indicando que la conexión fue exitosa
    console.log(`Mongo Conectado en ${url}`);
  } catch (error) {
    // Maneja errores en caso de que la conexión falle
    console.log(`Error: ${error.message}`);

    // Termina el proceso con un código de error (1)
    process.exit(1);
  }
};

// Exporta la función para su uso en otras partes de la aplicación
export default conectarDB;
