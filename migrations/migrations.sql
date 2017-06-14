-- 002-createEnv
CREATE TABLE env (
  envId INTEGER PRIMARY KEY AUTOINCREMENT,
  envName NVARCHAR(255) NOT NULL,
  envDesc TEXT,
  remoteType INTEGER,
  remoteId INTEGER,
  status NVARCHAR(255),
  config TEXT,
  deployedBy NVARCHAR(255),
  deployedOn TIMESTAMP,
  deployedUntil TIMESTAMP,
  deployedNotes TEXT,
  deployedBranch NVARCHAR(255),
  deployedJobId INTEGER,
  host NVARCHAR(255)
);


-- 002-dropEnv
DROP TABLE env;




-- 003-createMachine
CREATE TABLE machine (
  machineId INTEGER PRIMARY KEY AUTOINCREMENT,
  envId INTEGER NOT NULL,
  machineName NVARCHAR(255) NOT NULL,
  machineDesc TEXT,
  remoteId INTEGER,
  intIP NVARCHAR(255),
  extIP NVARCHAR(255),
  role NVARCHAR(255),
  installNotes TEXT,
  registryNotes TEXT,
  FOREIGN KEY (envId) REFERENCES env(envId)
);

-- 003-dropMachine
DROP TABLE machine;




-- 004-createRegion
CREATE TABLE region (
  regionId INTEGER PRIMARY KEY AUTOINCREMENT,
  regionName NVARCHAR(255) NOT NULL,
  regionDesc TEXT
);

CREATE TABLE regionenv (
  regionId INTEGER NOT NULL,
  envId INTEGER NOT NULL,
  PRIMARY KEY (regionId, envId),
  FOREIGN KEY (regionId) REFERENCES region(regionId),
  FOREIGN KEY (envId) REFERENCES env(envId)
);

INSERT INTO region (regionName, regionDesc)
VALUES ('All', 'All environments');

INSERT INTO regionenv
SELECT 1, envId FROM env;

INSERT INTO region (regionName, regionDesc)
VALUES ('Default', 'First region');

-- 004-dropRegion
DROP TABLE regionenv;
DROP TABLE region;




-- 005-deleteDefaultRegion
DELETE FROM region
WHERE regionId = 1;

DELETE FROM regionenv
WHERE regionId = 1;

-- 005-addDefaultRegion
INSERT INTO region (regionId, regionName, regionDesc)
VALUES (1, 'All', 'All environments');

INSERT INTO regionenv
SELECT 1, envId FROM env;




-- 006-addRegionConfigs
ALTER TABLE region ADD COLUMN serviceConfig TEXT;
ALTER TABLE region ADD COLUMN browseConfig TEXT;

-- 006-dropRegionConfigs
ALTER TABLE region RENAME TO regiontemp;
ALTER TABLE regionenv RENAME TO regionenvtemp;

CREATE TABLE region (
  regionId INTEGER PRIMARY KEY AUTOINCREMENT,
  regionName NVARCHAR(255) NOT NULL,
  regionDesc TEXT
);

CREATE TABLE regionenv (
  regionId INTEGER NOT NULL,
  envId INTEGER NOT NULL,
  PRIMARY KEY (regionId, envId),
  FOREIGN KEY (regionId) REFERENCES region(regionId),
  FOREIGN KEY (envId) REFERENCES env(envId)
);

INSERT INTO region (regionId, regionName, regionDesc)
SELECT regionId, regionName, regionDesc FROM regiontemp;

INSERT INTO regionenv(regionId, envId)
SELECT regionId, envId FROM regionenvtemp;

DROP TABLE regionenvtemp;
DROP TABLE regiontemp;


-- 007-createConfigs
CREATE TABLE config (
  configId INTEGER PRIMARY KEY AUTOINCREMENT,
  configName NVARCHAR(255),
  data TEXT,
  roles TEXT
);

ALTER TABLE machine ADD COLUMN configId INTEGER;

-- 007-dropConfigs
DROP TABLE config;

ALTER TABLE machine RENAME TO machinetemp;

CREATE TABLE machine (
  machineId INTEGER PRIMARY KEY AUTOINCREMENT,
  envId INTEGER NOT NULL,
  machineName NVARCHAR(255) NOT NULL,
  machineDesc TEXT,
  remoteId INTEGER,
  intIP NVARCHAR(255),
  extIP NVARCHAR(255),
  role NVARCHAR(255),
  installNotes TEXT,
  registryNotes TEXT,
  FOREIGN KEY (envId) REFERENCES env(envId)
);

INSERT INTO machine (machineId, envId, machineName, machineDesc, remoteId, intIP, extIP, role, installNotes, registryNotes)
SELECT machineId, envId, machineName, machineDesc, remoteId, intIP, extIP, role, installNotes, registryNotes FROM machinetemp;




-- 008-modifyTasks
ALTER TABLE env ADD COLUMN oldConfig TEXT;
UPDATE env set oldConfig = config;


-- 008-dropModifyTasks
UPDATE env set config = oldConfig;

ALTER TABLE env RENAME TO envtemp;

