const Hapi = require('hapi');
const settings = require('config');
const plugins = require('./plugins');
const routes = require('./routes');
const models = require('./models');
const _ = require('lodash');
const mongoose = require('mongoose');


const server = new Hapi.Server({
    port: settings.port,
    host: settings.host,
    routes: {
        cors: {
            origin: ["*"],
            headers: ["Origin", "Content-Type", "Accept", "Authorization", "X-Request-With"]
        }
    }
});

// Export the server to be required elsewhere.
module.exports = server;


async function initDb() {
    return new Promise(resolve => {
        mongoose.connect(settings.database.host, { useNewUrlParser: true });

        var db = mongoose.connection;
        db.on('error', function (err) {
            console.log("Error accessing DB");
            console.log(err);
            process.exit(1);
        });
        db.once('open', function () {
            // we're connected!
            console.log("DB Connection success");
            //models = require('./models'); // Initialize models
            resolve();
        });
    });

}

/**
 * Validate user account.
 * Must be present in database and marked as enable
 *
 * @param decoded       decoded jwt received on each call
 * @param request
 * @param callback
 * @returns {Promise<*>}
 */
const validate = async function (decoded, request, callback) {

    try {

        let usr;

        if(request.path.indexOf('/admin/') !== -1) {
            usr = await models.User.findOne({_id: decoded.userid, active: true}).exec();
        } else if(request.path.indexOf('/user/') !== -1) {
            usr = await models.User.findOne({_id: decoded.userid, active: true}).exec();
        }

        if (_.isNil(usr)) {
            return {isValid: false};
        } else {
            return {isValid: true, credentials: usr};
        }

    } catch (e) {
        console.log(e);
        return {isValid: false};
    }
};

/**
 * Hapi server initialization
 *
 * @returns {Promise<void>}
 */
const init = async () => {

    // Plugins
    await server.register(plugins);

    // Auth strategy
    server.auth.strategy('jwt', 'jwt', {
        key: settings.jwtSecretKey,
        verifyOptions: {algorithms: ['HS256']},
        validate: validate
    });

    // API routes
    server.route(routes);

    await initDb();
    await server.start();

    server.log('info', 'Server running at: ' + server.info.uri);
    settings.defaultUri = server.info.uri;
};

init();
