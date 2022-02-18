const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const low = require("lowdb");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const route = require("./routes/books");

const PORT = process.env.PORT || 4000;

const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({books:[]}).write();

const options = {
    definition: {
        openapi: "3.0.0",
        info:{
          title: "test swagger",
          version: "2.0",
          description: "this is another task on swagger"
        },
        servers:[
            {
                url: "http://localhost:8080"
            }
        ]
    },
    apis: ['./routes/*.js']
}
const spacs = swaggerJsDoc(options);
const app = express();
app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(spacs))

app.db = db;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/books',route)


app.listen(8080,()=>{
    console.log('http://localhost:8080/api-docs/')
})





