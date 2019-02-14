var jwt = require('jsonwebtoken');
var settings = require('config');
var Bcrypt = require('bcrypt');


//var pw = 'rider';
var pw = process.argv.slice(2)[0];

var salt = Bcrypt.genSaltSync(10);
var encrypted = Bcrypt.hashSync(pw, salt);
//console.log('salt: ' + salt);
console.log('password Hash: ' + encrypted);



/*
var privateKey = settings.jwtSecretKey;
var userToken = jwt.sign({ username: 'manu', password: pw }, privateKey, { algorithm: 'HS256'} );
console.log("User Token: " + userToken);*/
