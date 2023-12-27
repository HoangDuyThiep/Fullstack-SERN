import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB"
import cors from "cors";

require('dotenv').config();

let app = express();
// Cấu hình CORS
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
//config app

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

viewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 6969;

app.listen(port, () => {
    //callback
    console.log("Backend nodejs is runging on the port: " + port);
})