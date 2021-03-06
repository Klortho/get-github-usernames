#!/usr/bin/env node

var fs = require('fs');
var git = require('gift');
var lineReader = require('@klortho/line-reader')
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

var dummy_repo = 'dummy-repo';
var readme = dummy_repo + "/README.md";

rimraf.sync(dummy_repo);

var emails = [];
var p = lineReader('users.txt', function(line) {
  if (line != '') {
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

.then(
  function(emails) {
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

            emails.reduce(function(sequence, email) {
              return sequence.then(function() {
                console.log("Start sequence for " + email);
                return new Promise(function(resolve, reject) {
                  console.log("  Appending to readme: " + email);
                  fs.appendFile(readme, "line\n", function(err) {
                    console.log("  git add readme: " + email);
                    repo.add("README.md", function(err) {
                      if (err) {
                        reject(err);
                      }
                      console.log("  git commit: " + email);
                      repo.commit("dummy commit by " + email,
                        {
                          author: "Dummy <" + email + ">"
                        },
                        function(err) {
                          console.log("  done: " + email);
                          if (err) reject(err);
                          else resolve();
                        });
                    });
                  });
                });
              });
            }, Promise.resolve());
          });
      });
    });
  },
  function(err) {
    console.log("*** Error: " + err);
  }
);

