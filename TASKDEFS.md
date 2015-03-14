# Deploy Task Definitions

Deployment tasks use a JSON format that gets evaluated by a task runner.  The task runner executes on the server .  Each environment has a deployment task definition that can be customized to interact with Skytap and with the Ringtail Installation Service.  This guide will explain each task type and provide examples of common usages.

The task editor user interface provides the user with required data fields for the task

## Understanding the Task Runner

The task runner has a scripting interface that can be interpretted at runtime to load and manipulate the environment that a task is running under. This gives the ability to chain outputs from tasks together and create a complex redeployment process.

The task runner uses a `scope` object that is shared between tasks and allow tasks to pass data to the next steps.  When a task starts it will evaluate the values stored in the `config.data` properties. Because it is performing a JavaScript `eval` operation, primitive types, object references, and function executions can be stored in `config.data`.  You can also reference other objects on the scope chain.  

The task runner automatically puts the current environment record onto the scope chain under the `me` property.  

The general format for TaskDefinitions is:
```
{
  "taskdefs": [
    {
      "task": "type-of-task",
      "options": {
        "name": "Name of task",
        "storeIn": "Store output into this scope variable"
        "data": {
          // key/values where the value is evaluated into a variable on the task
          // refer to the subsequent documentation for the required data fields
        }
      }
    }
  ]
}
```

For example, in the first task you could load the newest skytap template and store it in the `scope` variable called `template` by setting the `storeIn` value under the task options. In a subsequent task, you could create an environment from that template by setting the `data` property for `template_id` to `scope.template.id`.  This would look like:

```
{
  "taskdefs": [
    {
      "task": "2-get-template",
      "options": {
        "name": "Find newest template",
        "storeIn": "template",
        "data": {
          "template_id": "newest",
          "project_id": "33648"
        }
      }
    },
    {
      "task": "2-create-environment",
      "options": {
        "name": "Create new environment",
        "storeIn": "newEnv",
        "data": {
          "template_id": "scope.template.id"
        }
      }
    }
  ]
}
```



# Tasks

## Logger (1-logger)

This task is a simple logging task that writes to the logging mechanism. 

Data properties:
`messages` - the message to log

Outputs: 
No output

Example:


## Update Environment Database Record (1-update-environment)

This task will update the database record to match a supplied Skytap machine by syncing the id's for the environment and all VM's.

Data:
`skytapEnv` - Reference to the skytap environment
`env` - Reference to the deployer environment

Outputs:
The updated deployer environment after successfully saving to the database

Example:
```
{
  "task": "1-update-environment",
  "options": {
    "name": "Update environment record",
    "storeIn": "scope.me",
    "data": {
      "skytapEnv": "scope.skyapEnv",
      "env": "scope.me"
    }
  }
}
```


## Update Expressions (1-update-expressions)

This task will apply the changes to the deployer environment that are specified in it's update property.

This task is not currently in use and needs to completed.

Data:
`update` - The update statements that should be performed
`env` - Reference to the deployer environment

Output:
The updated deployer environment after successfully saving to the database

Example:
```
{
  "task": "1-update-expressions",
  "options": {
    "name": "Update environment properties",
    "storeIn": "scope.me",
    "data": {
      "env": "scope.me",
      "update": { 
        "envName": "New name",
        "envDesc": "function(env, prop) { }"
      }
    }
  }
}
```

## Wait (1-wait)

This task will wait for the number of seconds before moving onwards.

Data:
`seconds` - The number of seconds to wait before moving on

Output:
None

Example: 
```
{
  "task": "1-wait",
  "options": {
    "name": "Wait 10 seconds",
    "data": {
      "seconds": 10
    }
  }
}
```

## Skytap - Add environment to project (2-add-to-project)

This task adds an environment to a project

Data:
`project_id` - the project id to add the environment to
`configuration_id` - the environment to add to the project

Output:
None

Example:
```
{
  "task": "2-add-to-project",
  "options": {
    "name": "Add to Project",
    "data": {
      "project_id": 123,
      "configuration_id": "scope.skytapEnv.id"
    }
  }
}
```

## Skytap - Create environment (2-create-environment)

This task will create an environment from a template

Data:
`template_id` - the Skytap template id to create the environment from

Output:
The skytap environment object

Example:
```
{
  "task": "2-create-environment",
  "options": {
    "name": "Create new environment",
    "storeIn": "newEnv",
    "data": {
      "template_id": "scope.template.id"
    }
  }
}
```

