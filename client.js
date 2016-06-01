var Client = (function() {
  var request = require('superagent');
  var md5     = require('blueimp-md5');

  var Client = function(email, password) {
    this.email    = email;
    this.password = password;
    this.baseURL  = 'https://api.placewise.com';
    this.session  = {};
    this.repo     = {};
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
    return new Promise(function(resolve, reject) {
      if (!self.session.auth_id) {
        self.login().then(function() {
          resolve();
        });
      }
    }).then(function(response) {
      params = params || {};
      params.page = params.page || { number: 1, size: 10 }
      params = self.__signParams(params);

      return self.__get(self.baseURL + '/' + path, params);
    });
  };

  Client.prototype.__signParams = function(params) {
    params.auth_id = this.session.auth_id;
    params.auth_timestamp = parseInt((new Date().getTime() / 1000), 10);
    params.auth_token = md5(params.auth_timestamp + ':' + this.session.auth_token);

    return params;
  };

  Client.prototype.__unpack = function(body) {
    var self = this;
    return new Promise(function(resolve, reject) {
      var type;
      if (Array.isArray(body.data)) {
        type = body.data[0].type;
        self.repo[type] = self.repo[type] || [];
        body.data.forEach(function(d) {
          self.repo[type].push(d);
        });
      } else {
        type = body.data.type;
        self.repo[type] = self.repo[type] || [];
        self.repo[type].push(body.data);
      }

      if (body.included) {
        body.included.forEach(function(d) {
          type = d.type;
          self.repo[type] = self.repo[type] || [];
          self.repo[type].push(d);
        });
      }

      resolve();
    });
  };

  Client.prototype.__get = function(url, params) {
    var self = this;
    return new Promise(function(resolve, reject) {
      request
        .get(url)
        .set('Accept', 'application/vnd.api+json')
        .query(params)
        .end(function(err, res) {
          if (err) {
            console.log('ERROR!', err);
            reject(err);
          }
          else {
            resolve(self.__unpack(res.body));
          }
        });
    });
  };

  return Client;
})();

module.exports = Client;
