# Data
## Session
+ uid
+ uname

## User
+ uid
+ uname
+ timetable
+ contacts
  + id
  + nickname
+ invitationS
+ invitationJ
+ timezone

## Invitation
+ inv_id
+ main_slot
  [inv_slot]: start_time, end_time, support(list of id,name,image), against(list of id,name,image)
+ alt_slot
  list of inv_slot
+ status
  + voting
  + finished
    final_slot


# Data Tables

## user table
id, name, pwd, invitations, timezone

## contact table
id, uid, fid, fname

## calendar table
uid, title, start, end, willingness, type, descrption

## feedback table
fbid, uid, iid, attendence, score, review

## invitations
iid, host, participants, start, end, title, description, status(upcoming/)


## sql create
create table users(id INT NOT NULL AUTO_INCREMENT, name VARCHAR(40), pwd VARCHAR(100), invitations VARCHAR(400), timezone VARCHAR(40), PRIMARY KEY(id));

create table contact(id INT NOT NULL AUTO_INCREMENT, uid INT, fid INT, fname VARCHAR(100),PRIMARY KEY(id));

create table calendar(eid INT NOT NULL AUTO_INCREMENT, uid INT, title VARCHAR(100), start BIGINT, end BIGINT, willingness FLOAT(10,6), type VARCHAR(100), descrption VARCHAR(250), PRIMARY KEY(eid));

create table feedback(fbid INT, uid INT, iid INT, attendence BOOLEAN, score double,  review VARCHAR(400),PRIMARY KEY(fbid));

create table invitations(iid INT NOT NULL AUTO_INCREMENT, host INT, participants VARCHAR(400), start BIGINT, end BIGINT, title VARCHAR(100), description VARCHAR(400), state VARCHAR(100), PRIMARY KEY(iid));

create table events(id INT NOT NULL AUTO_INCREMENT, iid INT, uid INT, status VARCHAR(100),  PRIMARY KEY(id));


## sql for data
insert into users (name, pwd, invitations, timezone) values ("w", "1", "", "");
insert into users (name, pwd, invitations, timezone) values ("Alice", "1", "", "");
insert into users (name, pwd, invitations, timezone) values ("Bob", "1", "", "");
insert into users (name, pwd, invitations, timezone) values ("Charlie", "1", "", "");

insert into contact (uid, fid, fname) values (2, 3, "Bob");
insert into contact (uid, fid, fname) values (2, 4, "Charlie");
insert into contact (uid, fid, fname) values (3, 2, "Alice");
insert into contact (uid, fid, fname) values (3, 4, "Charlie");
insert into contact (uid, fid, fname) values (4, 2, "Alice");
insert into contact (uid, fid, fname) values (4, 3, "Bob");

insert into calendar (uid, title, start, end, willingness, type, descrption) values (2, 'Go out', 1555876800,  );


## event need to be in the same day