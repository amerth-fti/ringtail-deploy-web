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
VALUES ('Dev', 'First region');

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

DROP table machinetemp;
