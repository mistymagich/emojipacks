
/**
 * Module dependencies.
 */

var isSubdomain = require('./valid').subdomain;
var isPassword = require('./valid').password;
var isEmail = require('./valid').email;
var isUri = require('valid-url').isUri;
var isAddOrRemove = require('./valid').addOrRemove;
var resolve = require('path').resolve;
var exists = require('fs').existsSync;
var prompt = require('co-prompt');
var chalk = require('chalk');


/**
 * Start.
 */

exports.start = function* () {
  var subdomain, email, password, pack, load, valid;
  subdomain = yield ask('Slack subdomain: ', isSubdomain, 'Uh oh! The subdomain should be at least one letter!');
  email = yield ask('Email address login: ', isEmail, 'Are you sure that is an email address? :)');
  password = yield ask('Password: ', isPassword, 'A password (as defined by this script) needs to have at least one character (not including you).');
  pack = yield ask('Path or URL of Emoji yaml file: ', isPath, 'Does the path to the yaml file look right? :)');
  addOrRemove = yield ask('Add(a) Or Remove(r): ', isAddOrRemove, 'choise "a" or "r"');
  load = {
    url: url(subdomain),
    email: email,
    password: password,
    pack: pack,
    addOrRemove: addOrRemove
  };
  return load;
}

/**
 * Prompt with validation.
 */

function *ask(message, valid, error) {
  var res;
  do {
    if (message.toLowerCase().indexOf('password') >= 0) res = yield prompt.password(message);
    else res = yield prompt(message);
    if (!valid(res)) err(error);
  } while (!(valid(res)));
  return res;
}

/**
 * is path
 */

function isPath(path) {
  return isUri(path) || exists(resolve(process.cwd(), path));
}

/**
 * Show error message.
 */

function err(message) {
  console.log(chalk.red(message));
}

/**
 * Url.
 */

function url(subdomain) {
  return 'https://' + subdomain + '.slack.com';
}
