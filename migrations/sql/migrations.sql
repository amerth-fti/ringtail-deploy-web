-- createEnv
CREATE TABLE env (
  envId INTEGER PRIMARY KEY AUTOINCREMENT,
  envName NVARCHAR(255) NOT NULL,
  envDesc TEXT,
  remoteType INTEGER,
  remoteId INTEGER,
  configId INTEGER,
  deployedBy NVARCYAR(255),
  deployedOn TIMESTAMP,
  deployedUntil TIMESTAMP,
  deployedNotes TEXT,
  deployedBranch NVARCHAR(255)
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
  roleId INTEGER,
  installNotes TEXT,
  registryNotes TEXT,
  FOREIGN KEY (envId) REFERENCES env(envId)
);

-- dropMachine
DROP TABLE machine;


-- createConfig
CREATE TABLE config (
  configId INTEGER PRIMARY KEY AUTOINCREMENT,
  configName NVARCHAR(255) NOT NULL,
  configDesc TEXT,
  configData TEXT NOT NULL
);


-- dropConfig
DROP TABLE config;