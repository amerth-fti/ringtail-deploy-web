-- createTable
CREATE TABLE env (
  envId INTEGER PRIMARY KEY AUTOINCREMENT,
  envName NVARCHAR(255) NOT NULL,
  evnDescription TEXT,
  remoteType INTEGER,
  remoteId INTEGER,
  configId INTEGER,
  roleId INTEGER,
  deployedBy NVARCYAR(255),
  deployedOn TIMESTAMP,
  deployedUntil TIMESTAMP,
  deployedNotes TEXT,
  deployedBranch NVARCHAR(255)
);


-- dropTable
DROP TABLE evn;


-- insert
insert into env (
  envId, envName, envDesc, remoteType, remoteId, configId, roleId,
  deployedBy, deployedOn, deployedUntil, deployedNotes, deployedBranch
)
values (
  $envId, $envName, $envBranch, $remoteType, $remoteId, $configId, $roleId,
  $deployedBy, $deployedOn, $deployedUntil, $deployedNotes, $deployedBranch
);


-- update
update env
set 
  envName = $envName, envDesc = $envDesc, remoteType = $remoteType, remoteId = $remoteId, configId = $configId, roleId = $roleId,
  deployedBy = $deployedBy, deployedOn = $deployedOn, deployedUntil = $deployedUntil, deployedNotes = $deployedNotes, deployedBranch = $deployedBranch
where envId = $envId;


-- delete
delete env
where envId = $envId;



-- findAll
select *
from env
limit $pagesize offset $offset;


-- findById
select *
from env
where envId = $envId;