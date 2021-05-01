const { nanoid } = require('nanoid');
const { detailBooks, shortBooks } = require('./books');

const addBookHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;
    const nameIsEmpty = name === undefined || name.length === 0 || name === '';
    const readPageGreaterThan = readPage > pageCount;

    if (!nameIsEmpty && !readPageGreaterThan) {
        const id = nanoid(16);
        const insertedAt = new Date().toISOString();
        const updatedAt = insertedAt;
        const finished = pageCount === readPage;

        const newBooks = {
            id,
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            insertedAt,
            updatedAt,
        };

        detailBooks.push(newBooks);
        shortBooks.push({ id, name, publisher });

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    if (nameIsEmpty) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if (readPageGreaterThan) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
    });

    response.code(500);
    return response;
};

const getAllBookHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    if (name !== undefined) {
        const books = shortBooks.filter((book) => book.name.toLowerCase()
            .indexOf(name.toLowerCase()) >= 0);

        const response = h.response({
            status: 'success',
            data: {
                books,
            },
        });
        response.code(200);
        return response;
    }

    if (reading !== undefined) {
        const books = detailBooks.filter((book) => book.reading == reading).map((book) => {
            const shortBook = { id: book.id, name: book.name, publisher: book.publisher };
            return shortBook;
        });

        const response = h.response({
            status: 'success',
            data: {
                books,
            },
        });
        response.code(200);
        return response;
    }

    if (finished !== undefined) {
        const books = detailBooks.filter((book) => book.finished == finished).map((book) => {
            const shortBook = { id: book.id, name: book.name, publisher: book.publisher };
            return shortBook;
        });

        const response = h.response({
            status: 'success',
            data: {
                books,
            },
        });
        response.code(200);
        return response;
    }

    const books = shortBooks;
    const response = h.response({
        status: 'success',
        data: {
            books,
        },
    });
    response.code(200);
    return response;
};

const getBookByIdHandler = (request, h) => {
    const { id } = request.params;
    console.log(`id adalah ${request.params}`);
    const book = detailBooks.filter((n) => n.id === id)[0];

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

const updateBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const {
        name, year, author,
        summary, publisher,
        pageCount, readPage, reading,
    } = request.payload;
    const updatedAt = new Date().toISOString();

    const nameIsEmpty = name === undefined;
    const readPageGreaterThan = readPage > pageCount;

    const index = detailBooks.findIndex((book) => book.id === bookId);
    console.log(`Index buku ${index}`);

    if (!nameIsEmpty && !readPageGreaterThan && index !== -1) {
        detailBooks[index] = {
            ...detailBooks[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    if (nameIsEmpty) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if (readPageGreaterThan) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteBookById = (request, h) => {
    const { id } = request.params;

    const index = detailBooks.findIndex((book) => book.id === id);
    if (index !== -1) {
        detailBooks.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });

        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {
    addBookHandler,
    getAllBookHandler,
    getBookByIdHandler,
    updateBookByIdHandler,
    deleteBookById,
};
