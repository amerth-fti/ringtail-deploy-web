-- createEnv
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


-- dropEnv
DROP TABLE env;

-- createMachine
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

-- dropMachine
DROP TABLE machine;


-- createRegion
CREATE TABLE region (
  regionId INTEGER PRIMARY KEY AUTOINCREMENT,
  regionName NVARCHAR(255) NOT NULL,
  regionDesc TEXT  
);

-- createRegionEnv
CREATE TABLE regionenv (
  regionId INTEGER NOT NULL,
  envId INTEGER NOT NULL,
  PRIMARY KEY (regionId, envId),
  FOREIGN KEY (regionId) REFERENCES region(regionId),
  FOREIGN KEY (envId) REFERENCES env(envId)
);

-- insertDefaultRegion
INSERT INTO region (regionName, regionDesc)
VALUES ('All', 'All environments');

-- insertDefaultRegionEnvs
INSERT INTO regionenv
SELECT 1, envId FROM env;

-- dropRegionEnv
DROP TABLE regionenv;

-- dropRegion
DROP TABLE region;

-- dropRegion
DROP TABLE region;

-- deleteDefaultRegion
DELETE FROM region 
WHERE regionId = 1;

-- deleteDefaultRegionEnvs
DELETE FROM regionenv
WHERE regionId = 1;