# Project Uptask: MERN stack - Backend

Descripción

Este proyecto consiste en una aplicación backend desarrollada como parte del aprendizaje del stack MERN (MongoDB, Express.js, React, Node.js). El enfoque principal está en la creación de un sistema de gestión de proyectos.

Características

    Autenticación de usuario con bcrypt y JWT.
    Operaciones CRUD para proyectos y tareas.
    Funcionalidades de colaboración con miembros del proyecto.
    ...

Inicio

Prerrequisitos

    Node.js y npm instalados.
    Base de datos MongoDB.

Instalación

    Clonar el repositorio: git clone https://github.com/tuusuario/backend.git
    Instalar dependencias: npm install
    Configurar variables de entorno: Crear un archivo .env basado en .env.example y proporcionar los valores necesarios.

Uso

    Iniciar el servidor: npm start o npm run dev para desarrollo con nodemon.

Tecnologías Utilizadas

    Node.js: Entorno de ejecución para JavaScript en el lado del servidor.
    Express.js: Marco de aplicación web para Node.js.
    MongoDB con Mongoose: Base de datos NoSQL y biblioteca de modelado de objetos para Node.js.
    JWT (JSON Web Token): Mecanismo de autenticación para la comunicación segura de información entre partes.
    bcrypt: Biblioteca para el hash seguro de contraseñas.
    Cors: Middleware para permitir solicitudes de diferentes dominios.
    dotenv: Módulo para cargar variables de entorno desde un archivo.
    Nodemailer: Biblioteca para enviar correos electrónicos desde Node.js.
    Socket.io: Biblioteca para la comunicación bidireccional en tiempo real.

Endpoints de la API

    POST /api/usuarios/registro: Registrar un nuevo usuario.
    POST /api/usuarios/login: Iniciar sesión de usuario.
    GET /api/proyectos: Obtener todos los proyectos.
    ...

Licencia

Este proyecto está licenciado bajo la Licencia ISC. Consulta el archivo LICENSE para más detalles.
Autor

Andres Dorado
Reconocimientos

    Node.js
    Express.js
    MongoDB
