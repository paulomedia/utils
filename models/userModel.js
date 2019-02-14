"use strict";

const Joi      = require('joi'),
      mongoose = require('mongoose');

const name = 'User';
const schema = mongoose.Schema({
    email: { type: String, required: true },                // email
    productType: { type: Number, required: false },         // product 
    personal: {
        name: { type: String, required: false },            // nombre y apellidos
        document: { type: String, required: false },        // DNI / NIE
        files: { type: Array, required: false },            // ruta de las imagenes
        nacionality: { type: String, required: false },     // nacionalidad
        fiscalResidence: { type: String, required: false }, // residencia fiscal
        countryBirth: { type: String, required: false },    // pais de nacimiento
        birthDate: { type: String, required: false },       // fecha de nacimiento
        civilStatus: { type: String, required: false },     // estado civil
        iban: { type: String, required: false }             // IBAN Numero de cuenta de otra entidad
    },
    contact: {
        address: { type: String, required: false },         // domicilio
        phoneNumber: { type: String, required: false }      // teléfono
    },
    labor: {
        activity: { type: String, required: false },        // actividad personal
        sector: { type: String, required: false },          // sector
        contract: { type: String, required: false },        // tipo de contracto
        company: { type: String, required: false },         // Empresa
        income: { type: String, required: false }           // Ingresos anuales
    },
    password: { type: String, required: false },
    scope: { type: String, required: false },
    status: { type: String, required: false },
    dateTime: { type: String, required: false },
    validationCode: { type: String, required: false }
});

module.exports = {
    name: name,
    schema: schema
};
