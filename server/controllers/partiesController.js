var bodyparser = require("body-parser");
var urlencodedParser = bodyparser.urlencoded({extended: false});
var ConnectDB = require("../public/assets/database/DBConnection.js");
var DBModels = require("../public/assets/database/DBModels.js");

ConnectDB();

var jsonParser = bodyparser.json();

module.exports = function (app) {
  app.post("/parties", jsonParser, async function (req, res) {
    if (
      !(
        req.body.userOrganizer &&
        req.body.title &&
        req.body.description &&
        req.body.address &&
        req.body.category &&
        req.body.latitude &&
        req.body.longitude &&
        req.body.date
      )
    ) {
      return res.status(400).json({ message: "All input is required!" });
    }

    try {
      
      const newParty = new DBModels.Party({
        ...req.body
      });
      const party = await newParty.save();

      return res.status(200).json(party);
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  });

  app.get("/parties/myparties", urlencodedParser, async function (req, res) {

    const userAsOrganizer = req.query.organizer
    const userPending = req.query.userToBeAccepted
    const userAsGuest = req.query.guest

    try {
      if (userAsOrganizer != null) {
        const data = await DBModels.Party.find({userOrganizer: userAsOrganizer, state: {$ne: 'canceled'}}).sort({date: 1})
        res.json(data)
      }
      else {
        const data = await DBModels.Party.find({userOrganizer: {$ne: userAsGuest}, state: {$ne: 'canceled'}, guests: {$elemMatch: {username: userAsGuest, accepted: true}}}).sort({date: 1})

        res.json(data)
      }
    } catch (error) {
      return res.status(400).json({ message: error });
    }     
  });

  app.get("/parties", urlencodedParser, async function (req, res) {

    const currentUser = req.query.currentUser
    const minLat = req.query.minLat
    const maxLat = req.query.maxLat
    const minLon = req.query.minLon
    const maxLon = req.query.maxLon
    const date = req.query.date
    const category = req.query.category

    let filter = {userOrganizer: {$ne: currentUser}, state: {$ne: 'canceled'}, latitude: {$gt:minLat, $lt: maxLat}, longitude: {$gt:minLon, $lt: maxLon}, date: date === "" ? {$gt: new Date()} : date}

    if (category != "") filter.category = category

    try {
        //Search for parties that I have not organized, according to the distance and date I set
        const data = await DBModels.Party.find(filter).sort({date: 1})
        res.json(data)
    } catch (error) {
      return res.status(400).json({ message: error });
    }     
  });

  app.get("/parties/:id", urlencodedParser, async function (req, res) {

    const partyID = req.params.id;

    const data = await DBModels.Party.findById(partyID);

    res.json(data);
    
  });

  app.put("/parties", jsonParser, async function (req, res) {

    const partyID = req.query.partyID
    const guest = req.body.guest

    try {
      // Update guests

      // Party is public and guest has set the partecipation
      if (req.body.add) {
        await DBModels.Party.updateOne(
          { _id: partyID },
          { $addToSet: {guests: guest} }
        )
      }

      // Party is private, guest has been approved I update the existing guest to accept it
      if (req.body.toAccept) {
        const guestToUpdate = {
          username: guest,
          accepted: true
        }
        
        await DBModels.Party.updateOne(
          { _id: partyID },
          { $pull: {guests: {username: guest}} }
        )
        await DBModels.Party.updateOne(
          { _id: partyID },
          { $addToSet: {guests: guestToUpdate} }
        )
      }

      // User has been not approved, or user has voluntarily removed the partecipation
      if (req.body.toAccept === false || req.body.remove) {
        await DBModels.Party.updateOne(
          { _id: partyID },
          { $pull: {guests: {username: guest}} }
        )
      }

      // If user organizer set the party to canceled status
      if (req.body.state === "canceled") {
        await DBModels.Party.updateOne(
          { _id: partyID },
          { state: req.body.state} 
        )
        
        return res.status(200).json({ message: "Party deleted successfully!" });
      }

      // Messages betweend users on party's details
      if (req.body.message) {
        await DBModels.Party.updateOne(
          { _id: partyID },
          { $addToSet: {messages: req.body.message} }
        )
      }

    } catch (error) {
      console.log(error)
      return res.status(400).json({ message: error });
    }

  })
};
