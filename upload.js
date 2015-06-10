
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
      //console.log(Session.get("result"+id).journal-meta);
      return Session.get("title"+id);
    },
    thisAuthor: function (id) {
      return Session.get("author"+id);
    },
    thisAbstract: function (id) {
      return Session.get("abstract"+id);
   },
   output: function (id) {
    var path = "http://localhost:3000"+Images.findOne({_id:id}).url();
    var filename = Images.findOne({_id:id}).copies.images.key;
    var newPath = '/uploads/'+filename;
    Meteor.call('convertXmlToJson', newPath, function(error, result) {
     if(error){
       console.log(error)
     }else{
      // debugger
        // console.log(result.front['article-meta']['title-group']['article-title'])
        Session.set('title'+id,result.front['article-meta']['title-group']['article-title']);

        var auth = result.front['article-meta']['contrib-group']['contrib'][0]['name']['surname']['_Data'];

        Session.set('author'+id, auth);

        var abstract = result.front['article-meta']['abstract']["p"]['_Data'];


        // console.log(str);
        Session.set('abstract'+id, abstract);
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

}

Meteor.methods({
    convertXmlToJson: function(path){
    var xml = XML.parse(path);
    return  xml;
  }
});
