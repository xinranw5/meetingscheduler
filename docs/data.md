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


create table users (id int, name varchar(255), pwd varchar(255), invitations varchar(255), timezone varchar(255));