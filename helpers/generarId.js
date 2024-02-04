// Función para generar identificadores
const generarId = () => {
  // Genera una cadena aleatoria utilizando el método toString(32)
  const random = Math.random().toString(32).substring(2);

  // Obtiene la marca de tiempo actual y la convierte a cadena en base 32
  const fecha = Date.now().toString(32);

  // Combina la cadena aleatoria y la marca de tiempo para formar el identificador único
  return random + fecha;
};

// Exporta la función para su uso en otras partes de la aplicación
export default generarId;
