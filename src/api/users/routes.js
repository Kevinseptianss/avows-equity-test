const routes = (handler) => [
    {
        method: 'GET',
        path: '/list_employee',
        options: {
            log: { collect: true },
          },
        handler: handler.getUsersHandler,
    },
]

module.exports = routes;
