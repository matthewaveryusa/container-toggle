#! /usr/local/bin/iojs --harmony-classes

"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var Service = require("totem-service").Service,
    commander = require("commander");

commander.version("0.0.1").option("--port [80]", "port to bind to", 80).option("--host [*]", "host to bind to", "*").option("--container <containerId>", "container to toggle").option("--docker-socket <path>", "path to docker socket", "/var/run/docker.sock").parse(process.argv);

var docker = new require("dockerode")({ socketPath: commander.dockerSocket });

var Api = (function (_Service) {
  function Api(options) {
    _classCallCheck(this, Api);

    _get(Object.getPrototypeOf(Api.prototype), "constructor", this).call(this, options);
  }

  _inherits(Api, _Service);

  _createClass(Api, [{
    key: "setupRoutes",
    value: function setupRoutes(app) {
      var self = this,
          container = docker.getContainer(self.options.container);
      app.get("/:action", function (req, res) {
        if (!container[req.params.action]) {
          return res.status(404).end();
        }
        container[req.params.action](function (err, data) {
          if (err) {
            console.log(err);
            res.status(500).end();
          } else res.status(200).end();
        });
      });
    }
  }]);

  return Api;
})(Service);

var api = new Api({ port: commander.port, host: commander.host, container: commander.container });
api.connect();

