/*
 * GET home page.
 */

exports.info = function(req, res){

  var fs = require('fs');
  var file = __dirname + '/../setup/data.json';

  fs.readFile(file, 'utf8', function (err, data) {
    if (err) {
      console.log('Error: ' + err);
      return;
    }

    data = JSON.parse(data);

    var time = data.shift();
    var guide = data.shift();

    //do stuff:

    res.send('info', data);
  });

};

