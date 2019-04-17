
from data import timeunit,timetable,activity,user

ttable = timetable()
ttable.add_time_unit(20170513,5,1)
user1 = user('001')
user1.user_week_time_table = ttable

act1 = activity()
act1.add_participant(user1)

print act1