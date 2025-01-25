var bodyparser = require("body-parser");
var DBModels = require("../public/assets/database/DBModels.js");
const {createRandomToken} = require("../public/assets/token/generateToken.js");
const env = require("dotenv");
const jwt = require("jsonwebtoken");
const { sendEmailVerification, sendGenericEmail } = require("../public/assets/emails/emailSender.js");

env.config();

var jsonParser = bodyparser.json();

module.exports = function (app) {
app.post("/notifications", jsonParser, async function (req, res) {
    
    //Default notification for new users
    const newNotification = new DBModels.Notification({
      ...req.body
    })

    await newNotification.save();

  })

  app.get("/notifications", async (req, res) => {
    const userOwner = req.query.user
    const notifications = await DBModels.Notification.find({userOwner: userOwner});

    res.json(notifications)
  });

  app.put("/notifications", jsonParser, async function (req, res) {
    
    const notificationID = req.query.ID

    // User has read the notification
    await DBModels.Notification.findOneAndUpdate(
      { _id: notificationID },
      {
        read : true
      }
    )

  })

  app.get('/verify/:token', (req, res)=>{
    const {token} = req.params;

    // Verifying the JWT token 
    jwt.verify(token, process.env.TOKEN_KEY, async function(err, decoded) {
        if (err) {
            return res.json({ message: "Email verification failed, possibly the link is invalid or expired!" });
        }
        else {
          await DBModels.User.findOneAndUpdate(
            { validationToken: token },
            { validationToken: "", active: true }
          )
          return res.json({ message: "Email verified successfully!" });
        }
    });
});

app.post('/verify/:username', jsonParser, async function (req, res) {

  try {
    const {username} = req.params;

  const tokenForEmailValidation = createRandomToken();

  // Updating DB in order to check then if token is passed correctly from frontend and so user can be validated
  await DBModels.User.findOneAndUpdate(
    { username: username },
    { validationToken: tokenForEmailValidation}
  )

  sendEmailVerification(req.body.email, req.body.name, tokenForEmailValidation);

  return res.json({ message: "New verification email sent!" });

  } catch (error) {
    console.log(error)
    return res.json({ message: "Error while sending new verification email: " + error });
  }

});

app.post('/emails', jsonParser, async function (req, res) {

  try {

    // Finding the user with username provided, in order to get his/her email
    const user = await DBModels.User.findOne({username: req.body.username})

    // Standard email for any email notification, to which I will append the message provided by frontend
  const messageForEmail = `Hi ${user.name},
  
${req.body.message}        
        
Kind Regards,
4AMood Support`

  sendGenericEmail(user.email, req.body.subject, messageForEmail);

  return res.json({ message: "Email sent!" });

  } catch (error) {
    console.log(error)
    return res.json({ message: "Error while sending email: " + error });
  }

});
}