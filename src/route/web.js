import express from "express";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', (rep, res) => {
        return res.send('Hello world')
    });
    return app.use("/", router);
}

module.exports = initWebRoutes;