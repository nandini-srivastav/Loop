alter table events add column categories text[] not null default '{}';
update events set categories = array[category];
