import db from '../models/index'
import CRUDSevice from '../services/CRUDSevice';

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        });
    } catch (e) {
        console.log(e);
    }

}

let getAboutPage = (req, res) => {
    return res.render('test/about.ejs');
}

let getCRUD = (req, res) => {
    return res.render('crud.ejs')
}

let postCRUD = async (req, res) => {
    let message = await CRUDSevice.createNewUser(req.body)
    console.log(message)
    return res.send('post crud from server')
}

let displayGetCRUD = async (req, res) => {
    let data = await CRUDSevice.getAllUser();
    console.log('--------------------');
    console.log(data);
    console.log('--------------------');
    return res.render('display-CRUD.ejs', {
        dataTable: data
    })
}

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    console.log(userId);
    if (userId) {
        let userData = await CRUDSevice.getUserInfoById(userId);
        //check user data not fond
        return res.render('editCRUD.ejs', {
            user: userData
        });

    } else {
        return res.send('user not found!')

    }

}

let putCRUD = async (req, res) => {
    let data = req.body;
    let allUsers = await CRUDSevice.updateUserData(data);
    return res.render('display-CRUD.ejs', {
        dataTable: allUsers
    })
}

let deleteCRUD = async (req, res) => {
    let id = req.query.id;

    if (id) {

        await CRUDSevice.deleteUserById(id);
        let data = await CRUDSevice.getAllUser();
        return res.render('display-CRUD.ejs', {
            dataTable: data
        })
    } else {
        return res.send('user not found!')
    }
}

// object: {
//     key: "",
//     value
// }
module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
}