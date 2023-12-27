import userService from "../services/userService"


let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter!'
        })
    }

    let useData = await userService.handleUserLogin(email, password);

    //check email exist >> compare password >> userInfor, access_token:JWT 
    return res.status(200).json({
        errCode: useData.errCode,
        message: useData.errMessage,
        user: useData.user ? useData.user : {}
    })
}

module.exports = {
    handleLogin: handleLogin
}