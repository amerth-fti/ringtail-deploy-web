-- insert
insert into validation (jobId, log)
values ($jobId, $log);

-- insertValidation
insert into validation (jobId, log)
values ($jobId, $log);

-- update
update validation
set log = $log
where jobId = $jobId;

-- maxid
select max(jobid) as jobId
from validation

-- getById
select *
from   validation
where  jobId = $jobId

-- list
select *
from   validation