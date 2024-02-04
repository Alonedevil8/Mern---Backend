import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Función para enviar el correo de confirmación de registro
export const emailRegistro = async (datos) => {
  const { email, nombre, token } = datos;

  // Configuración del transporter (nodemailer)
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "5a59d0695bd6f0",
      pass: "b21a6b00cf8cf7",
    },
  });

  // Cuerpo del correo electrónico
  const correoHTML = `<style>
    /* Definición de estilos */
    h1 {
      color: #3498db; /* Azul característico de Uptask */
      text-align: center;
    }

    p {
      font-size: 16px;
    }

    a {
      display: inline-block;
      padding: 10px 20px;
      background-color: #3498db; /* Azul característico de Uptask */
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
      margin-bottom: 20px;
    }

    .footer {
      font-size: 14px;
      color: #777;
    }
  </style>

  <h1>¡Bienvenido a Uptask!</h1>
  <p>¡Hola <strong>${nombre}</strong>!</p>
  <p>Gracias por registrarte en Uptask, tu plataforma para la gestión de proyectos. Para completar el proceso de registro, haz clic en el siguiente enlace:</p>
  <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Confirmar Cuenta</a>
  <p class="footer">Si no has solicitado este registro, por favor ignora este correo.</p>
  `;

  // Configuración del correo
  const info = await transporter.sendMail({
    from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
    to: email,
    subject: "UpTask - Comprueba tu Cuenta",
    text: "Comprueba tu Cuenta en UpTask",
    html: correoHTML,
  });
};

export const emailRecuperar = async (datos) => {
  const { email, nombre, token } = datos;

  // Configuración del transporter (nodemailer)
  const transporter = nodemailer.createTransport({
    host: process.env.HOST_MAILTRAP,
    port: process.env.PORT_MAILTRAP,
    auth: {
      user: process.env.USER_MAILTRAP,
      pass: process.env.PASSWORD_MAILTRAP,
    },
  });

  // Cuerpo del correo electrónico
  const correoHTML1 = `<style>
    /* Definición de estilos */
    h1 {
      color: #3498db; /* Azul característico de Uptask */
      text-align: center;
    }

    p {
      font-size: 16px;
    }

    a {
      display: inline-block;
      padding: 10px 20px;
      background-color: #3498db; /* Azul característico de Uptask */
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
      margin-bottom: 20px;
    }

    .footer {
      font-size: 14px;
      color: #777;
    }
  </style>

  <h1>Recuperación de Contraseña en Uptask</h1>
  <p>¡Hola <strong>${nombre}</strong>!</p>
  <p>Recibes este correo porque has solicitado la recuperación de contraseña en Uptask. Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
  <a href="${process.env.FRONTEND_URL}/nuevo-password/${token}">Restablecer Contraseña</a>
  <p class="footer">Si no has solicitado la recuperación de contraseña, por favor ignora este correo.</p>
  `;

  // Configuración del correo
  const info = await transporter.sendMail({
    from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
    to: email,
    subject: "UpTask - Olvide Contraseña",
    text: "Renueve la Contraseña en UpTask",
    html: correoHTML1,
  });
};
