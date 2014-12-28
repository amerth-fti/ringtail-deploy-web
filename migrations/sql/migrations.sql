-- createEnv
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


-- dropEnv
DROP TABLE env;