## Skytap - Delete environment (2-delete-environment)

This task will delete an environment

Data:
`configuration_id` - the Skytap environment identifier to delete

Output:
The deleted Skytap environment object

Example:
```
{
  "task": "2-delete-environment",
  "options": {
    "name": "Remove old environment",
    "data": {
      "configuration_id": "scope.oldEnv.id"
    }
  }
}
```

## Skytap - Get environment (2-get-environment)

This task will get a Skytap environment

Data:
`configuration_id` - the Skytap environment identifier

Output:
The Skytap environment object

Example:
```
{
  "task": "2-get-environment",
  "options": {
    "storeIn": "oldEnv",
    "name": "Find old environment",
    "data": {
      "configuration_id": "scope.me.remoteId"
    }
  }
}
```


## Skytap - Get template (2-get-template)

This task will get a Skytap template by identifier or will retrieve the newest template in a project

Data:
`template_id` - Skytap template identifier or "newest".  When newest specified, you must specify the `project_id` property as well
`project_id` - Skytap project identifier used when "newest" template_id is specified

Output:
The Skytap template object

Example:
```
{
  "task": "2-get-template",
  "options": {
    "name": "Find newest template",
    "storeIn": "template",
    "data": {
      "template_id": "newest",
      "project_id": 12
    }
  }
}
```
```
{
  "task": "2-get-template",
  "options": {
    "name": "Find template",
    "storeIn": "template",
    "data": {
      "template_id": 123
    }
  }
}
```


## Skytap - Attach public IPs (2-public-ips-attach)

Example:
```
{
  "task": "2-public-ips-attach",
  "options": {
    "name": "Attach public IPs",
    "data": {
      "env": "scope.newEnv",
      "ips": [
        "1.1.1.1"
      ]
    }
  }
}
```


## Skytap - Detach public IPs (2-public_ips-detach)

Example:
```
{
  "task": "2-public-ips-detach",
  "options": {
    "name": "Detach public IPs",
    "data": {
      "env": "scope.oldEnv"
    }
  }
}
```

## Skytap - Start Environment (2-start-environment)

Example:
```
{
  "task": "2-start-environment",
  "options": {
    "name": "Start new environment",
    "data": {
      "configuration_id": "scope.newEnv.id"
    }
  }
}
```

## Skytap - Suspend Environment (2-suspend-environment)

Example:
```
{
  "task": "2-suspend-environment",
  "options": {
    "name": "Suspend old environment",
    "storeIn": "oldEnv",
    "data": {
      "configuration_id": "scope.me.remoteId"
    }
  }
}
```

## Skytap - Update Environment User Data (2-update-environment-data)

```
{
  "task": "2-update-environment",
  "options": {
    "name": "Update environment user data",
    "storeIn": "newEnv",
    "data": {
      "configuration_id": "scope.newEnv.id",
      "update": {
        "name": "scope.oldEnv.name",
        "description": "scope.oldEnv.description"
      }
    }
  }
}
```

## Skytap - Update Environment (2-update-environment)

Example:
```
{
  "task": "2-update-environment",
  "options": {
    "name": "Set name and description in Skytap",
    "storeIn": "newEnv",
    "data": {
      "configuration_id": "scope.newEnv.id",
      "update": {
        "name": "scope.oldEnv.name",
        "description": "scope.oldEnv.description"
      }
    }
  }
}
```

## Skytap - VPN Detach (2-vpn-detach)

Example:
```
{
  "task": "2-vpn-detach",
  "options": {
    "name": "Detach VPN",
    "data": {
      "env": "scope.newEnv"
    }
  }
}
```

## Ringtail Install (3-custom-ringtail)

Example:
```
{
  "task": "3-custom-ringtail",
  "options": {
    "name": "Install Ringtail",
    "data": {
      "machine": "scope.me.machines[0]",
      "branch": "scope.me.deployedBranch",
      "config": {
        "RoleResolver|ROLE": "WEB",
        "Ringtail8|IS_SQLSERVER_USERNAME": "sa"
        // Remaining configuration options will be here
      }
    }
  }
}

```

# Code Structure

Task code can be found in the `src/server/tasks`.  The base class is `Task`. Each sub-type extends Task by overriding the `execute` method.

Tasks are created by the TaskFactory.

Tasks are executed in sequence by Jobs. 

Jobs are managed by the JobRunner.
