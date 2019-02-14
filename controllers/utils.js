const Bcrypt = require('bcrypt');

exports.roundDecimal = value => {
    return Number(Math.round((value + 0.00001) * 100) / 100);
};

exports.getFileContentType = function (extension) {
    let contentType = '';
    switch (extension.toLowerCase()) {
        case 'pdf':
            contentType = 'application/pdf';
            break;
        case 'jpg':
            contentType = 'image/jpeg';
            break;
        case 'jpeg':
            contentType = 'image/jpeg';
            break;
        case 'png':
            contentType = 'image/png';
            break;
        case 'html':
            contentType = 'text/html';
            break;
        default:
            contentType = 'application/octet-stream';
    }

    return contentType;
};

exports.randomString = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

exports.hashPassword = password => {
    let salt = Bcrypt.genSaltSync(10);
    return Bcrypt.hashSync(password, salt);
};

exports.generateCode = num => {
    const caracteres = "ABCDEFGHJKMNPQRTUVWXYZ12346789"; let code = '';
    for (let i=0; i<num; ++i){
        code += caracteres.charAt(Math.floor(Math.random()*caracteres.length)); 
    } 
    return code;
};

exports.validateDocument = dni => {
    const regexDni = /^[XYZ]?\d{5,8}[A-Z]$/;
    let num, letraFinal, letra;
    
    dni = dni.toUpperCase();

    if ( regexDni.test(dni) ) {
        num = dni.substr(0, dni.length - 1);
        num = num.replace('X', 0);
        num = num.replace('Y', 1);
        num = num.replace('Z', 2);
        letraFinal = dni.substr(dni.length - 1, 1);

        num = num % 23;
        letra = 'TRWAGMYFPDXBNJZSQVHLCKET';
        letra = letra.substring(num, num + 1);

        if ( letra !== letraFinal ) {
            return false;
        }
        return true;
    } 
    return false;
};

exports.checkIBAN = iban => {
    return iban && iban.length === 24;
};