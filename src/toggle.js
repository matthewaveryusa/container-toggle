#! /usr/local/bin/node
'use strict';

var docker,
  Service = require('totem-service').Service,
  commander = require('commander'),
  api;

commander.version('0.0.1')
  .option('--port [80]','port to bind to',80)
  .option('--host [*]', 'host to bind to','*')
  .option('--container <containerId>', 'container to toggle')
  .option('--docker-socket <path>','path to docker socket', '/var/run/docker.sock')
  .parse(process.argv);

docker = require('docker.io')({ socketPath: commander.dockerSocket });

function Api(options) {
  Service.call(this,options);
};
Api.prototype = Object.create(Service.prototype);
Api.prototype.constructor = Api;
Api.prototype.setupRoutes = function(app) {
  var self = this;
  app.get('/start', function(req, res) { 
    docker.containers.start(self.options.container, {}, function(err,data){
      if(err) {
        res.status(500).end();
      } else 
        res.status(200).end();
      });
  });
  
  app.get('/stop', function(req, res) {
    docker.containers.stop(self.options.container, {}, function(err,data){
      if(err) {
        res.status(500).end();
      } else 
        res.status(200).end();
      });
  });
  app.get('/pause', function(req, res) { 
    docker.containers.pause(self.options.container, {}, function(err,data){
      if(err) {
        res.status(500).end();
      } else 
        res.status(200).end();
      });
  });
  
  app.get('/unpause', function(req, res) {
    docker.containers.unpause(self.options.container, {}, function(err,data){
      if(err) {
        res.status(500).end();
      } else 
        res.status(200).end();
      });
  });
};
api = new Api({'port':commander.port, 'host':commander.host, 'container':commander.container});
api.connect();
