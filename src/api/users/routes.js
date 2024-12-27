const routes = (handler) => [
    {
        method: 'POST',
        path: '/users',
        handler: handler.postUserHandler,
    },
    {
        method: 'GET',
        path: '/users/{id}',
        handler: handler.getUserByIdHandler,
    },
    {
        method: 'GET',
        path: '/list_employee',
        handler: handler.getListEmployee,
        options: {
            auth: 'avows_equity',
        },
    },
    {
        method: 'POST',
        path: '/post_data',
        handler: handler.postData,
        options: {
            auth: 'avows_equity',
            payload: {
                maxBytes: 1048576,
                output: 'stream',
                parse: true,
                multipart: true, 
            },
        },
    },
];

module.exports = routes;