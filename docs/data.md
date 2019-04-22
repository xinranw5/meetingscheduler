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
uid, title, start, end, willingness, type

## feedback table
fbid, uid, iid, attendence, score, review

## invitations
iid, host, participants, start, end, title, description, status(upcoming/)


## sql create
create table user(id INT , name VARCHAR(40), pwd VARCHAR(100), invitations VARCHAR(400), timezone DATE, PRIMARY KEY(id));

create table contact(uid INT, fid INT, fname VARCHAR(100),PRIMARY KEY(uid));

create table calendar(uid INT, title VARCHAR(100), start DATETIME,end DATETIME, willingness INT, type VARCHAR(100),PRIMARY KEY(uid));

create table feedback(fbid INT, uid INT, iid INT, attendence BOOLEAN, score double,  review VARCHAR(400),PRIMARY KEY(fbid));

create table invitations(iid INT, host INT, participants VARCHAR(400), start DATETIME, end DATETIME, title VARCHAR(100), description VARCHAR(400), statue VARCHAR(100));





## event need to be in the same day