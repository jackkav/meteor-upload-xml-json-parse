
var Images = new FS.Collection("images", {
  stores: [new FS.Store.FileSystem("images", {path: "C:/uploads"})]
});

if (Meteor.isClient) {
  Session.setDefault('result',0)

  Template.myForm.events({
    'change .myFileInput': function(event, template) {
      FS.Utility.eachFile(event, function(file) {
        Images.insert(file, function (err, fileObj) {
        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
      });
      });

    }
  });
  Template.task.helpers({
    thisTitle: function (id) {
      return Session.get("result"+id).title;
    },
    thisAuthor: function (id) {
      return Session.get("result"+id).author;
    },
    thisAbstract: function (id) {
      return Session.get("result"+id).abstract;
    },
    output: function (id) {
      var path = "http://localhost:3000"+Images.findOne({_id:id}).url();
      Meteor.call('convertXmlToJson', path, function(error, result) {
       if(error){
         console.log(error)
       }else{
        // console.log(result)
        Session.set('result'+id,result.root);
      }
    });
    }
  });

  Template.body.helpers({
    tasks: function () {
      return Images.find();
}

});

}

if (Meteor.isServer) {

  var getLocationAsync = function (path, cb){
    cb && cb(null, HTTP.get(path).content);
  };
  var getJsonFromXml = function (xml, cb){
    cb && cb(null, xml2js.parseString(xml));
  };
}

Meteor.methods({
  convertXmlToJson: function(path){
    var getLocationSync = Meteor.wrapAsync(getLocationAsync)
    var xml = getLocationSync(path)
    return  xml2js.parseStringSync(xml);
  }
});
