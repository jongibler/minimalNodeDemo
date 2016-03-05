var app = require('./app.js');

var multer = require('multer');
var s3 = require('multer-s3');

var mime = require('mime');
var upload = multer({
  storage: s3({
    dirname: 'demo',
    bucket: 'minimalnode',
    secretAccessKey: 'HZlvmyVxIykwlyvfqZouSG2Dh0t0QBRZsLnTe2Kg',
    accessKeyId: 'AKIAJ5OLJIYHQLBPSA2A',
    region: 'eu-west-1',
    contentType: s3.AUTO_CONTENT_TYPE,
    filename: function (req, file, cb) {
      var fileName = Date.now()+'.' + mime.extension(file.mimetype);
      cb(null, fileName);
      req.resultingFilename = fileName;
    }
  }),
  fileFilter: function (req, file, cb) {
    if (!file.originalname.endsWith('.pdf')) {
      return cb(new Error('Only pdfs are allowed'))
    }
    //TODO: additional security to validate it is actually a pdf

    cb(null, true)
  }
})

//example upload form:
app.get('/uploadPDF', function (req, res) {
    res.status(200)
        .send('<form method="POST" enctype="multipart/form-data">'
            + '<input type="file" name="file"/><input type="submit"/>'
            + '</form>');
})

app.post('/uploadPDF', upload.single('file'), function(req, res, next){
  var baseUrl = 'http://s3-eu-west-1.amazonaws.com/minimalnode/demo/';
  var fileUrl = baseUrl+req.resultingFilename;
  res.send(fileUrl);
});
