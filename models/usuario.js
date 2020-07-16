"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// crear un esquema

const usuarioSchema = mongoose.Schema({
  nombre: {
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
  password: {
      type: String,
      required: true,
  },
  registro: {
      type: Date,
      default: Date.now(),

  },
});

usuarioSchema.statics.hashPassword = function (plainPassword) {
  return bcrypt.hash(plainPassword, 10);

};

const Usuario = mongoose.model("Usuario", usuarioSchema);

//exportamos el modelo
module.exports = Usuario;
