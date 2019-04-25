from flask import Flask
from flask import abort, redirect, url_for, render_template
from flask import request, session
# import pymysql
# pymysql.install_as_MySQLdb()
import database
import json
from flask import jsonify
from data import timeunit,timetable,activity,user
from datetime import datetime
import time
app = Flask(__name__)
# set the secret key.  keep this really secret:
app.secret_key = '|G\x8f\x7f\x02\xb87\x9cYai\xc4D\x11\xd4\xf4j>\x1a\x15\xdc\x95l\x1f'


def update_user_calendar(usr,time_unit_list):
    usr.user_week_time_table.clear_timetable()
    for i in time_unit_list:
        usr.user_week_time_table.add_time_unit(cur_date,i,1,'default')

#Make some data to use
# time_amount = 7*24
# cur_date = 20170101
# user1 = user(1)
# user2 = user(2)
# user3 = user(3)
# cur_user = user1
# total_user = [user1,user2,user3]
# default_bkdata = {"color1":[],"color2":[],"color3":[5,17,25,64,100]}

# user1.friendlist.append(user2)
# user1.friendlist.append(user3)
# list1=[5,17,25,64,100]
# list2=[5,22,64,80]
# list3=[5,20,25,90]

# update_user_calendar(user1,list1)
# update_user_calendar(user2,list2)
# update_user_calendar(user3,list3)


@app.route("/")
def rootpage():
    username = ''
    return render_template("index.html", uname=username)

