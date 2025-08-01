const rateLimit = require('express-rate-limit');

const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 10,
    message: 'Too many requests created from this IP, please try again after 15 minutes',
    headers: true,
});

module.exports = { registerLimiter };