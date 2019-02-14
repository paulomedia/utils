const controllers = require('../controllers'),
      Joi         = require("joi");

module.exports = [

    // SYSTEM HEALTH
    {
        method: 'GET',
        path: '/healthCheck',
        config: {
            handler(request, h){
                return {status: 'ok'};
            },
            tags: ['api', 'Admin'],
            description: 'System health'
        }
    },

    // ADMIN CREATE
    {
        method: 'POST',
        path: '/admin/register',
        config: {
            handler: controllers.AdminController.create,
            tags: ['api', 'Admin'],
            description: 'Create User',
            validate: {
                payload: {
                    firstname: Joi.string().required().description('First Name'),
                    lastname: Joi.string().required().description('Last Name'),
                    email: Joi.string().email().required().description('Email'),
                    password: Joi.string().required().description("Password")
                }
            }
        }
    },

    // ADMIN UPDATE
    {
        method: 'PUT',
        path: '/admin/{email}',
        config: {
            handler: controllers.AdminController.update,
            tags: ['api', 'Admin'],
            description: 'Update the admin',
            /*
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            */
            validate: {
                params: {
                    email: Joi.string().email().required().description('Email')
                },
                payload: {
                    firstname: Joi.string().required().description('First Name'),
                    lastname: Joi.string().required().description('Last Name'),
                    password: Joi.string().required().description('Password')
                }
            }
        }
    },
    
    // ADMIN AUTH
    {
        method: 'POST',
        path: '/admin/authentication',
        config: {
            handler: controllers.AdminController.authenticate,
            tags: ['api', 'Admin'],
            description: 'Admin Auth',
            validate: {
                payload: {
                    email: Joi.string().email().required().description("Email"),
                    password: Joi.string().required().min(4).description("Password")
                }
            }
        }
    },

    // DELETE ADMIN
    {
        method: 'DELETE',
        path: '/admin/{email}',
        config: {
            handler: controllers.AdminController.deleteAdmin,
            tags: ['api', 'Admin'],
            description: 'Delete the admin', 
            /*
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            */
            validate: {
                params: {
                    email: Joi.string().required().description("Admin email")
                }
            }
        }
    },

    // GET ADMINS
    {
        method: 'POST',
        path: '/admin/admins',
        config: {
            handler: controllers.AdminController.getAdmins,
            tags: ['api', 'Admin'],
            description: 'Get a list of Admins',
            /*
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            }
            */
            validate: {
                payload: {
                    pagination: Joi.object().keys({
                        numElements: Joi.number().required().description("Number of elements"),
                        page: Joi.number().required().description("The Page yo are")
                    }).required().description("Pagination")
                }
            }
        }
    },

    // GET USERS
    {
        method: 'POST',
        path: '/admin/users',
        config: {
            handler: controllers.UserController.getUsers,
            tags: ['api', 'Admin'],
            description: 'Get a list of Users',
            /*
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            }*/
            validate: {
                payload: {
                    pagination: Joi.object().keys({
                        numElements: Joi.number().required().description("Number of elements"),
                        page: Joi.number().required().description("The Page yo are")
                    }).required().description("Pagination")
                }
            }
        }
    },

    // GET USER DETAIL
    {
        method: 'GET',
        path: '/admin/user/{email}',
        config: {
            handler: controllers.UserController.getUser,
            tags: ['api', 'Admin'],
            description: 'Get a user detail',
            /*
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            }*/
            validate: {
                params: {
                    email: Joi.string().email().required().description('User email')
                }
            }
        }
    },

    // DELETE USER
    {
        method: 'DELETE',
        path: '/admin/user/{email}',
        config: {
            handler: controllers.UserController.deleteUser,
            tags: ['api', 'Admin'],
            description: 'Delete a user',
            /*
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            }*/
            validate: {
                params: {
                    email: Joi.string().email().required().description('User email')
                }
            }
        }
    }

];
