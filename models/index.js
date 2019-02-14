"use strict";


var config = require("config"),
    mongoose = require('mongoose'),
    requireDirectory = require('require-directory'),
    models = {};


// Load all files and define the models
var moduleImports = requireDirectory(module);

Object.values(moduleImports).forEach(function (mod) {
    models[mod.name] = mongoose.model(mod.name, mod.schema);
});


module.exports = models;
