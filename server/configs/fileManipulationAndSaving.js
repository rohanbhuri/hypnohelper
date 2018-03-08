let fs = require('fs');
let path = require('path');
let imageDirectory = 'server/public/images/';
var gm = require('gm').subClass({
  imageMagick: true
})

exports.savingImageAndCreatingNames = function (req, res, assign) {
  if (req.body.image) {
    saveThisImage(req, res, (imagePath) => {
      assign(imagePath);
    });
  } else {
    assign(undefined);
  }
}

exports.updateOldAndExistingImage = function (req, res, imagePath, assign) {
  if (req.body.image) {
    if ((!(imagePath == null) || !(imagePath == undefined)) && req.body.profileImage.length > 100) {
      fs.unlinkSync(imagePath);
      saveThisImage(req, res, (imagePath) => {
        assign(imagePath);
      });
    } else if (imagePath == req.body.profileImage) {
      assign(imagePath);
    } else if ((imagePath == null || imagePath == undefined) && req.body.profileImage.length > 100) {
      saveThisImage(req, res, (imagePath) => {
        assign(imagePath);
      });
    }
  } else {
    assign(undefined);
  }
}




let saveThisImage = function (req, res, assignImagePath) {
  let base64Data = req.body.image.replace(/^data:image\/[a-z]+;base64,/, "");
  let img = new Buffer(base64Data, 'base64');
  let imageName = Math.random().toString(36).substring(7) + '.JPEG';
  let imagePath = imageDirectory + imageName
  gm(img)
    .resize(1000, 1000)
    .compress('JPEG')
    .write(imagePath, function (err) {
      if (err) {
        return res.json({
          status: false,
          message: err
        });
      }
      assignImagePath(imagePath);
    });
}
