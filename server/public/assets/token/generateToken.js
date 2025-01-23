require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.createSecretToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

module.exports.createRandomToken = () => {
  return jwt.sign({
    data: 'Token Data'  
}, process.env.TOKEN_KEY, { expiresIn: '10m' })
};