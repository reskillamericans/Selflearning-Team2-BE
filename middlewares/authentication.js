const {decodedToken, decodeToken} = require('jwtServices.js')

exports.authenticateUser = (req,res,next) => {
    if(!req.headers.authorization) {                                   
        return res.status(401).json({message: "Unauthorized"})
    }
    let splittedHeader = req.headers.authorization.split(' ');
    
    if (splittedHeader[0] !== "Bearer") {
        return res.status(401).json({message: "Unauthorized <token>"})
    } 
    let token = splittedHeader[1];
    let decodedToken = decodeToken(token); 

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