const mongoose = require("mongoose");
const Teacher = require("../models/teacherModel");
const crypto = require("crypto");

async function authenticate(user, password) {
  try {
    const teacher = await Teacher.findOne({ cedula: user });
    if (!teacher) {
      return { success: false, message: "Usuario no encontrado" };
    }

    const hashedPassword = crypto.createHash("md5").update(password).digest("hex");
    if (teacher.password !== hashedPassword) {
      return { success: false, message: "Contraseña incorrecta" };
    }

    const token = Buffer.from(`${user}:${password}`).toString("base64");
    return { success: true, token };
  } catch (error) {
    return { success: false, message: "Error en la autenticación" };
  }
}

module.exports = {
  authenticate,
};
