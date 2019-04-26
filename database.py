#!/usr/bin/python
# -*- coding: UTF-8 -*-
import MySQLdb, random, string, json
# uid = "evelynwang"
# uname = "evelyn"
# timezone = 8
db_schedule = "scheduler"

userPage = "users"
invitationPage = "invitations"
contactPage = "contact"
timePage = "calendar"

InvIdLength = 10
calendarW = 7

def ranchar(i):
    return ''.join(random.sample(string.ascii_letters + string.digits, i))

#User
def addUser(uid, psw, name, timezone):
    sql = "insert into %s (id, psw, name, timezone) values ('%s','%s','%s',%d)"% (userPage, uid, psw, name, timezone)
    exe(sql)

def findUser(goal,uid):
    sql = "select %s from %s where id=%s" % (goal,userPage,uid)
    return exe(sql)

def getUsernameByUid(uid):
    sql = "select name from %s where id=%s" % (userPage,uid)
    print(sql)
    return exe(sql)

def getUidByUname(username):
    sql = "select id from %s where name='%s'" % (userPage,username)
    print(sql)
    return exe(sql)

def getUserByUname(username):
    sql = "select id, name from %s where name='%s'" % (userPage,username)
    print(sql)
    return exe(sql)

def updateUser(goal,val,uid):
    sql = "update %s set %s=\"%s\" where id='%s'" % (userPage,goal,val,uid)
    return exe(sql)

def getUserEvents(uid):
    sql = "select invitations from %s where id=%s" % (userPage,uid)
    print(sql)
    return exe(sql)


def userAddInv(inv,uid):
    sql = "select invitations from %s where id=%s" % (userPage,uid)
    # print exe(sql)
    result = exe(sql)
    print(sql, result)
    if len(result[0][0])>0:
        invs = result[0][0].split(";")
        invs.append(str(inv))
        newInv=';'.join(invs)
        print(newInv)
        sql = "update %s set invitations='%s' where id=%s" % (userPage,newInv,uid)
    else:
        sql = "update %s set invitations='%s' where id=%s" % (userPage, inv, uid)
    print(sql)
    exe(sql)

# modify name or psw or timezone

# contacts
def addCon(uid, fid, fname):
    sql = "insert into %s (uid, fid, fname) values (%s, %s, '%s' )"% (contactPage, uid, fid, fname)
    exe(sql)
    
def updateCon(uid, fid, goal, val):
    sql = "update %s set %s='%s' where uid=%s" %  (contactPage, goal, val, uid)
    return exe(sql)

def delCon(uid,fid):
    sql = "delete from %s where uid=%s and fid=%s" % (contactPage, uid, fid)
    exe(sql)

def findCon(uid):
    goal = "fid,fname"
    sql = "select %s from %s where uid=%s " % (goal,contactPage,uid)
    print(sql)
    return exe(sql)

def findConByName(uid,fname):
    goal = "fid,fname"
    sql = "select %s from %s where uid=%s and fname='%s' " % (goal,contactPage,uid,fname)
    return exe(sql)

def relation(uid,fid):
    goal = "fid,fname"
    sql = "select %s from %s where uid=%s and fid=%s " % (goal,contactPage,uid,fid)
    return exe(sql)

#time, activity 
def addActivity(uid,title,start,end,willingness,acttype,descrption):
    sql = "insert into %s (uid, title, start, end, willingness, type, descrption) values (%s, '%s', %s, %s, %s,'%s','%s' )"% (timePage,uid,title,start,end,willingness,acttype,descrption)
    print(sql)
    exe(sql)

def deleteActivity(eid):
    sql = "delete from %s where eid=%s" % (timePage,eid)
    print(sql)
    exe(sql)

def updateActivity(eid,uid,title,start,end,willingness,acttype,descrption):
    sql = "update %s set uid=%s, title='%s', start=%s, end=%s, willingness=%s, type='%s', descrption='%s' where eid=%s"% (timePage,uid,title,start,end,willingness,acttype,descrption,eid)
    print(sql)
    exe(sql)