@app.route("/index", methods=['GET', 'POST'])
def index():
    username = ''
    actList = [{
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
    actList = [{
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


    if 'username' in session:
        username = session['username']
        uid = session['uid']
        activities = database.findActivitiesByUser(uid)
        print("activity", activities)
        for activity in activities:
            act={}
            act["title"] = activity[2]
            act["start"] = activity[3]
            act["end"] = activity[4]
            act["willingness"] = activity[5]
            act["category"] = activity[6]
            act["description"] = activity[7]
            actList.append(act)
        print("actList", actList)
    # print(actList)
    return render_template("index.html", uname=username, actList=actList)

###############################
#Comment out things with session
#
###############################

@app.route("/signup",methods =['GET','POST'])
def signup():
    if request.method == 'POST':
        database.addUser(request.form['id'],request.form['psw'],request.form['name'],8)
        return render_template("hello.html", msg="Sign Up Succeed!")


@app.route("/login",methods = ['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        session['username'] = username
        session['uid'] = database.getUidByUname(username)[0][0]
        return redirect(url_for('index'))
    return render_template("loginpage.html")


@app.route('/logout')
def logout():
    session.pop('uid', None)
    session.pop('username', None)
    return redirect(url_for('index'))

@app.route('/supCalendarPage')
def supCalendarPage():
	actList = [{
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
    },
    {
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




	return render_template("supCalendarPage.html", actList=actList)

#
@app.route("/searchpeople/",methods=['GET','POST'])
def searchpeople():
    if request.method == 'POST':
        searchText = request.values.get('ids').split(';');
        uid=session['uid']
        frList=[]
        nofrList=[]
        noPerList=[]
        for fid in searchText:
            t = database.relation(uid,fid.strip())
            print(t)
            if len(t)>0:
                frList.append(t[0])
            else:
                print(t)
                t = database.findUser("id,name",fid)
                if len(t)>0:
                    nofrList.append(t[0])
                else:
                    noPerList.append(fid)
        result = {}
        result['friends']=frList
        result['strangers']=nofrList
        result['wrong']=noPerList
        print(result)
        return json.dumps(result)

@app.route("/addcon/")
def addcon():
    uid=session['uid']
    fid=request.args.get('id')
    fname=request.args.get('name')
    database.addCon(uid,fid,fname,"")
    return "success"

@app.route("/delcon/")
def delcon():
    uid=session['uid']
    fid=request.args.get('id')
    database.delCon(uid,fid)
    return "success"

@app.route("/setnickname/")
def setnickname():
    uid=session['uid']
    fid=request.args.get('id')
    fnickname = request.args.get('nickname')
    results = database.updateCon(uid,fid,"nickname",fnickname)
    if isinstance(results,(list)):
        return "error"
    else:
        return "success"

@app.route("/getinv/",methods=['GET','POST'])
def getinv():
    if request.method == 'POST':
        return json.dumps(database.findInvByCreator("iid,ititle,istate,icount",session['uid']))


@app.route("/geteve/",methods=['GET','POST'])
def geteve():
    if request.method == 'POST':

        ids = json.loads(database.findUser("invitations", session['uid'])[0][0])
        print(ids)
        flag = False
        results = []
        for iid in ids:
            t = database.findInvById("id,title,state,count,creator",iid)
            if len(t)==0:
                ids.remove(iid)
                flag = True
            else:
                results.append(t[0])
        if flag:
            database.updateUser('invitations',json.dumps(ids),session['uid'])
        return json.dumps(results)

@app.route("/joinInv/")
def joinInv():
    invId = request.args.get('inv')
    uid = session['uid']
    database.invAddMember(invId,uid)
    database.userAddInv(invId,uid)

@app.route("/getcon/",methods=['GET','POST'])
def getcon():
    if request.method == 'POST':
#        return json.dumps(database.findCon(session['uid']))
        return json.dumps({data:"getcon"})

def get_table_info_by_usr(usr):
	event_list = []
	table_data = {"time" : [{"title":"act 1","start":"1","end":"5"},{"title":"act 2","start":"20","end":"36"}]}
	#get data from database by user id
	#all activities
	#date
	#todo
	return table_data


def cal_color(usrlist):
    color_data ={"color1":[],"color2":[],"color3":[]}
    tmpdict={}
	#Count the times of each time unit
	#todo
	#get users'data from database
    for i in usrlist:
        usr = find_user_by_id(int(i))
        if(usr != None):
			#usr.user_week_time_table.print_timetable()
            for k in usr.user_week_time_table.week_table:
                if not str(k.get_number()) in tmpdict:
                    tmpdict[str(k.get_number())] = 1
                else:
                    tmpdict[str(k.get_number())] += 1

    for key in tmpdict:
        #print 'key: '+key+'  '+str(tmpdict[key])
        if tmpdict[key] == 1:
            color_data["color1"].append(int(key))
        elif tmpdict[key] == 2:
            color_data["color2"].append(int(key))
        else:
            color_data["color3"].append(int(key))
    return color_data

# evoked by user.html
@app.route("/createInvitation/")
def createInvitation():
    id=2
    # temp
    return redirect(url_for('invitation', inv_id=id, on_create=True ))
    # if success:
    #     return redirect(url_for('invitation', inv_id=id, on_create=True ))
    # else:
    #     return 0

@app.route("/user/", methods=['GET', 'POST'])
def user():
    if request.method == 'POST':
        # add into database
        print(request.form['title'])
        return "001"
    else:
    # if not signed-in:
    #     return redirect(url_for('hello'))
    # else:
        usrlist = [cur_user.id]
        if request.method == 'POST':
            usrdata = json.loads(request.get_json().encode("utf-8"))
            usrlist = usrdata['id']
            usrlist.append(cur_user.id)

        print(usrlist)
        bkdata= json.dumps(cal_color(usrlist));
        print(bkdata)
        return render_template("user.html",bgcolor = bkdata,friendlist=cur_user.friendlist)

# @app.route("/save_time/",methods=['POST','GET'])
# def save_time():
#         if request.method == 'POST':
#             data = json.loads(request.get_json().encode("utf-8"))
#             default_bkdata['color3']=data['id']
# 			#save to the user
#             update_user_calendar(cur_user,default_bkdata['color3'])
#         bkdata= json.dumps(default_bkdata);
#         return bkdata

@app.route("/save_activity/",methods=['POST','GET'])
def save_activity():
        new_act = json.dumps({"title":'',"start":0,"end":0, "willingness":0, "category":"", "description":""})
        if request.method == 'POST':
            new_act = request.get_json()
            #save to the database
            print(new_act)
            if 'username' not in session:
                return "error"
            database.addActivity(session['uid'], new_act["title"],int(new_act["start"]),int(new_act["end"]),float(new_act["willingness"]),new_act["category"],new_act["description"])
        return json.dumps(new_act)

@app.route("/delete_activity/",methods=['POST','GET'])
def delete_activity():
        del_act = json.dumps({"title":'',"start":0,"end":0, "willingness":0, "category":"", "description":""})
        if request.method == 'POST':
            del_act = request.get_json()
            if 'username' not in session:
                return "error"
            eid = int(database.findActivity(session['uid'], del_act["title"], del_act["start"], del_act["end"])[0][0])
            database.deleteActivity(eid)
        return json.dumps(del_act)

@app.route("/update_activity/",methods=['POST','GET'])
def update_activity():
        update_act = json.dumps({"title":'',"start":0,"end":0, "willingness":0, "category":"", "description":""})
        if request.method == 'POST':
            update_act = request.get_json()
            #save to the database
            if 'username' not in session:
                return "error"
            eid = int(database.findActivity(session['uid'], update_act["title"], int(update_act["start"]),int(update_act["end"]))[0][0])
            database.updateActivity(eid, session['uid'], update_act["title"],update_act["start"],update_act["end"],update_act["willingness"],update_act["category"],update_act["description"])
        return json.dumps(update_act)


@app.route("/get_color/",methods=['POST','GET'])
def get_color():
        usrlist = [cur_user.id]
        if request.method == 'POST':
            print(type(request.get_json()))
            #usrdata = request.get_json()
            usrdata = json.loads(request.get_json())
            usrlist = usrdata['id']
            usrlist.append(cur_user.id)

        print(usrlist)
        bkdata= json.dumps(cal_color(usrlist));
        print(bkdata)
        return bkdata

@app.route("/invitation/<inv_id>")
def invitation(inv_id):
    invitation = 'inv'
    return render_template("invitation.html", data=invitation, on_create = True)
    # if not signed-in:
    #     return redirect(url_for('hello'))
    # else:
    #     if id valid:
    #         get invitation
    #         return render_template("invitation.html", data=invitation, on_create = on_create)
    #     else:
    #         return "Invitation does not exist!"

@app.route("/about/")
def about():
    return "Under construction"

@app.route("/tutorial/")
def tutorial():
    return "Under construction"

@app.route("/timetable", methods=['POST','GET'])
def timetable():
	if request.method == 'POST':
		data = request.get_json()
	else:
		data = {}
	return render_template("calendar.html",data=data)

@app.route("/tablesuperimposition/")
def tablesuperimposition():
    return render_template("table_superimposition.html")




if __name__ == "__main__":
    app.run()
