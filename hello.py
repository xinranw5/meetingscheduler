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
    return redirect(url_for('index'))

@app.route("/index", methods=['GET', 'POST'])
def index():
    username = ''
    actList = []
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


@app.route('/supCalendarPage', methods = ['GET', 'POST'])
def supCalendarPage():
    username = ''
    actList = []
    friendList = []
    supList = []
    if 'username' not in session:
            return request(url_for('index'))
    username = session['username']
    friends = database.findCon(session['uid']);
    for friend in friends:
        friendList.append({'id':friend[0], 'name':friend[1], 'isChecked':0, "weight":1.0})

    if request.method == 'POST':   
        # print("request",request.getWriter().print(json.toJSONString()))     
        data = request.get_json()
        print("data",data)
        for f in data["supList"]:
            fid = f["id"]
            fweight = f["weight"]
            fname = database.getUsernameByUid(fid)[0][0]
            supList.append({"id":int(fid), "name": fname, "weight":float(fweight)})
    else:
        supList = friendList[:]
    print("supList",supList)
    for friend in friendList:
        for sup in supList:
            if friend['id'] == sup['id']:
                friend['isChecked']=1
                friend["weight"]=sup["weight"]
    supList.append({'id':session['uid'], 'name':session['username'], "weight":1.0})
    for friend in supList:
        activities = database.findActivitiesByUser(friend['id'])
        fweight = friend["weight"]
        for activity in activities:
            act={}
            act["title"] = activity[2]
            act["start"] = activity[3]
            act["end"] = activity[4]
            act["willingness"] = activity[5]
            act["category"] = activity[6]
            act["description"] = activity[7]
            act["weight"] = fweight
            actList.append(act)
    print("friendlist",friendList)
    return render_template("supCalendarPage.html", uname=username, friendList=friendList, actList=actList)

#
@app.route("/searchpeople/",methods=['GET','POST'])
def searchpeople():
    if 'username' not in session:
        return "Not log in"
    if request.method == 'POST':
        searchText = request.values.get('names').split(';');
        uid=session['uid']
        frList=[]
        nofrList=[]
        noPerList=[]
        for fname in searchText:
            t = database.findConByName(uid, fname)
            print(t)
            if len(t)>0:
                frList.append(t[0])
            else:
                t = database.getUserByUname(fname.strip())
                print(t, len(t))
                if len(t)>0:
                    nofrList.append(t[0])
                else:
                    noPerList.append(fname)
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
    database.addCon(uid,fid,fname)
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


@app.route("/startevent",methods=['GET','POST'])
def startevent():
    if request.method == 'POST':
        newevent = request.get_json()
        print("newevent", newevent)
        friendList = newevent["friend_list"]
        title = newevent["title"]
        start = int(newevent["start"])
        end = int(newevent["end"])
        description = newevent["description"]
        state = "upcoming"
        participants = ';'.join(friendList)
        # Create event
        database.createEvent(session['uid'], title, start, end, participants, description, state)
        iid = database.findEvent(session['uid'], title, start, end)[0][0]
        # Insert invitation for host
        database.userAddInv(iid,session['uid'])
        # Insert for participants
        for f in friendList:
            database.userAddInv(iid, int(f))
        return "success"




@app.route("/getinv/",methods=['GET','POST'])
def getinv():
    if request.method == 'POST':
        return json.dumps(database.findInvByCreator("iid,ititle,istate,icount",session['uid']))

def getEventsByUser(uid):
    results=[]
    eids = database.getUserEvents(session['uid'])[0][0]
    print("eids",eids)
    if len(eids)>0:
        eve_id = eids.split(';')
        for eid in eve_id:
            tmp = database.getEvent(eid)[0]
            print(tmp)
            event={}
            iid = int(tmp[0])
            hostID = int(tmp[1])
            event["host"] = database.getUsernameByUid(hostID)[0][0]
            partIDs = tmp[2].split(';')
            participants=[]
            for par in partIDs:
                parName = database.getUsernameByUid(int(par))[0][0]
                participants.append(parName)
            event["participants"] = ','.join(participants)
            event["start"] = int(tmp[3])
            event["end"] = int(tmp[4])
            event["title"] = tmp[5]
            event["description"] = tmp[6]
            event["state"] = tmp[7]
            event["id"] = iid

            accepted = False
            status = database.findAcceptedEvent(session['uid'], iid)
            print("status",status)
            if len(status)>0:
                accepted=True

            event["accepted"] = accepted
            results.append(event)
    return results
       


