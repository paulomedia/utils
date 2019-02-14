var userHome = process.env.HOME || process.env.USERPROFILE;

var configHome = __dirname,
    serverHome = configHome.replace(/[^\/]*$/g, '');

var host = '0.0.0.0',
    port = 3007,
    externalUrl = "https://external.com";

module.exports = {
    host: host,
    port: port,
    externalUrl: externalUrl,

    configHome: configHome,
    serverHome: serverHome,

    defaultUri: null,

    jwtSecretKey: 'Th1s1SmYs3Cr3tK3Y',
    jwtExpiresIn: '24h',

    cors: {
        origin: ["*"],
        headers: ["Origin", "Content-Type", "Accept", "Authorization", "X-Request-With"],
        credentials: true
    },


    fileSystem: {
        userHome: userHome,
        path: userHome + "/triodosData"
    },

    routes: {},

    views: {
        path: serverHome + '/views'
    }

};
