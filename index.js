import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from './Routers/userRouter.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import YAML from 'yamljs';

const app = express();
dotenv.config();



mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('бд готова');
  })
  .catch((err) => {
    console.log(err.message);
  });
app.get('/',(req,res)=>{
    console.log('server is starting ');
})
app.use(express.json());
app.use('/api/users',userRouter);
const swaggerFile = YAML.load('./swagger.yaml'); // или './swagger.json', в зависимости от вашего формата файла
const specs = swaggerJsdoc({
    swaggerDefinition: swaggerFile,
    apis: [], // Путь или список путей к вашим файлам с маршрутами
});

// Используйте middleware swaggerUi
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));



const port= process.env.PORT || 8000;
app.listen(port,()=>{console.log(`server start at http://localhost:${port}`)})