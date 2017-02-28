-- insert
insert into env (
  envId, envName, envDesc, status, remoteType, remoteId, config,
  deployedBy, deployedOn, deployedUntil, deployedNotes, deployedBranch,
  deployedJobId, host, updatePath, swarmhost
)
values (
  $envId, $envName, $envDesc, $status, $remoteType, $remoteId, $config,
  $deployedBy, $deployedOn, $deployedUntil, $deployedNotes, $deployedBranch,
  $deployedJobId, $host, $updatePath, $swarmhost
);


-- update
update env
set
  envName = $envName, envDesc = $envDesc, status = $status, remoteType = $remoteType, remoteId = $remoteId,
  config = $config, deployedBy = $deployedBy, deployedOn = $deployedOn, deployedUntil = $deployedUntil,
  deployedNotes = $deployedNotes, deployedBranch = $deployedBranch, deployedJobId = $deployedJobId,
  host = $host, updatePath = $updatePath, swarmhost = $swarmhost

where envId = $envId;


-- remove
delete from env
where envId = $envId;



-- findAll
select *
from env
order by envId
limit $pagesize offset $offset;


-- findById
select *
from env
where envId = $envId;


-- findByRegion
select e.*
from env e
join regionenv re on re.envId = e.envId
where re.regionId = $regionId
order by envName collate nocase
limit $pagesize offset $offset;

-- findByRegionCount
select count(*) total
from env e
join regionenv re on re.envId = e.envId
where re.regionId = $regionId;

-- findRegionByEnvId
select re.regionId as regionId
from regionenv re
where re.envId = $envId

