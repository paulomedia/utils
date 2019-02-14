module.exports = {};
const models    = require('../models'),
      Boom      = require('boom'),
      Bcrypt    = require('bcrypt'),
      jwt       = require('jsonwebtoken'),
      settings  = require('config'),
      utils     = require('./utils'), 
      constants = require('./constants'),
      _         = require('lodash');

const create = async (request, h) => {
    try {
        let admin = await models.Admin.findOne( { email: request.payload.email } );

        if( !_.isNil(admin) ){
            return Boom.badRequest('Admin already exists');
        }

        let password = utils.hashPassword(request.payload.password);
        let adminData = {
            firstname: request.payload.firstname,
            lastname: request.payload.lastname,
            email: request.payload.email,
            password: password,
            scope: constants.SCOPE.ADMIN,
            active: true
        };
    
        return await models.Admin.create(adminData);

    } catch (e){
        return e;
    }
};

const authenticate = async (request, h) => {
    try {
        const admin = await models.Admin.findOne({ email:request.payload.email , active:true });

        if ( _.isNil(admin) ) {
            throw Boom.notFound('Admin not found');
        } 
        
        const isValid = await Bcrypt.compare(request.payload.password, admin.password);

        if ( isValid ) {
            let adminToken = jwt.sign({
                admin_id: admin._id,
                email: admin.email,
                scope: constants.SCOPE.ADMIN
            }, settings.jwtSecretKey, {algorithm: 'HS256', expiresIn: settings.jwtExpiresIn});

            // Uncomment to save cookie instead of being custom managed by client
            //request.cookieAuth.set({token: adminToken});

            return {
                email: admin.email,
                scope: constants.SCOPE.ADMIN,
                token: adminToken
            };

        } else {
            console.error('wrong credentials');
            throw Boom.unauthorized('Admin credentials incorrect or session expired');
        }
 
    } catch (e) {
        if (e.isBoom === true) {
            throw e;
        } else {
            throw Boom.internal();
        }
    }
};

const update = async (request, h) => {
    // TODO Get the request.auth.credentials.email instead of request.params.email
    try {
        const admin = await models.Admin.findOne({email: request.params.email, active: true});

        if ( !admin ) {
            throw Boom.conflict('Admin not found');
        }

        let password = utils.hashPassword(request.payload.password);
        let updateData = {
            email: admin.email,
            firstname: request.payload.firstname,
            lastname: request.payload.lastname,
            password: password
        };

        await models.Admin.updateOne( { email: request.params.email }, { $set: updateData } );

        return { result: 'ok' };

    } catch (e) {
        if (e.isBoom) {
            throw e;
        } else {
            throw Boom.internal();
        }
    }

};

const deleteAdmin = async (request, h) => {
    try {
        const admin = await models.Admin.findOne( { email: request.params.email } );

        if ( !admin ) {
            throw Boom.conflict('Admin not found');
        }

        await models.Admin.deleteOne( { email: request.params.email } );

        return { result: 'ok' };

    } catch (e) {
        if (e.isBoom) {
            throw e;
        } else {
            throw Boom.internal();
        }
    }
};

const getAdmins = async (request, h) => {

    let pagination = request.payload.pagination;
    let elementos = pagination.numElements;
    let page = pagination.page;
    let totalElements = await models.Admin.find().exec();
    
    try {
        return {
            Items: page > 0 ? await models.Admin.find().skip(page * elementos).limit(elementos).exec() : await models.Admin.find().limit(elementos).exec(),
            Count: totalElements.length
        };
    } catch (e){
        return e;
    }
};

const getAdmin = async (request, h) => {
    try {
        return await models.Admin.findOne( { email: request.params.email } );
    } catch (e){
        return e;
    }
};

module.exports.authenticate = authenticate;
module.exports.create = create;
module.exports.getAdmins = getAdmins;
module.exports.getAdmin = getAdmin;
module.exports.update = update;
module.exports.deleteAdmin = deleteAdmin;