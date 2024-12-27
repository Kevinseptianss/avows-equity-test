const AuthenticationsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
    name: 'auth',
    version: '1.0.0',
    register: async (server, {
        auth,
        users,
        tokenManager,
        validator,
    }) => {
        const authenticationsHandler = new AuthenticationsHandler(
            auth,
            users,
            tokenManager,
            validator,
        );
    
        server.route(routes(authenticationsHandler));
    },
};