const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const expiry =Number(process.env.JWT_EXPIRES_IN);

exports.createToken = (user) => {
    try {
        let token = jwt.sign({
            name: user.name,
            email: user.email,            
            role: user.role,
        }, secret, {expiresIn: 7200});
        return token
    } catch (err) {
        console.log(err)
        return null        
    }
}

exports.decodeToken =(token) => {
    try {
        let decodedToken = jwt.verify(token, secret);
        return decodedToken
    } catch (err) {
        console.log(err)
        return null        
    }
}

//This is used to create token model used for password reset
exports.createPwdToken = (token) => {
    try {
        let pwdToken = jwt.sign({
            userId: token.userId,
            token: token.token,            
            createdAt: token.createdAt,
        }, process.env.RESET_PASSWORD_KEY, {expiresIn: 600});
        return pwdToken
    } catch (err) {
        console.log(err)
        return null        
    }
}

exports.decodePwdToken =(token) => {
    try {
        let decodedPwdToken = jwt.verify(token, process.env.RESET_PASSWORD_KEY);
        return decodedPwdToken;
    } catch (err) {
        console.log(err)
        return null        
    }
}