-- insert
insert into config (configId, configName, data, roles, envId)
values ($configId, $configName, $data, $roles, $envId);

-- update
update config set
  configName = $configName, data = $data, roles = $roles, envId = $envId, launchKey = $launchKey
where configId = $configId;

-- delete
delete from config
where configId = $configId;

-- findByEnv
select distinct *
from config
where envId = $envId
order by configName;

-- findById
select *
from config
where configId = $configId;