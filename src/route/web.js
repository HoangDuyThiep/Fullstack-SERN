import express from "express";
import homeControllers from "../controllers/homeControllers";
import userController from "../controllers/userController"


let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeControllers.getHomePage);
    router.get('/about', homeControllers.getAboutPage);
    router.get('/crud', homeControllers.getCRUD);

    router.post('/post-crud', homeControllers.postCRUD);
    router.get('/get-crud', homeControllers.displayGetCRUD);
    router.get('/edit-crud', homeControllers.getEditCRUD);
    router.post('/put-crud', homeControllers.putCRUD)
    router.get('/delete-crud', homeControllers.deleteCRUD)


    //res api
    router.post('/api/login', userController.handleLogin)
    router.get('/api/get-all-users', userController.handleGetAllUsers)
    router.post('/api/create-new-user', userController.handleCreateNewUser)
    router.put('/api/edit-user', userController.handleEditUser)
    router.delete('/api/delete-user', userController.handleDeleteUser) //restAPI

    return app.use("/", router);
}

module.exports = initWebRoutes;