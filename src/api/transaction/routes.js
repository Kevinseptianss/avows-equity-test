const routes = (handler) => [
    {
        method: 'POST',
        path: '/post_data',
        handler: handler.postTransactionHandler,
        options: {
            payload: {
                maxBytes: 1048576,
                output: 'stream',
                parse: true,
                multipart: true, 
            },
        }
    },
]

module.exports = routes;
