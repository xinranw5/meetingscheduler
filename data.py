
class timeunit:
	# To show which day this unit is in
	date = 20170101
	#The number of this unit in a day
	#Count from 0
	number = 0
	#0 -- available, 1 -- unavailable, 2 -- don't want to be bothered 
	status = 0
	#information about this time unit
	tag = ''
	# A timepiece contains half an hour 
	#length = 0.5
	
	def __init__(self, date, number):
		self.date = date
		self.number = number
		self.status = 0
		self.tag = 'default'
	def __init__(self, date, number, status, tag):
		self.date = date
		self.number = number
		self.status = status
		self.tag = tag
		
	def set_status(self, new_status):
		self.status = new_status
	def set_date(self, new_date):
		self.date = new_date
	def set_number(self, new_number):
		self.number = new_number
	def set_tag(self, new_tag):
		self.tag = new_tag
	
	def get_status(self):
		return self.status
	def get_date(self):
		return self.date
	def get_number(self):
		return self.number
	def get_tag(self):
		return self.tag
		
class timetable:
	time_unit_num = 7*36
	#Record unavailable time units in this week
	
	def __init__(self):
		self.week_table = []
	def add_time_unit(self, date, number, status, tag):
		if(number < self.time_unit_num):
			new_unit = timeunit(date,number,status,tag)
			self.week_table.append(new_unit)
	def del_time_unit(self, index):
		del self.week_table[index]
	def is_in_participant_list(self, date, number):
		if(self.locate_time_unit(date, number) > 0):
			return True
		else:
			return False	
	def locate_time_unit(self, date, number):
		count = 0
		for i in self.week_table:
			if(i.get_date()==date and i.get_number()==number):
				return count
			count += 1
		return -1	
	def set_time_unit_status(self, index, status):
		self.week_table[index].set_status(status)
	def clear_timetable(self):
		self.week_table=[]
	def print_timetable(self):
		for u in self.week_table:
			print(u.number)

class activity:
	
	def __init__(self):
		id = ''
		self.participant_list = []
		self.title = ''
		self.info = ''
	def set_id(self,id):
		self.id = id
	def get_id(self):
		return self.id
	def set_info(self,info):
		self.info = info
	def get_info(self):
		return self.info
	def set_title(self,title):
		self.title = title
	def get_title(self):
		return self.title
		
	def add_participant(self, user):
		if(self.is_in_participant_list(user)):
			self.participant_list.append(user)
	def del_participant(self, index):
		del self.participant_list[index]
	def is_in_participant_list(self, user):
		if(self.locate_participant(user.id) > 0):
			return True
		else:
			return False
	def locate_participant(self, user_id):
		count = 0
		for i in self.participant_list:
			if(i.id == user_id):
				return count
			count += 1
		return -1

class user:
	
	def __init__(self, id):
		self.id = id
		self.username = ''
		self.user_week_time_table = timetable()
		self.friendlist = []
	def set_id(self,id):
		self.id = id
	def get_id(self):
		return self.id
	def set_username(self,username):
		self.username = username
	def get_username(self):
		return self.username	