#!/usr/bin/python
# -*- coding: UTF-8 -*-
import MySQLdb, random, string, json
# uid = "evelynwang"
# uname = "evelyn"
# timezone = 8
db_schedule = "scheduler"

userPage = "users"
invitationPage = "invitations"
contactPage = "contacts"
timePage = "times"

InvIdLength = 10
calendarW = 7

def ranchar(i):
    return ''.join(random.sample(string.ascii_letters + string.digits, i))

#User
def addUser(uid, psw, name, timezone):
    sql = "insert into %s (id, psw, name, timezone) values ('%s','%s','%s',%d)"% (userPage, uid, psw, name, timezone)
    exe(sql)

def findUser(goal,uid):
    sql = "select %s from %s where id='%s'" % (goal,userPage,uid)
    return exe(sql)

def updateUser(goal,val,uid):
    sql = "update %s set %s=\"%s\" where id='%s'" % (userPage,goal,val,uid)
    return exe(sql)

def userAddInv(inv,uid):
    sql = "select invitations from %s where id='%s'" % (userPage,uid)
    # print exe(sql)
    invs = json.loads(exe(sql)[0][0])
    invs.append(inv)
    sql = "update %s set invitations='%s' where id='%s'" % (userPage,json.dumps(invs),uid)
    exe(sql)

# modify name or psw or timezone

# contacts
def addCon(uid, fid, fname, fnickname):
    sql = "insert into %s (uid, id, name, nickname) values ('%s','%s','%s','%s' )"% (contactPage, uid, fid, fname, fnickname)
    exe(sql)
    # sql = "select fid from %s where uid ='%s' and id='%s'" % (contactPage, uid, fid)
    # t = exe(sql)
    # if len(t)==0:
    #     sql = "insert into %s (uid, id, name, nickname) values ('%s','%s','%s','%s' )"% (contactPage, uid, fid, fname, fnickname)
    #     exe(sql)

def updateCon(uid, fid, goal, val):
    sql = "update %s set %s='%s' where uid='%s' and id='%s'" %  (contactPage, goal, val, uid, fid[4:])
    return exe(sql)

def delCon(uid,fid):
    sql = "delete from %s where uid='%s' and id='%s'" % (contactPage, uid, fid)
    exe(sql)

def findCon(uid):
    goal = "id,name,nickname"
    sql = "select %s from %s where uid='%s' " % (goal,contactPage,uid)
    return exe(sql)

def relation(uid,fid):
    goal = "id,name,nickname"
    sql = "select %s from %s where uid='%s' and id='%s' " % (goal,contactPage,uid,fid)
    return exe(sql)

#time
def addTime(uid,title,start,end):
    sql = "insert into %s (uid, title, start, end) values ('%s','%s','%s','%s' )"% (timePage,uid,title,start,end)
    print(sql)
    exe(sql)

def deleteTime(uid, title, start, end):
    sql = "delete from %s where uid='%s' and title='%s' and start='%s' and end='%s'" % (timePage,uid,title,start,end)
    print(sql)
    exe(sql)

def findTime(uid, start):
    goal = "title,start,end"
    end = "timestampadd(day,%d,'%s')" % (calendarW,start)
    sql = "select %s from %s where uid='%s' and ((start>='%s' and start<%s) or (end>'%s' and end<=%s))" % (goal,timePage,uid, start, end, start, end)
    return exe(sql)

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
    sql = "select %s from %s where creator='%s'" % (goal,invitationPage,uid)
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
    db = MySQLdb.connect(host='127.0.0.1',port = 3306,user='root', passwd='',db =db_schedule)
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
