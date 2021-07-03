const {decodedToken, decodeToken} = require('jwtServices.js')

exports.authenticateUser = (req,res,next) => {
    if(!req.headers.authorization) {                                   
        return res.status(401).json({err})
    }
    let splittedHeader = req.headers.authorization.split(' ');

    //this is going to decode the token
    if (splittedHeader[0] !== "Bearer") {
        return res.status(401).json({message: "Unauthorized <token>"})
    } 
    let token = splittedHeader[1];
    let decodedToken = decodeToken(token); 
    //check if token is valid and allow user continue with request if it is valid
        if (!decodedToken) {                                            
            return res.status(401).json({message: "Unauthorized"})
        }else {
            req.user = decodedToken;
            next()
        }    
}

exports.checkIfAdmin = (req, res, next) => {
    if(req.user.role !== "admin") {
        return res.status(401).json({message: "Unauthorized"})
    }
    return next()
}