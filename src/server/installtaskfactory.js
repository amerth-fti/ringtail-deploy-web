
function createTasks(machines) {
  var tasks = machines
    .map(function(machine, index) {
      if(!machine.configId) return null;
      else {
        return {
          'task': '3-custom-ringtail',
          'options': {
            'name': 'Install ' + (machine.machineName || 'Machine ' + index),
            'data': {
              'machine': 'scope.me.machines[' + index + ']',
              'branch': 'scope.me.deployedBranch',
              'config': 'scope.configs[ ' + machine.configId + ']'
            }
          }
        };
      }
    })
    .filter(function(task) {
      return !!task;
    });
}

module.exports = {
  createTasks: createTasks
};