import { Router } from "express";
import { BooksController } from "../controllers/book.js";
import { upload } from "../middlewares/upload.js";
import { verifyToken } from "../middlewares/auth.js";

import { s3 } from "../config/s3.js";

export const createBooksRoutes = (booksModel, isLocal = false) => {
    const routesBook = Router();
    const booksController = new BooksController(booksModel, isLocal);


    routesBook.get("/genres", async (req, res) => {
        const response = await booksController.getGenres();
        res.status(response.code).json(response);
    });


    routesBook.get("/favorites/count", async (req, res) => {
        const response = await booksController.countFavorites();
        res.status(response.code).json(response);
    });


    routesBook.get("/favorites/:userId", verifyToken, async (req, res) => {
        const { userId } = req.params;
        const response = await booksController.getFavoritesByUserId(userId);
        res.status(response.code).json(response);
    });


    routesBook.post("/favorites", verifyToken, async (req, res) => {
        const { userId, bookId } = req.body;
        const response = await booksController.addFavorite(userId, bookId);
        res.status(response.code).json(response);
    });


    routesBook.delete("/favorites", verifyToken, async (req, res) => {
        const { userId, bookId } = req.body;
        const response = await booksController.removeFavorite(userId, bookId);
        res.status(response.code).json(response);
    });

    routesBook.get("/", async (req, res) => {
        const response = await booksController.getAllBooks(req.query);
        res.status(response.code).json(response);
    });


    routesBook.post(
        "/",
        verifyToken,
        upload.single("portada"),
        async (req, res) => {
            try {
                let bookData = req.body;
                if (req.file) {
                    const uploadParams = {
                        Bucket: process.env.AWS_S3_BUCKET_NAME,
                        Key: `book-cover/${Date.now()}_${req.file.originalname}`,
                        Body: req.file.buffer,
                        ContentType: req.file.mimetype,
                        ACL: 'public-read',
                    };
                    const s3Response = await s3.upload(uploadParams).promise();
                    bookData.portada = s3Response.Location;
                }

                const response = await booksController.createBook(bookData);
                res.status(response.code).json(response);
            } catch (error) {
                console.error("Error subiendo imagen a S3:", error);
                res.status(500).json({ message: "Error al subir la imagen a S3" });
            }
        }
    );


    routesBook.put(
        "/:id",
        verifyToken,
        upload.single("portada"),
        async (req, res) => {
            try {
                const { id } = req.params;
                let bookData = req.body;

                if (req.file) {
                    const uploadParams = {
                        Bucket: process.env.AWS_S3_BUCKET_NAME,
                        Key: `book-cover/${Date.now()}_${req.file.originalname}`,
                        Body: req.file.buffer,
                        ContentType: req.file.mimetype,
                        ACL: 'public-read',
                    };


                    const s3Response = await s3.upload(uploadParams).promise();
                    bookData.portada = s3Response.Location;
                }

                const response = await booksController.updateBook(id, bookData);
                res.status(response.code).json(response);
            } catch (error) {
                console.error("Error subiendo imagen a S3:", error);
                res.status(500).json({ message: "Error al subir la imagen a S3" });
            }
        }
    );

    routesBook.patch(
        "/:id",
        verifyToken, 
        async (req, res) => {
            const { id } = req.params;
            const response = await booksController.patchBook(id, req.body);
            res.status(response.code).json(response);
        }
    );

    
    routesBook.delete(
        "/:id",
        verifyToken, 
        async (req, res) => {
            const { id } = req.params;
            const response = await booksController.deleteBook(id);
            res.status(response.code).json(response);
        }
    );


    routesBook.get("/:id", async (req, res) => {
        const { id } = req.params;
        const response = await booksController.getBookById(id);
        res.status(response.code).json(response);
    });

    return routesBook;
};
