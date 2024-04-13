const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "unauthorized" });
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = decode;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "unauthorized" });
    }
};
module.exports = auth;