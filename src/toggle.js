#! /usr/local/bin/iojs
'use strict';

const Service = require('totem-service').Service,
  commander = require('commander');


commander.version('0.0.1')
  .option('--port [80]','port to bind to',80)
  .option('--host [*]', 'host to bind to','*')
  .option('--container <containerId>', 'container to toggle')
  .option('--docker-socket <path>','path to docker socket', '/var/run/docker.sock')
  .parse(process.argv);

const docker = new require('dockerode')({ socketPath: commander.dockerSocket });

class Api extends Service {
  constructor(options) {
    super(options);
  }

  setupRoutes(app) {
  const self = this,
        container = docker.getContainer(self.options.container);
  app.get('/:action', function(req, res) { 
    if(!container[req.params.action]) {
     return res.status(404).end();
    }
    container[req.params.action](function(err,data){
      if(err) {
        console.log(err);
        res.status(500).end();
      } else 
        res.status(200).end();
      });
  });
  }
}

const api = new Api({'port':commander.port, 'host':commander.host, 'container':commander.container});
api.connect();
