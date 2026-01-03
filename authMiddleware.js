import jwt from 'jsonwebtoken';
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_strong_default_jwt_secret_key';

export const protect = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            // 1. Token decode karein
            const decoded = jwt.verify(token, JWT_SECRET);
            
            // 2. 🔴 LOGGING FOR PROOF
            console.log("-----------------------------------------");
            console.log(">>> [AUTH CHECK] User trying to access...");
            console.log(">>> ID extracted from Token:", decoded.id);
            console.log("-----------------------------------------");

            // 3. Request object mein ID daal dein
            // Ab pure server mein hum 'req.user.id' use karenge
            req.user = { id: decoded.id }; 
            
            next();
        } catch (error) {
            console.error(">>> [AUTH ERROR] Token invalid hai:", error.message);
            return res.status(401).json({ message: 'Token verify nahi hua.' });
        }
    } else {
        return res.status(401).json({ message: 'Authorization header missing hai.' });
    }
};