CREATE TABLE env (
  envId INTEGER PRIMARY KEY AUTOINCREMENT,
  envName NVARCHAR(255) NOT NULL,
  envDesc TEXT,
  remoteType INTEGER,
  remoteId INTEGER,
  status NVARCHAR(255),
  config TEXT,
  deployedBy NVARCHAR(255),
  deployedOn TIMESTAMP,
  deployedUntil TIMESTAMP,
  deployedNotes TEXT,
  deployedBranch NVARCHAR(255),
  deployedJobId INTEGER,
  host NVARCHAR(255)
);

INSERT INTO env (envId, envName, envDesc, remoteType, remoteId, status, config, deployedBy, deployedOn, deployedUntil, deployedNotes, deployedBranch, deployedJobId, host)
SELECT envId, envName, envDesc, remoteType, remoteId, status, config, deployedBy, deployedOn, deployedUntil, deployedNotes, deployedBranch, deployedJobId, host);

DROP table envtemp;


-- 009-addEnvToConfig
ALTER TABLE config RENAME TO configtemp;

CREATE TABLE config (
  configId INTEGER PRIMARY KEY AUTOINCREMENT,
  configName NVARCHAR(255),
  data TEXT,
  roles TEXT,
  envId INTEGER,
  FOREIGN KEY (envId) REFERENCES env(envId)
);

INSERT INTO config (configId, configName, data, roles, envId)
SELECT configId, configName, data, roles, (select envId from machine where machine.configId = configtemp.configId)
FROM configtemp;

DROP TABLE configtemp;


-- 009-dropEnvToConfig
ALTER TABLE config RENAME TO configtemp;

CREATE TABLE config (
  configId INTEGER PRIMARY KEY AUTOINCREMENT,
  configName NVARCHAR(255),
  data TEXT,
  roles TEXT
);

INSERT INTO config (configId, configName, data, roles)
SELECT configId, configName, data, roles FROM configTemp;

DROP TABLE configtemp;

-- 010-addLaunchKeyConfig
ALTER TABLE config RENAME TO configtemp;

CREATE TABLE config (
  configId INTEGER PRIMARY KEY AUTOINCREMENT,
  configName NVARCHAR(255),
  data TEXT,
  launchKey TEXT,
  roles TEXT,
  envId INTEGER,
  FOREIGN KEY (envId) REFERENCES env(envId)
);

INSERT INTO config (configId, configName, data, roles, envId)
SELECT configId, configName, data, roles, envId
FROM configtemp;

DROP TABLE configtemp;

-- 011-addUpdatePathToEnv
ALTER TABLE env RENAME TO envtemp;

CREATE TABLE env (
  envId INTEGER PRIMARY KEY AUTOINCREMENT,
  envName NVARCHAR(255) NOT NULL,
  envDesc TEXT,
  remoteType INTEGER,
  remoteId INTEGER,
  status NVARCHAR(255),
  config TEXT,
  deployedBy NVARCHAR(255),
  deployedOn TIMESTAMP,
  deployedUntil TIMESTAMP,
  deployedNotes TEXT,
  deployedBranch NVARCHAR(255),
  deployedJobId INTEGER,
  host NVARCHAR(255),
  updatePath NVARCHAR(255)
);

INSERT INTO env (envId, envName, envDesc, remoteType, remoteId, status, config, deployedBy, deployedOn, deployedUntil, deployedNotes, deployedBranch, deployedJobId, host)
SELECT envId, envName, envDesc, remoteType, remoteId, status, config, deployedBy, deployedOn, deployedUntil, deployedNotes, deployedBranch, deployedJobId, host FROM envtemp;

DROP table envtemp;

-- 012-addJobTable
CREATE TABLE jobs (
  jobId INTEGER NOT NULL,
  log TEXT
)

-- 013-clearDeployedJobs
UPDATE env
SET   deployedJobId = NULL

-- 014-addSwarmHost
ALTER TABLE env RENAME TO envtemp;

CREATE TABLE env (
  envId INTEGER PRIMARY KEY AUTOINCREMENT,
  envName NVARCHAR(255) NOT NULL,
  envDesc TEXT,
  remoteType INTEGER,
  remoteId INTEGER,
  status NVARCHAR(255),
  config TEXT,
  deployedBy NVARCHAR(255),
  deployedOn TIMESTAMP,
  deployedUntil TIMESTAMP,
  deployedNotes TEXT,
  deployedBranch NVARCHAR(255),
  deployedJobId INTEGER,
  host NVARCHAR(255),
  updatePath NVARCHAR(255),
  swarmhost NVARCHAR(255),
  swarmSshUser NVARCHAR(255),
  swarmSshKey NVARCHAR(8000),
  accessKeyId NVARCHAR(255),
  secretAccessKey NVARCHAR(255)
);

INSERT INTO env (envId, envName, envDesc, remoteType, remoteId, status, config, deployedBy, deployedOn, deployedUntil, deployedNotes, deployedBranch, deployedJobId, host)
SELECT envId, envName, envDesc, remoteType, remoteId, status, config, deployedBy, deployedOn, deployedUntil, deployedNotes, deployedBranch, deployedJobId, host FROM envtemp;

-- 015-addRegionCreds
ALTER TABLE region ADD COLUMN runasUser NVARCHAR(255);
ALTER TABLE region ADD COLUMN runasPassword NVARCHAR(255);