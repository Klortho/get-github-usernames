#!/usr/bin/env node

var fs = require('fs');
var git = require('gift');
var mkdirp = require('mkdirp');
var readline = require('readline');
var rimraf = require('rimraf');


var dummy_repo = 'dummy-repo';
var readme = dummy_repo + "/README.md";

rimraf.sync(dummy_repo);

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



var _sequence = Promise.resolve();


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

  mkdirp(dummy_repo, function(err) {
    if (err) {
      throw "Failed to make directory " + dummy_repo;
    }

    git.init(dummy_repo, function(err, repo) {
      if (err) {
        throw "Failed to initialize git repo"
      }

      fs.writeFile(readme, 'Initial line\n',
        function (err) {
          if (err) throw err;
          console.log('Repo initialized');

          _sequence.foo = 42;
          emails.reduce(function(sequence, email) {
            console.log("reduce, sequence = " + sequence + ", email = " + email +
              ", foo = " + sequence.foo);
            return sequence.then(function() {
              console.log("Start sequence for " + email);
              return new Promise(function(resolve, reject) {
                console.log("  Appending to readme: " + email);
                fs.appendFile(readme, email + "\n", function(err) {
                  console.log("  git add readme for " + email);
                  repo.add("README.md", function(err) {
                    if (err) {
                      console.log("*** Error for " + email + ": ", err);
                      reject(err);
                    }
                    console.log("  git commit for " + email);
                    repo.commit("commit from " + email,
                      {
                        author: "Dummy <" + email + ">"
                      },
                      function(err) {
                        console.log("after add, err = %o", err);
                        resolve();
                      });
                  });
                });
              });
            });
          }, _sequence);
          console.log("AFTER reduce, sequence = " + _sequence +
              ", foo = " + _sequence.foo);
        });

    });

  });


})

;

