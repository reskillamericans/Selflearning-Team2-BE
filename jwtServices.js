const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const expiry = 5;

exports.createToken = (user) => {
    try {
        let token = jwt.sign({
            name: user.name,
            email: user.email,
            phone: user.phone,
            password: user.password,
            role: user.role,
            courses: user.courses,
            steps: user.steps,
            availability: user.availability,
            channels: user.channels,
            platform: user.platform,
            address: user.address
        }, secret, {expiresIn: expiry});
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