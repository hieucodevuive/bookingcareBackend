import db from "../models/index";
import bcrypt from 'bcryptjs'

const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
    return new Promise(async(resolve, reject) => {
        try {
            let userData = {};

            let isExist = await checkUserEmail(email)
            if(isExist) {
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password'],
                    where: {email: email},
                    raw: true,
                })
                if (user) {
                    let check =  await bcrypt.compareSync( password, user.password)
                    if(check) {
                        userData.errCode = 0;
                        userData.errMessage = "Password correct",
                        delete user.password;
                        userData.user = user;
                    }
                    else {
                        userData.errCode = 3;
                        userData.errMessage = "Password incorrect";
                    }
                }else {
                    userData.errCode = 2;
                    userData.errMessage = "User isn't exist!";
                }
            
            }else {
                userData.errCode = 1;
                userData.errMessage = "Your email isn't exist!";
            }

            resolve(userData);
        } catch (error) {
            reject(error);
        }
    })
}

let hashUserPassword = (password) => {
    return new Promise(async(resolve, reject) => {
       try{
           let hashPassword = await bcrypt.hashSync(password, salt);
           resolve(hashPassword);
       } catch(err){
           reject(err);
       }
    });
}

let checkUserEmail = (userEmail) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {
                    email: userEmail,
                }
            })
            if(user) {
                resolve(true);
            }else{
                resolve(false);
            }
            
        } catch (error) {
            reject(error);
        }
    })
}

let getAllUsers = async(id) => {
    try {
        let users = '';
        if(id === 'ALL') {
            users = await db.User.findAll({
                attributes: {
                    exclude: ['password'],
                }

            })
        }
        if(id && id !== 'ALL') {
            users = await db.User.findOne({
                where: {
                    id: id,
                },
                attributes: {
                    exclude: ['password'],
                }
            })
        }
        return users

    } catch (error) {
        console.log(error);
        return error;
    }
}

let getUserInfoById = (id) => {
    return new Promise( async(resolve, reject) => {
        try {
            let userInfo = await db.User.findOne({ 
                where : { 
                    id: id }, 
                raw: true});
            if (userInfo){
                resolve(userInfo);
            } else {
                resolve({})
            }
        } catch (error) {
            reject(error);
        }
    })
}

let createNewUser = async(data) => {
    try{
        let check = await checkUserEmail(data.email)
        if(check) {
            return ({
                errCode: 1,
                errMessage: "Email already exists",
            })
        }  else {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === "1" ? true : false,
                roleId: data.roleId,   
            })
            return ({
                errCode: 0,
                errMessage: "OK",
            })
        }
    } catch(err){
        console.log(err);
    }
};

let deleteUser = async(id) => {
    try {
        let user = await db.User.findOne({
            where: { id: id},
            raw: false
        })
        if(user) {
            await user.destroy();
            return ({
                errCode: 0,
                errMessage: "OK",
            }) 
        }
        else {
            return ({
                errCode: 1,
                errMessage: "User not found",
            })
        }
    } catch (error) {
        console.log(error);
    }
}

let updateUserData = async(data) => {
    try {
        if (!data.id) {
            return ({
                errCode: 2,
                errMessage: "Missing required",
            })
        }
        let user = await db.User.findOne({
            where: { id: data.id},
            raw: false,
        })
        if(user) {
            user.firstName = data.firstName
            user.lastName = data.lastName
            user.address = data.address

            await user.save()
            return ({
                errCode: 0,
                errMessage: "Update user successfully",
            }) 
    
        } else {
            return ({
                errCode: 1,
                errMessage: "User not found",
            })
         }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    getUserInfoById: getUserInfoById,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
}