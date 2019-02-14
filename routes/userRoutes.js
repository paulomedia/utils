const controllers = require('../controllers'),
      Joi         = require("joi");

module.exports = [

    // USER SEND FORM
    {
        method: 'POST',
        path: '/user/sendForm',
        config: {
            handler: controllers.UserController.sendForm,
            tags: ['api', 'User'],
            description: 'Send form',
            validate: {
                payload: {                   
                    email: Joi.string().email().required().description('Email'),                 // Correo electrónica
                    productType: Joi.number().required().description('Product Type 0/1'),        // Product (cuenta corriente/cuenta corriente + targeta débito)
                    personal: {                                                                  // DATOS PERSONALES
                        name: Joi.string().required().description('Name'),                       // nombre y apellidos
                        document: Joi.string().required().description('Document'),               // DNI / NIE
                        image: Joi.array().description('base64 Encoded image front/back'),       // imagen del documento codificada en base64
                        nacionality: Joi.string().required().description('Nacionality'),         // nacionalidad
                        fiscalResidence: Joi.string().required().description('FiscalResidence'), // residencia fiscal
                        countryBirth: Joi.string().required().description('Country Birth'),      // pais de nacimiento
                        birthDate: Joi.string().required().description('Birth Date'),            // fecha de nacimiento
                        civilStatus: Joi.string().required().description('Civil Status'),        // estado civil
                        iban: Joi.string().required().description('IBAN')                        // IBAN Numero de cuenta de otra entidad
                    },
                    contact: {                                                                   // DATOS DE CONTACTO
                        address: Joi.string().required().description('Address'),                 // domicilio
                        phoneNumber: Joi.string().required().description('Phone Number')         // teléfono  
                    },
                    labor: {                                                                     // DATOS LABORALES
                        activity: Joi.string().required().description('Personal Activity'),      // actividad personal
                        sector: Joi.string().required().description('Sector'),                   // sector
                        contract: Joi.string().required().description('Contract Type'),          // tipo de contracto
                        company: Joi.string().required().description('Company'),                 // Empresa
                        income: Joi.string().required().description('Anual Income')              // Ingresos anuales
                    }            
                }
            }
        }
    },

    // SEND EMAIL
    {
        method: 'POST',
        path: '/user/sendEmail',
        config: {
            handler: controllers.UserController.sendEmail,
            tags: ['api', 'User'],
            description: 'Send email to registe user',
            validate: {
                payload: {
                    email: Joi.string().email().required().description('Email')
                }
            }
        }
    },

    // VALIIDATION CODE
    {
        method: 'POST',
        path: '/user/validateCode',
        config: {
            handler: controllers.UserController.validateCode,
            tags: ['api', 'User'],
            description: 'User Validate Code',
            validate: {
                payload: {
                    validationCode: Joi.string().required().description("validation Code")
                }
            }
        }
    }

];
