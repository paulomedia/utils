module.exports = {};
const models           = require('../models'),
      MailerController = require('./MailerController'),
      utils            = require('./utils'),
      constants        = require('./constants'),
      Boom             = require('boom'),
      Bcrypt           = require('bcrypt'),
      jwt              = require('jsonwebtoken'),
      config           = require('config'),
      moment           = require('moment'),
      _                = require('lodash'),
      uuidv4           = require('uuid/v4'),
      fs               = require('fs'),
      settings         = require('config');

const existDocument = (doc, users) => {
    for ( let i = 0; i < users.length; ++i ){
        if ( users[i].personal.document === doc ){
            return true;
        }
    }
    return false;
};

const sendForm = async (request, h) => {

    try {
        let user = await models.User.findOne({email: request.payload.email});
        
        let users = await models.User.find().exec();

        if ( _.isNil(user) ){
            throw Boom.notFound('User Not Found');
        }

        if ( user.validationCode !== 'OK' ){
            throw Boom.preconditionFailed('validationCode Not Acceptable');
        }

        if ( !utils.validateDocument(request.payload.personal.document) ){
            throw Boom.notAcceptable('document not valid');
        }

        if ( existDocument(request.payload.personal.document, users) ){
            throw Boom.conflict('document alrdeady register');
        }
    
        if ( !utils.checkIBAN(request.payload.personal.iban ) ){
            throw Boom.notAcceptable('iban not correct format');
        }

        if ( user.status === constants.USER_STATUS.COMPLETE ){
            throw Boom.notAcceptable('already sending the form');
        }
        
        let images = request.payload.personal.image;
        let files = [];

        images.forEach(image => {
            let ruta = uploadImage(image).image;
            files.push(ruta);
        });

        let inputData = request.payload;
        let updateData = {   
            productType: inputData.productType,                      // tipo de producto A o B ( cuenta corriente/ cuenta corriente + tarjeta débito )
            personal: {                                              // DATOS PERSONALES
                name: inputData.personal.name,                       // nombre y apellidos
                document: inputData.personal.document,               // DNI / NIE
                files: files,                                        // imagen del documento codificada en base64
                nacionality: inputData.personal.nacionality,         // nacionalidad
                fiscalResidence: inputData.personal.fiscalResidence, // residencia fiscal
                countryBirth: inputData.personal.countryBirth,       // pais de nacimiento
                birthDate: inputData.personal.birthDate,             // fecha de nacimiento format DD/MM/YYY
                civilStatus: inputData.personal.civilStatus,         // estado civil
                iban: inputData.personal.iban                        // IBAN Numero de cuenta de otra entidad
            },
            contact: {
                address: inputData.contact.address,                  // domicilio
                phoneNumber: inputData.contact.phoneNumber           // teléfono
            },
            labor: {                                                 // DATOS LABORALES
                activity: inputData.labor.activity,                  // actividad personal
                sector: inputData.labor.sector,                      // sector
                contract: inputData.labor.contract,                  // tipo de contracto
                company: inputData.labor.company,                    // Empresa
                income: inputData.labor.income                       // Ingresos anuales
            },
            status: constants.USER_STATUS.COMPLETE
        };

        await models.User.updateOne( { email: inputData.email }, { $set: updateData } );
        
        return { result: 'ok' }; 

    } catch (e){
        return e;
    }

};

const deleteUser = async (request, h) => {
    try {
        const user = await models.User.findOne( { email: request.params.email } );

        if ( !user ) {
            throw Boom.notFound('User not found');
        }

        await models.User.deleteOne( { email: user.email } );

        return { result: 'ok' };

    } catch (e) {
        if (e.isBoom) {
            throw e;
        } else {
            throw Boom.internal();
        }
    }
};

const validateCode = async (request, h) => {
    try {
        let user = await models.User.findOne( { validationCode: request.payload.validationCode } );

        if ( !user ) {
            throw Boom.notFound('User not found');
        }

        let registerDate = moment(user.dateTime);
        let actualDate = moment(new Date());
        let diff = actualDate.diff(registerDate, 'minutes');

        if ( diff >= 15 ){
            await models.User.deleteOne( { email: user.email } );
            throw Boom.preconditionFailed('validationCode not valid');
        } 

        let updateData = {
            validationCode: 'OK',
            status: constants.USER_STATUS.ACTIVE
        };

        await models.User.updateOne( { email: user.email }, { $set: updateData } );

        return { result: 'ok' }; 

    } catch (e){
        return e;
    }
};

const sendEmail = async (request, h) => {  
    try {
        let user = await models.User.findOne({email: request.payload.email});

        if ( !_.isNil(user) ){
            throw Boom.conflict('Email already exist');
        }

        let userData = {       
            email: request.payload.email,                                                      
            validationCode: utils.generateCode(8),
            scope: constants.SCOPE.USER,
            status: constants.USER_STATUS.PENDING,
            dateTime: moment().format()
        };

        let dataToSend = {
            email: request.payload.email,
            subject: 'Validation Account',
            templateFile: 'validateAccount.hbs',
            templateData: {
                code: userData.validationCode
            }
        };

        MailerController.sendMail(dataToSend);

        return await models.User.create(userData);

    } catch (e){
        return e;
    }
};

const getUsers = async (request, h) => {
    try {
        let pagination = request.payload.pagination;
        let elementos = pagination.numElements;
        let page = pagination.page;

        let totalElements = await models.User.find().exec();

        let users = [];

        if ( page > 0 ){
            users = await models.User.find().skip(page * elementos).limit(elementos).exec();
        } else {
            users = await models.User.find().limit(elementos).exec()
        }

        return {
            Items: users,
            Count: totalElements.length
        };
    } catch (e){
        return e;
    }
};

const base64Encode = file => {
    let bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString(constants.CONTENT_ENCODING.BASE64);
}

const getUser = async (request, h) => {

    try {
        let user = await models.User.findOne( { email: request.params.email } );

        if ( _.isNil(user) ){
            throw Boom.notFound('User not found');
        }
        
        let images = user.personal.files

        user.personal.files = images.map(image => {
            let extension = image.split('.')[1];
            return 'data:image/' + extension + ';base64,' + base64Encode(image);
        });

        return user; 

    } catch (e){
        return e;
    }
};

const createImageFolder = () => {
    let appFolder = settings.fileSystem.path;

    if ( !fs.existsSync(appFolder) ) {
        fs.mkdirSync(appFolder);
    }
};

const uploadImage = image => {

    if ( image ) {
        const ruta = settings.fileSystem.path;

        let base64 = image;
        const base64Data = new Buffer(base64.replace(/^data:image\/\w+;base64,/, ""), constants.CONTENT_ENCODING.BASE64);
        let extension = base64.split(';')[0].split('/')[1];
        if ( !extension || extension === '' || extension === 'jpeg' ){
            extension = 'jpg';
        }

        createImageFolder();

        let sourceFile = ruta + '/' + uuidv4() + '.' + extension;

        fs.writeFile(sourceFile, base64Data, err => {
            if ( err ){
                return Boom.conflict('Error generate file in folder');
            }
        }); 

        return { 
            image: sourceFile 
        };
            
    } else {
        console.error('Cannot copy the data file to the server');
        return Boom.expectationFailed('Cannot copy the data file to the server');
    }
};

module.exports.getUsers = getUsers;
module.exports.getUser = getUser;
module.exports.deleteUser = deleteUser;
module.exports.sendForm = sendForm;
module.exports.sendEmail = sendEmail;
module.exports.validateCode = validateCode;