@app.route("/geteve/",methods=['GET','POST'])
def geteve():
    if request.method == 'POST':
        results=getEventsByUser(session['uid'])
        # eids = database.getUserEvents(session['uid'])[0][0]
        # print("eids",eids)
        # if len(eids)>0:
        #     eve_id = eids.split(';')
        #     for eid in eve_id:
        #         tmp = database.getEvent(eid)[0]
        #         print(tmp)
        #         event={}
        #         hostID = int(tmp[1])
        #         event["host"] = database.getUsernameByUid(hostID)[0][0]
        #         partIDs = tmp[2].split(';')
        #         participants=[]
        #         for par in partIDs:
        #             parName = database.getUsernameByUid(int(par))[0][0]
        #             participants.append(parName)
        #         event["participants"] = ','.join(participants)
        #         event["start"] = int(tmp[3])
        #         event["end"] = int(tmp[4])
        #         event["title"] = tmp[5]
        #         event["description"] = tmp[6]
        #         event["state"] = tmp[7]
        #         event["id"] = int(tmp[0])
        #         results.append(event)
        print("events:", results)
        return json.dumps(results)

@app.route("/joinInv/",methods=['GET','POST'])
def joinInv():
    invId = request.args.get('iid')
    uid = session['uid']
    event = database.getEvent(invId)[0]
    title = event[5]
    start =event[3]
    end = event[4]
    willingness = 0.8
    category = 'event'
    description = event[6]

    status = database.findAcceptedEvent(session['uid'], invId)
    print("status",status)
    if len(status)==0:
        database.acceptEvent(session['uid'], invId, "accepted")
        database.addActivity(session['uid'], title, start, end, willingness, category, description)
    result={"iid":invId}
    return json.dumps(result)
    # database.invAddMember(invId,uid)
    # database.userAddInv(invId,uid)

@app.route("/getcon/",methods=['GET','POST'])
def getcon():
    if request.method == 'POST':
#        return json.dumps(database.findCon(session['uid']))
        return json.dumps({data:"getcon"})


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


@app.route("/invitation/<inv_id>")
def invitation(inv_id):
    username = ''
    if 'username' in session:
        username = session['username']
    tmp = database.getEvent(inv_id)[0]
    event={}
    hostID = int(tmp[1])
    event["host"] = database.getUsernameByUid(hostID)[0][0]
    partIDs = tmp[2].split(';')
    participants=[]
    for par in partIDs:
        parName = database.getUsernameByUid(int(par))[0][0]
        participants.append(parName)
    event["participants"] = ','.join(participants)
    event["start"] = int(tmp[3])
    event["end"] = int(tmp[4])
    event["title"] = tmp[5]
    event["description"] = tmp[6]
    event["state"] = tmp[7]
    event["id"] = int(tmp[0])
    
    # Get feedback
    iid = inv_id
    uid = session['uid']
    res = database.findFeedback(uid, iid)
    print("find feedback", res)
    if len(res)==0:
        event['attendance']=1
        event['attitude']=1
        event["review"]=""
    else:
        fid=int(res[0][0])
        fb = database.getFeedback(fid)[0]
        event['attendance'] = fb[3]
        event['attitude'] = fb[4]
        event['review'] = fb[6]

    return render_template("invitation.html", uname=username, event=event, on_create = True)
    


@app.route("/save_feedback", methods=['POST','GET'])
def save_feedback():
    if 'username' not in session:
        return redirect(url_for('login'))

    if request.method == 'POST':
        # save feedback into database
        data = request.get_json()
        print("get feedback",data)
        uid = session['uid']
        iid = int(data['iid'])
        attendance=int(data['attendance'])
        attitude=int(data['attitude'])
        score=int(data['score'])
        review=data['review']
        # Find if there is a feedback
        res = database.findFeedback(uid, iid)
        print("res", res)
        if len(res)==0:
            database.saveFeedback(uid, iid, attendance, attitude, score, review)
            # print("save")
        else:
            fid = res[0][0]
            database.updateFeedbackNum(fid, "attendance", attendance) 
            database.updateFeedbackNum(fid, "attitude", attitude)
            database.updateFeedbackNum(fid, "score", score)
            database.updateFeedbackReview(fid, review) 

        return "success"

@app.route("/reportpage", methods=['POST', 'GET'])
def reportpage():
    if "username" not in session:
        return redirect(url_for('login'))
    actList = []
    username = session['username']
    uid = session['uid']
    activities = database.findActivitiesByUser(uid)
    # print("activity", activities)
    for activity in activities:
        act={}
        act["title"] = activity[2]
        act["start"] = activity[3]
        act["end"] = activity[4]
        act["willingness"] = activity[5]
        act["category"] = activity[6]
        act["description"] = activity[7]

        actList.append(act)

    eList = getEventsByUser(uid)
    eveList=[]
    for event in eList:
        iid = event['id']
        # feedback
        res = database.findFeedback(uid, iid)
        print("find feedback", res)
        if len(res)==0:
            event['attendance']=1
            event['attitude']=1
            event["review"]=""
        else:
            fid=int(res[0][0])
            fb = database.getFeedback(fid)[0]
            event['attendance'] = fb[3]
            event['attitude'] = fb[4]
            event['review'] = fb[6]
            eveList.append(event)
    print("actList", actList)
    print("eveList", eveList)
    # print(actList)
    return render_template("suggestion.html", uname=username, actList=actList, eveList=eveList)


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
