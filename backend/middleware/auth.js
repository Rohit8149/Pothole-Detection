const jwt = require('jsonwebtoken');
const User = require('../models/User');


module.exports = async function(req, res, next) {
const authHeader = req.header('Authorization');
if (!authHeader) return res.status(401).json({ message: 'No token provided' });


const token = authHeader.replace('Bearer ', '');
try {
const decoded = jwt.verify(token, process.env.JWT_SECRET);
const user = await User.findById(decoded.id).select('-password');
if (!user) return res.status(401).json({ message: 'Invalid token' });
req.user = user;
next();
} catch (err) {
return res.status(401).json({ message: 'Token invalid or expired' });
}
};