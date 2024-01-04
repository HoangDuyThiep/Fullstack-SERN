import db from "../models/index"
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        } catch (e) {
            reject(e)
        }

    })
}

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            let isExist = await checkUserEmail(email)
            if (isExist) {
                //user already exist
                let user = await db.User.findOne({
                    //loc nhung cot can lay ra
                    attributes: ['email', 'roleId', 'password'],
                    where: { email: email },
                    //tra ve object
                    raw: true
                });
                if (user) {
                    //compare password
                    let check = await bcrypt.compareSync(password, user.password); // false
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'Ok';
                        //xoa password truoc khi tra ve react
                        delete user.password;
                        console.log(user);
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User not found`;
                }
            } else {
                //return error
                userData.errCode = 1;
                userData.errMessage = `Your's Email isn't exist in my system, Plz try other email!`
            }
            resolve(userData)
        } catch (e) {
            reject(e)
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users)

        } catch (e) {
            reject(e)
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra xem email đã được sử dụng chưa
            let check;
            try {
                check = await checkUserEmail(data.email);
            } catch (checkError) {
                reject(checkError); // Xử lý lỗi trong quá trình kiểm tra email
                return;
            }

            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: "Your email has been used. Please try another email."
                });
                return;
            }

            // Hash mật khẩu và tạo một người dùng mới
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phonenumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId
            });

            resolve({
                errCode: 0,
                message: 'OK'
            });
        } catch (e) {
            reject(e);
        }
    });
};

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: false //khong ep sang object nua
            })
            if (user) {
                // Kiểm tra xem user có phương thức destroy không
                if (typeof user.destroy === 'function') {
                    //destroy chi xoa duoc khi raw: false
                    await user.destroy();
                    resolve({
                        errCode: 0,
                        message: `The user is deleted`
                    });
                } else {
                    resolve({
                        errCode: 3,
                        errMessage: `The user object does not have a valid destroy method`
                    });
                }
            } else {
                resolve({
                    errCode: 2,
                    errMessage: `The user isn't exist`
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra xem data.id có được định nghĩa và không phải là undefined không
            if (data.id === undefined) {
                resolve({
                    errCode: 2,
                    errMessage: "Invalid user ID"
                });
                return;
            }

            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })

            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;

                await user.save();
                resolve({
                    errCode: 0,
                    message: 'Update the user succeeds!'
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "User not found!"
                });
            }

        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData
}