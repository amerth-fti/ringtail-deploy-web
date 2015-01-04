-- insert
insert into env (
  envId, envName, envDesc, remoteType, remoteId, config,
  deployedBy, deployedOn, deployedUntil, deployedNotes, deployedBranch
)
values (
  $envId, $envName, $envDesc, $remoteType, $remoteId, $config,
  $deployedBy, $deployedOn, $deployedUntil, $deployedNotes, $deployedBranch
);


-- update
update env
set 
  envName = $envName, envDesc = $envDesc, remoteType = $remoteType, remoteId = $remoteId, config = $config,
  deployedBy = $deployedBy, deployedOn = $deployedOn, deployedUntil = $deployedUntil, deployedNotes = $deployedNotes, deployedBranch = $deployedBranch
where envId = $envId;


-- delete
delete env
where envId = $envId;



-- findAll
select *
from env
order by envName
limit $pagesize offset $offset;


-- findById
select *
from env
where envId = $envId;