def findActivity(uid, title, start, end):
    sql = "select eid from %s where uid=%s and start=%s and end=%s and title='%s'" % (timePage, uid, start, end, title)
    print(sql)
    return exe(sql)

def findActivitiesByUser(uid):
    sql = "select * from %s where uid=%s" % (timePage, uid)
    print(sql)
    return exe(sql)

def findTime(uid, start):
    goal = "title,start,end"
    end = "timestampadd(day,%d,'%s')" % (calendarW,start)
    sql = "select %s from %s where uid='%s' and ((start>='%s' and start<%s) or (end>'%s' and end<=%s))" % (goal,timePage,uid, start, end, start, end)
    return exe(sql)

#events


def createEvent(uid, title, start, end, participants, description, state):
    sql = "insert into %s (host, title, start, end, participants, description, state) values (%s, '%s', %s, %s, '%s','%s','%s' )"% (invitationPage,uid,title,start,end,participants,description,state)
    print(sql)
    exe(sql)

def findEvent(uid, title, start, end):
    sql = "select iid from %s where host=%s and start=%s and end=%s and title='%s'" % (invitationPage, uid, start, end, title)
    print(sql)
    return exe(sql)

def getEvent(iid):
    sql = "select * from %s where iid=%s" % (invitationPage, iid)
    print(sql)
    return exe(sql)

def deleteEvent(iid):
    sql = "delete from %s where iid=%s" % (invitationPage, iid)



#invitations
def addInv(goal, data):
    iid = ranchar(InvIdLength)
    sql = "select id from %s while id=%s" % (invitationPage,iid)
    while(len(exe(sql))!=0):
        iid = ranchar(InvIdLength)
        sql = "select id from %s while id=%s" % (invitationPage,iid)
    sql = "insert into %s (%s) values ('%s',%s)"% (invitationPage, goal, iid, data)
    exe(sql)

def deleteInv(iid):
    sql = "delete from %s where id='%s'"% (invitationPage, iid)
    exe(sql)

def findInvByCreator(goal,uid):
    sql = "select %s from %s where host=%s" % (goal,invitationPage,uid)
    return exe(sql)

def findInvById(goal,iid):
    sql = "select %s from %s where id='%s'" % (goal,invitationPage,iid)
    return exe(sql)

def invAddMember(inv, uid):
    sql = "select members from %s where id='%s'" % (invitationPage,inv)
    mems = json.loads(exe(sql)[0][0])
    mems.append(uid)
    sql = "update %s set members='%s' where id='%s'" % (invitationPage,json.dumps(mems),inv)
    exe(sql)

# update page set a=1,b=2,c=3 where d=4
# delete from page where d=4

def exe(sql):
    # print "[sql] ",
    # print sql
    db = MySQLdb.connect(host='127.0.0.1',port = 3306,user='root', passwd='12345678',db =db_schedule)
    cursor = db.cursor()
    results = []
    try:
       cursor.execute(sql)
       results = cursor.fetchall()
       db.commit()
    except:
       db.rollback()
    db.close()
    # print "[sql] ",
    # print results
    return results
#findInv("iid,ititle,istate,icount","evelynwang")
# addInv("id,title,state,count,creator","'soa meeting','v',0,'eli_home@outlook.com'")
#deleteInv("py2wSVrsMI")
# addUser(page,"wangxr","daniang")
# makeCon()
# addCon("evelynwang","wangxr","daniang","xinran")
# print(findCon("evelynwang"))
# makeTime()
# addTime("wangxr","e","1705310000","1706010000")
# deleteTime("eve","test2","1705310010","1705310111")
# findTime("wangxr","170524")
# userAddInv('qPOtv4laom','eli_home@outlook.com')
# invAddMember('qPOtv4laom','eli_home@outlook.com')
