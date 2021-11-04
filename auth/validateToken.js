const jwt = require('jsonwebtoken'); 

module.exports = function(req, res, next) {
    const authHeader = req.headers["authorization"];
    console.log("authHeader:");
    console.log(authHeader);
    next();
}