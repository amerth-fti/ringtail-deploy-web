-- insert
insert into config (configId, configName, data, roles)
values ($configId, $configName, $data, $roles);

-- update
update config set
  configName = $configName, data = $data, roles = $roles  
where config = $config;

-- delete
delete from config
where configId = $configId;

-- findByEnv
select c.*
from config c
  join machine m on c.configId = m.configId
where m.envId = $envId
order by c.configName;

-- findById
select *
from config
where configId = $configId;