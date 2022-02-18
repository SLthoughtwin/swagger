const express = require("express");
const route = express.Router();
const { nanoid } = require("nanoid");


const idLenght = 8;

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: The book title
 *         author:
 *           type: string
 *           description: The book author
 *       example:
 *         id: d5fE_asz
 *         title: The New Turing Omnibus
 *         author: Alexander K. Dewdney
 */

/**
 * get api
 */

/**
 * @swagger
 * /books:
 *    get:
 *       summary: Return list of book
 *       tags: [Book]
 *       responses: 
 *         200:
 *            description: list of book
 *            content:
 *                application/json:
 *                  schema:
 *                     type: array
 *                     items:
 *                        $ref: '#/components/schemas/Book'
 */
route.get('/',(req,res)=>{
    const books = req.app.db.get('books')
    res.send(books);
})

/**
 * @swagger
 * /books/{id}:
 *    get:
 *       summary: return book by id
 *       tags: [Books]
 *       parameters:
    *       - in: path
    *         name: id
    *         schema:
    *           type: string
    *         required: true
    *         description: The book id
 *       responses:
 *          200:
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Book'
 *          400:
 *             description: error
 *                      
 */
route.get('/:id',(req,res)=>{
    const book = req.app.db.get('books').find({id:req.params.id}).value();
    res.send(book);
})


    
/**
 * @swagger
 * /books:
 *   post:
 *     summary: create new book
 *     tags: [Book]
 *     requestBody: 
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: book successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: error  
 * 
 */


route.post('/',(req,res)=>{
    try{
        const book = {
            id: nanoid(idLenght),
            ...req.body,
        };
        // console.log(req.app.db.get("books"));
       const result =  req.app.db.get("books").push(book).write();
       res.send(result);
    }catch(error){
        res.status(500).send(error);
        console.log(error)
    }
})

/**
 * @swagger
 * /books/{id}:
 *   patch:
 *      summary: update recored
 *      tags: [Book]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: book update by id
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Book'
 *      responses:
 *        200:
 *          description: update book successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Book'
 *        400:
 *          description: update error
 */
route.patch('/:id',(req,res)=>{
    try{
        console.log(req.body);
        const update = req.app.db.get("books").find({id : req.params.id}).assign(req.body).write();
        const result = (req.app.db.get('books').find({id : req.params.id}));
        res.send(result);
        // console.log(result);
    }catch(error){
        res.status(500).send(error);
    }
})

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *      summary: delete book by id
 *      tags: [Book]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: delete book by id
 *      responses:
 *       200:
 *          description: delete data by id
 *          content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Book'
 *      400:
 *         description: delete error  
 * 
 */
route.delete('/:id',(req,res)=>{
    try{
        const book = req.app.db.get('books').remove({id : req.params.id}).write();
        res.send(book);
    }catch(error){
      res.status(500).send(error);
    }

})

module.exports = route



