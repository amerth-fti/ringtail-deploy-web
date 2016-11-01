-- insert
insert into jobs (jobId, log)
values ($jobId, $log);

-- update
update jobs
set log = $log
where jobId = $jobId;

-- maxid
select max(jobid) as jobId
from jobs

-- getById
select *
from   jobs
where  jobId = $jobId

-- list
select *
from   jobs