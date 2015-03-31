-- insert
insert into region (regionName, regionDesc, serviceConfig, browseConfig)
values ($regionName, $regionDesc, $serviceConfig, $browseConfig);

-- update
update region
set regionName = $regionName, regionDesc = $regionDesc, 
 serviceConfig = $serviceConfig, browseConfig = $browseConfig
where regionId = $regionId;

-- delete
delete region
where regionId = $regionId;

-- findAll
select *
from region
order by regionName
limit $pagesize offset $offset;

-- findById
select *
from region
where regionId = $regionId;

-- addEnv
insert into regionenv
values($regionId, $envId);

-- removeEnv
delete from regionenv
where regionId = $regionId and envId = $envId;