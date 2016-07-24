require('dotenv').config();

module.exports = function(options) {
  options = options || {}

  var config = {
    environment: process.env.ENVIROMENT || 'develop',
    serviceName: process.env.SERVICE_NAME || 'default_service_name'
  };

  console.log('Will build using this configuration:');
  console.log(JSON.stringify(config, null, 2));

  return config;
};
