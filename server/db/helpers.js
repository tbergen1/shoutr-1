var db = require('../db/sequelize.js');
var helpers = {};
//to be called from the requesthandlers to send the data to the database
//this is our interface between server and DB. 
helpers.addUser = function(userData) {
  db.User.create({
    username: userData.username,
    password: userData.password,
    email: userData.email
  });
};
helpers.addGroup = function(groupData) {
  db.Group.create({
    groupName: groupData.groupName
  });
};


helpers.addShout = function(shoutData) {
  //take in the shoutData from client (services.js)
  //query Group for the group ID
  //query Users for the user ID 
  //add the group and user IDs, plus the correct shoutData, 
    //to a new object
  //pass that object into the create fn and send to DB 
  
  //Promises are being nested below to ensure queries return before their data is used
  var shoutGroupID;
  var shoutCreatorID;
  var shoutRecipientID;
  db.Group.findOne({
    where: {groupName: shoutData.groupName}
  }).then(function(group){
    shoutGroupID = group.get('id');
    db.User.findOne({
      where: {username: shoutData.creator}
    })
    .then(function(creator){
      shoutCreatorID = creator.get('id');
      db.User.findOne({
        where: {username: shoutData.recipient}
    })
    .then(function(recipient){
        shoutRecipientID = recipient.get('id');
        return db.Shout.create({
         GroupId: shoutGroupID, 
         blurb: shoutData.blurb,
         story: shoutData.story,
         color: shoutData.color,
         UserId: shoutCreatorID,
         recipientId: shoutRecipientID
        }).then(function(shout){
        });
      })
    })
  });
  
};

//TEST OBJECT: 
// helpers.addShout({
//   groupName: "Tomz Group",
//   creator: 'Tom',
//   recipient: 'Tom',
//   blurb: 'bah',
//   story: 'THIS IS DIFFERENT',
//   color: "#1eabd9"
// });


// helpers.addUser({
//   username: 'Malek',
//   password: 'Malek',
//   email: 'malek@tom.com'
// });

helpers.addGroup({
  groupName: "Lizzzes groop"
});


module.exports = helpers;
