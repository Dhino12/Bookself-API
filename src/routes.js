const {
    addBookHandler,
    getAllBookHandler,
    getBookByIdHandler,
    updateBookByIdHandler,
    deleteBookByIdHandler,
} = require('./handler.js');

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addBookHandler,
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBookHandler,
    },
    {
        method: 'GET',
        path: '/books/{id}',
        handler: getBookByIdHandler,
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: updateBookByIdHandler,
    },
    {
        method: 'DELETE',
        path: '/books/{id}',
        handler: deleteBookByIdHandler,
    },
];

module.exports = routes;
