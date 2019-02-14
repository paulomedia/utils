const settings = require('config');
const mongoose = require('mongoose');
const _ = require('lodash');

mongoose.connect(settings.database.host, { useNewUrlParser: true });

var db = mongoose.connection;

let email = 'admin@triodos.com';

db.on('error', function (err) {
    console.log("Error accessing DB");
    console.log(err);
});
db.once('open', async function () {
    console.log("DB Connection success");
    models = require('../models');
    //let usr = await models.Admin.findOne({email: email, active: true});
    let usr = await models.Admin.findOne({email: email});
    if(!_.isNil(usr)){
        console.log('User already exists');
        process.exit(1);
    } else {
        models.Admin.create({
            firstname: 'Super',
            lastname: 'Admin',
            email: email,
            password: '$2b$10$/hCd23IHXyu.DlXIBaSVsOpt.fqiu5d3NYM4KyE4.l2OsL9kLIvxi',
            scope: 'admin',
            active: true
        }, (err, usr) => {
            if (err) console.log(err);
            // saved!
            console.log("Initial data loaded into DB");
            process.exit(0);

        });
    }
});
