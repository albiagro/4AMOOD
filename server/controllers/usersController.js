var bodyparser = require("body-parser");
var urlencodedParser = bodyparser.urlencoded({extended: false});
var DBModels = require("../helpers/database/DBModels.js");
const {createSecretToken, createRandomToken} = require("../helpers/token/generateToken.js");
const bcrypt = require("bcrypt");
const env = require("dotenv");
const jwt = require("jsonwebtoken");
const { sendEmailVerification} = require("../helpers/emails/emailSender.js");
const { upload } = require("../helpers/files/multer.js");

env.config();

var jsonParser = bodyparser.json();

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
      token: token,
    };

    res.json(userLogged);
  });

  app.post("/users", jsonParser, async function (req, res) {
    if (
      !(
        req.body.name &&
        req.body.surname &&
        req.body.sex &&
        req.body.birthday &&
        req.body.username &&
        req.body.email &&
        req.body.password
      )
    ) {
      return res.status(400).json({ message: "All input is required!" });
    }

    try {
      const oldUser = await DBModels.User.findOne({
        username: req.body.username,
      });

      if (oldUser) {
        return res
          .status(409)
          .json({ message: "User already exists! Please login." });
      }

      const userWithSameEmail = await DBModels.User.findOne({
        email: req.body.email,
      });

      if (userWithSameEmail) {
        return res.status(409).json({ message: "E-mail already used!" });
      }

      const salt = 10;
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      //Default notification for new users
      const newNotification = new DBModels.Notification({
        userOwner: req.body.username,
        datetime: new Date(),
        message: "Welcome to 4AMood! Search new parties at page 'Find your party' or organize a new one at 'My parties!'",
        invite: false,
        partyID: null,
        userToBeAccepted: null,
        read: false
      })

      //Random token in order to validate user's email
      const tokenForEmailValidation = createRandomToken();

      const newUser = new DBModels.User({
        name: req.body.name,
        surname: req.body.surname,
        sex: req.body.sex,
        birthday: req.body.birthday,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        following: [],
        active: false,
        validationToken: tokenForEmailValidation,
        userProfileImagePath: ""
      });

      const user = await newUser.save();
      await newNotification.save();
      const token = createSecretToken(user._id);     

      const userCreated = {
        ...user._doc,
        token: token,
      };

      sendEmailVerification(req.body.email, req.body.name, tokenForEmailValidation);

      res.json(userCreated);
    } catch (error) {
      console.log("Error while registration: " + error);
    }
  });

  app.put("/users", jsonParser, async function (req, res) {
    try {

      // I'm just updating followers data and not user details
        if (req.body.userToUpdate) {

          if (req.body.userToFollow) {
            await DBModels.User.findOneAndUpdate(
              { username: req.body.userToUpdate },
              { $addToSet: {following: req.body.userToFollow} }
            )
            return res.status(200).json({ message: "Done!" });
          }
          else {
            await DBModels.User.findOneAndUpdate(
              { username: req.body.userToUpdate },
              { $pull: {following: req.body.userToRemove} }
            )
            return res.status(200).json({ message: "Done!" });
          }
        }
        else
        {
          const userWithSameEmail = await DBModels.User.findOne({
            email: req.body.email,
          });
    
          if (userWithSameEmail) {
            return res.status(409).json({ message: "E-mail already used!" });
          }
    
          const salt = 10;
          const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
          await DBModels.User.findOneAndUpdate(
            { username: req.body.username },
            {
              name: req.body.name,
              surname: req.body.surname,
              password: hashedPassword,
              email: req.body.email,
            }
          )
        }        

    } catch (error) {
      console.log("Error while updating user: " + error);
    }
  });

  app.post('/users/upload/:username', upload.single('profilePicture'), async (req, res) => {
    try {
      // response from upload.single which is the file location of the uploaded file
      const imageUrl = req.file.location;
      const usernameToUpdate = req.params.username
  
      await DBModels.User.findOneAndUpdate(
        { username: usernameToUpdate },
        {
          userProfileImagePath: imageUrl
        }
      )
  
      res.json({ message: 'Image successfully uploaded!'});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error while uploading image: ' + error });
    }
  });

  app.get("/user", async (req, res) => {
    const token = req.header("Authorization").split(" ")[1];

    if (token) {
      const decode = jwt.verify(
        token,
        process.env.TOKEN_KEY,
        async function (err, decode) {
          if (err) {
            // token expired!
            res.json(null);
          } else {
            const user = await DBModels.User.findById({ _id: decode.id });

            if (user !== null) {
              const userVerified = {
                ...user._doc,
                token: token,
              };

              res.json(userVerified);
            } else {
              res.json(null);
            }
          }
        }
      );
    } else {
      // no token at all
      res.json(null);
    }
  });

  app.get("/users/:username", urlencodedParser, async function (req, res) {
  
      const username = req.params.username
  
      try {
          //Search for users (not myself in order to show other users' details)
          const data = await DBModels.User.findOne({username: username})
          res.json(data)
      } catch (error) {
        return res.status(400).json({ message: error });
      }     
    });

    app.get("/users", urlencodedParser, async function (req, res) {
  
      const userFollowed = req.query.userFollowed
  
      try {
          //Search for users (not myself in order to show other users' details)
          const data = await DBModels.User.find({ "following": userFollowed })
          res.json(data)
      } catch (error) {
        return res.status(400).json({ message: error });
      }     
    });
  
};
