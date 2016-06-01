var Client = (function() {
  var request = require('superagent');
  var md5     = require('blueimp-md5');

  var Client = function(email, password) {
    this.email    = email;
    this.password = password;
    this.baseURL  = 'https://api.placewise.com';
    this.session  = {};
  };

  Client.prototype.login = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
      request
      .post(self.baseURL + '/accounts/login')
      .send({
        data: {
          attributes: {
            email:    self.email,
            password: self.password
          }
        },
        type: 'accounts'
      })
      .set('Accept', 'application/vnd.api+json')
      .end(function(err, res) {
        if (err) {
          console.log('ERROR!', err);
          reject(err);
        }
        else {
          self.session.auth_id    = res.body.data.id;
          self.session.auth_token = res.body.data.attributes.authentication_token;
          resolve(res);
        }
      });
    })
  };

  Client.prototype.get = function(path, params) {
    var self = this;
    if (!self.session.auth_id) {
      self.login().then(function(res) {
        params = params || {};
        params.page = params.page || { number: 1, size: 10 }
        params = self.__signParams(params);

        return self.__get(self.baseURL + '/' + path, params);
      });
    }
    else {
      params = params || {};
      params.page = params.page || { number: 1, size: 10 }
      params = self.__signParams(params);

      return self.__get(self.baseURL + '/' + path, params);
    }
  };

  Client.prototype.__signParams = function(params) {
    params.auth_id = this.session.auth_id;
    params.auth_timestamp = parseInt((new Date().getTime() / 1000), 10);
    params.auth_token = md5(params.auth_timestamp + ':' + this.session.auth_token);

    return params;
  };

  Client.prototype.__get = function(url, params) {
    request
      .get(url)
      .set('Accept', 'application/vnd.api+json')
      .query(params)
      .end(function(err, res) {
        if (err) {
          console.log('ERROR!', err);
        }
        else {
          console.log('get', url, res.body)
          return res.body;
        }
      })
  };

  return Client;
})();

module.exports = Client;
