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