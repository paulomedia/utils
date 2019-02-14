"use strict";

const Joi      = require('joi'),
      mongoose = require('mongoose');

const name = 'Admin';
const schema = mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    scope: { type: String, required: true },
    active: { type: Boolean, required: true } 
});

module.exports = {
    name: name,
    schema: schema
};
