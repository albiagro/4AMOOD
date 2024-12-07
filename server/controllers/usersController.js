var bodyparser = require('body-parser');
var ConnectDB = require('../public/assets/database/DBConnection.js');
var DBModels = require('../public/assets/database/DBModels.js');
const { createSecretToken } = require("../public/assets/token/generateToken.js");
const bcrypt = require("bcrypt")
const env = require("dotenv");
const jwt = require('jsonwebtoken');

env.config();

ConnectDB()

var jsonParser = bodyparser.json()

module.exports = function (app) {

  app.post("/users/login", jsonParser, async function (req, res) {
    const { username, password } = req.body;
  if (!(username && password)) {
    return res.status(400).json({ message: "All input is required!" });
  }
  const user = await DBModels.User.findOne({ username });

  if (!(user && (await bcrypt.compare(password, user.password)))) {
    return res.status(404).json({ message: "Invalid credentials!" });
  }
  const token = createSecretToken(user._id);
  const userLogged = {
    ...user._doc,
    token: token
  }
  
  res.json(userLogged);    
  });

  app.post("/users", jsonParser, async function (req, res) {

    if (!(req.body.name && req.body.surname && req.body.sex && req.body.username && req.body.email && req.body.password)) {
      return res.status(400).json({ message: "All input is required!" });
    }

    try {
      const oldUser = await DBModels.User.findOne({ username: req.body.username });

    if (oldUser) {
      return res.status(409).json({ message: "User already exists! Please login." });
    }
      
    const userWithSameEmail = await DBModels.User.findOne({ email: req.body.email });

    if (userWithSameEmail) {
      return res.status(409).json({ message: "E-mail already used!" })
    }

    const salt = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new DBModels.User({
      name: req.body.name,
      surname: req.body.surname,
      sex: req.body.sex,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    const token = createSecretToken(user._id);

    const userCreated = {
      ...user._doc,
      token: token
    }
    
    res.json(userCreated);

    } catch (error) {
      console.log("Error while registration: " + error)
    } 
  });

  app.put("/users", jsonParser, async function (req, res) {

    try {

    const userWithSameEmail = await DBModels.User.findOne({ email: req.body.email });

    if (userWithSameEmail) {
      return res.status(409).json({ message: "E-mail already used!" })
    }

    const salt = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    await DBModels.User.findOneAndUpdate({username: req.body.username}, {name: req.body.name, surname: req.body.surname, password: hashedPassword, email: req.body.email})

    } catch (error) {
      console.log("Error while updating user: " + error)
    } 
  });

  app.get('/user', async (req, res) => {
    const token = req.header('Authorization').split(' ')[1]

    if(token){
        const decode = jwt.verify(token, process.env.TOKEN_KEY);
        const user = await DBModels.User.findById({ _id: decode.id });

        if (user !== null) {
          const userVerified = {
            ...user._doc,
            token: token
          }
  
          res.json(userVerified);
        }
        else {
          res.json(null)
        }
        
    }else{
        res.json(null);
    }
});

};
