#!/usr/bin/env node

var fs = require('fs');
var git = require('gift');
var mkdirp = require('mkdirp');
var readline = require('readline');


var dummy_repo = 'dummy-repo';


/*
var rs = fs.createReadStream("foo.txt")
  .on('error', function() {
    console.log("got rs: error event");
  })
  .on('end', function() {
    console.log("got rs: end event");
  })
  .on('close', function() {
    console.log("got rs: close event");
  })
;

var inf = readline.createInterface({input: rs})
  .on('line', function() {
    console.log("got inf: line event");
  })
  .on('close', function(data) {
    console.log("got inf: close event");
  })
;
//console.log("rs = %o", rs);
*/


var lineReader = function(file, line_handler) {
  return new Promise(function(resolve, reject) {
    var readstream_error = false;

    var rs = fs.createReadStream(file)
      .on('error', function() {
        readstream_error = true;
        this.emit('end');
      })
    ;

    var inf = readline.createInterface({input: rs})
      .on('line', function(line) {
        line_handler(line);
      })
      .on('close', function(data) {
        if (readstream_error) {
          reject("Error trying to open read stream for " + file);
        }
        resolve();
      })
      .on('end', resolve)
    ;
  });
};





var emails = [];
var p = lineReader('users.txt', function(line) {
  if (line != '') {
    //console.log("got " + line);
    emails.push(line);
  }
})

.then(
  function() {
    console.log("done");
    return emails;
  },
  function(err) {
    console.log('Error: ', err);
    process.exit(1);
  }
)

.then(function(emails) {
  console.log('emails: %o', emails);
})

;


/*
console.log("p = %o", p);

p.then(function() {
  console.log("foo");
});
/*

.then(function() {

  mkdirp(dummy_repo, function(err) {
    if (err) {
      throw "Failed to make directory " + dummy_repo;
    }

    git.init('dummy-repo', function(err, _repo) {
      if (err) {
        throw "Failed to initialize git repo"
      }
      console.log("repo: %o", _repo);
      repo = _repo;
    });

  });


})


*/