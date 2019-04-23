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
uid, fid, fname

## calendar table
uid, title, start, end, willingness, type, descrption

## feedback table
fbid, uid, iid, attendence, score, review

## invitations
iid, host, participants, start, end, title, description, status(upcoming/)


## sql create
create table users(id INT NOT NULL AUTO_INCREMENT, name VARCHAR(40), pwd VARCHAR(100), invitations VARCHAR(400), timezone VARCHAR(40), PRIMARY KEY(id));

create table contact(uid INT, fid INT, fname VARCHAR(100),PRIMARY KEY(uid));

create table calendar(eid INT NOT NULL AUTO_INCREMENT, uid INT, title VARCHAR(100), start INT, end INT, willingness FLOAT(10,6), type VARCHAR(100), descrption VARCHAR(250), PRIMARY KEY(eid));

create table feedback(fbid INT, uid INT, iid INT, attendence BOOLEAN, score double,  review VARCHAR(400),PRIMARY KEY(fbid));

create table invitations(iid INT, host INT, participants VARCHAR(400), start DATETIME, end DATETIME, title VARCHAR(100), description VARCHAR(400), statue VARCHAR(100));

insert into users (name, pwd, invitations, timezone) values ("w", "1", "", "");



## event need to be in the same day