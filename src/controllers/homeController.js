import db from '../models/index';
import CRUDService from '../services/CRUDService';

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();

        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        });
    } catch (err) {
        console.log(err);
    };
}

let about = (req, res) => {
    return res.render('about.ejs');
}

let getCRUD = (req, res) => {
    return res.render('crud.ejs');
}

let postCRUD =  async (req, res) => {
    let mess = await CRUDService.createNewUser(req.body)
    console.log(mess);
    return res.send("Post crud from sever")
};

let displayCRUD = async (req, res) => {
    let data = await CRUDService.getAllUsers()
    return res.render('displayCRUD.ejs', {
        data: data,
    });
};

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if(userId) {
        let userData = await CRUDService.getUserInfoById(userId);
        return res.render('editCRUD.ejs', {
            userData: userData,
        })
    } else {
        return res.send("User not found");
        
    }
};

let putCRUD = async (req, res) => {
    let data = req.body;
    let allUsers = await CRUDService.updateUserData(data);
    return res.render('displayCRUD.ejs', {
        data: allUsers,
    });
}

let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    if (id) {
        await CRUDService.deleteUserById(id);
        return res.send("Deleted successfully")
    }
    else {
        return res.send("User not found");
    }

};

module.exports = {
    getHomePage: getHomePage,
    about: about,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayCRUD: displayCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
}