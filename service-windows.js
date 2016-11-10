let Service;
let join = require('path').join;
let config = require('config.js');

try {
    Service = require('node-windows').Service;
} catch(err) {
    console.log('node-windows package not installed');
    console.log('please run while in the source directory:');
    console.log('npm install node-windows -g');
    console.log('npm link node-windows');
    process.exit(0);
}

let path = join(__dirname, '/src/server/server.js');

let svc = new Service({
  name: config.serviceName  || 'RingtailDeployWeb',
  description: 'Ringtail Deploy Web Service for deploying Ringtail.',
  script: path
});

let isAlreadyInstaller = svc.exists;


let arg = process.argv;

console.log('\RingtailDeployWeb Windows Service Creator');

if(arg.length <= 2) {
    help();
    process.exit(0);
}

svc.on('uninstall',function(){
  console.log('Uninstall complete.');
});

svc.on('install',function(){
  console.log('Install complete.');
    
  svc.start();
});

let switchVal = arg[2] || '';
switchVal = switchVal.replace('--','');

switch(switchVal) {
  case 'remove':
    svc.uninstall();
    break;

  case 'add':
    if(isAlreadyInstaller) {
      console.log('Service already installed');
      process.exit(0);
    }

    svc.install();
    break;

  case 'start':
    svc.start();
    break;

  case 'stop':
    svc.stop();
    break;

  default:
    help();
}

function help(){
    console.log('--remove   removes RingtailDeployWeb');
    console.log('--add      adds and starts RingtailDeployWeb');
    console.log('--start    starts RingtailDeployWeb');
    console.log('--stop     stops the RingtailDeployWeb');
    console.log('\nRun as: node service-windows --add');
}