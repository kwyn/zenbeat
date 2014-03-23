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


    var avg = 0;
    var return_data = [];

    for( var i = 0; i<data.length; i++ ){
      avg += data[i][1];
      return_data.push( data[i][1] );
    }

    var average = Math.floor( avg/data.length );

    var tt = data.length;

    //do stuff:
    var ret = {
      "totalTime" : tt,
      "average": average,
      "time" : time,
      "data" : data
    };

    res.send('info', ret);
  });

};

