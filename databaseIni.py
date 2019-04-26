#!/usr/bin/python
# -*- coding: UTF-8 -*-
# import MySQLdb
import pymysql
pymysql.install_as_MySQLdb()
from datetime import datetime
userPage = "users"
invitationPage = "invitations"
contactPage = "contact"
timePage = "calendar"

def cleanDb():
    pages=[userPage,invitationPage,contactPage,timePage]
    for page in pages:
        sql = "DROP TABLE IF EXISTS "+page
        exe(sql)

def createPages():
    sql ="CREATE TABLE IF NOT EXISTS "+userPage+"""(
        id VARCHAR(40) NOT NULL,
        psw VARCHAR(15) NOT NULL,
        name VARCHAR(20) NOT NULL,
        timezone INT DEFAULT 0,
        invitations VARCHAR(6000) DEFUAL '[]',
        PRIMARY KEY ( id )
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;"""
    exe(sql)
    sql ="CREATE TABLE IF NOT EXISTS "+invitationPage+"""(
    id VARCHAR(10) NOT NULL,
    title VARCHAR(40) NOT NULL,
    state VARCHAR(1) NOT NULL,
    count INT DEFAULT 0,
    creator VARCHAR(40) NOT NULL,
    members varchar(4000) DEFAULT '[]',
    PRIMARY KEY ( id )
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;
    """
    exe(sql)
    sql ="CREATE TABLE IF NOT EXISTS "+contactPage+"""(
        uid VARCHAR(40) NOT NULL,
        id VARCHAR(40) NOT NULL,
        name VARCHAR(40) NOT NULL,
        nickname VARCHAR(40),
        INDEX (uid,id)
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;
    """
    exe(sql)
    sql ="CREATE TABLE IF NOT EXISTS "+timePage+"( \
        %s VARCHAR(40) NOT NULL, \
        %s VARCHAR(40) NOT NULL, \
        %s TIMESTAMP NOT NULL, \
        %s TIMESTAMP NOT NULL, \
        %s VARCHAR(10), \
        INDEX (%s) \
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;" % ("id","title","start","end","iid","id,start,end")
    exe(sql)
def changePage():
    sql = """
    alter table invitations MODIFY id VARCHAR(10);
    alter table invitations add column members varchar(4000);
    alter table invitations CHANGE creator creator VARCHAR(40);
    """
    sql = """
    alter table users add column invitations VARCHAR(6000)
    """
    exe(sql)

def addActivity(uid,title,start,end,willingness,acttype,descrption):
    sql = "insert into %s (uid, title, start, end, willingness, type, descrption) values (%s, '%s', %s, %s, %s,'%s','%s' )"% (timePage,uid,title,start,end,willingness,acttype,descrption)
    print(sql)
    exe(sql)

def insertData(uid, actList):
    for act in actList:
        addActivity(uid, act["title"], act["start"]*1000, act["end"]*1000, act["willingness"], act["category"], act["description"])


def exe(sql):
    db = pymysql.connect(host='127.0.0.1',port = 3306,user='root', passwd='12345678',db ='scheduler')
    cursor = db.cursor()
    results = []
    try:
       cursor.execute(sql)
       results = cursor.fetchall()
       db.commit()
    except:
       db.rollback()
    db.close()
    print(results)
    return results

actList1 = [{
            "title": 'Go out',
            "end": datetime(2019, 4, 21, 20, 00).timestamp(),
            "start": datetime(2019, 4, 21, 15, 00).timestamp(),
            "willingness": 0.1,
            "description": "add1 ",
            "category": "Professional",
    },
    {
            "title": 'buy stuff',
            "end": datetime(2019, 4, 22, 15, 30).timestamp(),
            "start": datetime(2019, 4, 22, 11, 00).timestamp(),
            "willingness": 0.2,
            "description": "add2 ",
            "category": "Private",
    },  
    {
            "title": 'Eat Out',
            "end": datetime(2019, 4, 23, 15,30).timestamp(),
            "start": datetime(2019, 4, 23, 11, 30).timestamp(),
            "willingness": 0.3,
            "description": "add2 ",
            "category": "Fun",
    },
    {
            "title": 'Work from home',
            "end": datetime(2019, 4, 23, 19, 00).timestamp(),
            "start": datetime(2019, 4, 23, 17, 00).timestamp(),
            "willingness": 0.8,
            "description": "add4 ",
            "category": "Family",
    }]
actList2 = [{
            "title": 'AllDay',
            "end": datetime(2019, 4, 22, 14, 00).timestamp(),
            "start": datetime(2019, 4, 22, 12, 00).timestamp(),
            "willingness": 0.3,
            "description": "Go out ",
            "category": "Professional",
    },
    {
            "title": 'buy stuff',
            "end": datetime(2019, 4, 23, 17, 30).timestamp(),
            "start": datetime(2019, 4, 23, 11, 00).timestamp(),
            "willingness": 0.4,
            "description": "Buy things",
            "category": "Private",
    },  
    {
            "title": 'buy stuff',
            "end": datetime(2019, 4, 25, 17, 30).timestamp(),
            "start": datetime(2019, 4, 25, 13, 00).timestamp(),
            "willingness": 0.7,
            "description": "Stay at home",
            "category": "Private",
    },  
    ]
insertData(2, actList1)
insertData(3, actList2)
