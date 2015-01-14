-- insert
insert into env (
  envId, envName, envDesc, status, remoteType, remoteId, config,
  deployedBy, deployedOn, deployedUntil, deployedNotes, deployedBranch, deployedJobId
)
values (
  $envId, $envName, $envDesc, $status, $remoteType, $remoteId, $config,
  $deployedBy, $deployedOn, $deployedUntil, $deployedNotes, $deployedBranch, $deployedJobId
);


-- update
update env
set 
  envName = $envName, envDesc = $envDesc, status = $status, remoteType = $remoteType, remoteId = $remoteId, config = $config,
  deployedBy = $deployedBy, deployedOn = $deployedOn, deployedUntil = $deployedUntil, deployedNotes = $deployedNotes, deployedBranch = $deployedBranch, deployedJobId = $deployedJobId
where envId = $envId;


-- delete
delete env
where envId = $envId;



-- findAll
select *
from env
order by envName collate nocase
limit $pagesize offset $offset;


-- findById
select *
from env
where envId = $envId;