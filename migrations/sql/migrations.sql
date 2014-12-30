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

-- createVM
CREATE TABLE vm (
  vmId INTEGER PRIMARY KEY AUTOINCREMENT,
  vmName NVARCHAR(255) NOT NULL,
  vmDesc TEXT,
  intIP NVARCHAR(255),
  extIP NVARCHAR(255),
  roleId INTEGER,
  installNotes TEXT,
  registryNotes TEXT
);

-- dropVM
DROP TABLE vm;

