-- insert
insert into config (configName, configDesc, configData)
values ($configName, $configDesc, $configData);

-- update
update config set
  configName = $configName, configDesc = $configDesc, configData = $configData
where configId = $configId;

-- delete
delete config
where configId = $configId;

-- findAll
select *
from config
order by configName
limit $pagesize offset $offset;

-- findById
select *
from config
where configId = $configId;