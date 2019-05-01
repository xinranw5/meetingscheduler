$(document).ready(function(){
  var ctxL = document.getElementById("lineChart").getContext('2d');
  var ctxL2 = document.getElementById("lineChart2").getContext('2d');
  var ctxL3 = document.getElementById("lineChart3").getContext('2d');
  var ctxL4 = document.getElementById("pieChart1").getContext('2d');
  var ctxL5 = document.getElementById("pieChart2").getContext('2d');

  // for activity
  var data_json = JSON.parse(table_data0)
  var events = []
  for(var i = 0; i<data_json.length; i++){
      var data = {}
      data["content"] = data_json[i]["title"]
      data["description"] = data_json[i]["description"]
      data["startDate"] = new Date(data_json[i]["start"]);
      data["endDate"] = new Date(data_json[i]["end"]);
      data["category"] = data_json[i]["category"];
      data["willingness"] = data_json[i]["willingness"];
      events.push(data);
  }
  console.log("initial data for suggestion",events)
  var week_unwill_data = [0,0,0,0,0,0,0];
  var week_unwill_mood_data = [0,0,0,0,0,0,0];

  // for events
  var meetings_json = JSON.parse(table_data1); 
  var meetings_events = []
  var week_meeting_time = [0,0,0,0,0,0,0];
  var week_unwill_meeting = [0,0,0,0,0,0,0];
  var week_unwill_positive = [0,0,0,0,0,0,0];
  console.log("meetings_json",meetings_json)
  // add a todo number
  var total_unwill_with_meeting_duration = 0
  if (meetings_json.length != 0){
      for(var i = 0; i<meetings_json.length; i++){
        var data = {}
        data["startDate"] = new Date(meetings_json[i]["start"]);
        data["endDate"] = new Date(meetings_json[i]["end"]);
        data["feedback"] = meetings_json[i]["attitude"];
        data["attendance"] = meetings_json[i]["attendance"];
        meetings_events.push(data);
    }
  }
  console.log("meeting events",meetings_events)
  
  for(var i=0;i<meetings_events.length;i++){
      var meeting_day = meetings_events[i]["startDate"].getDay();
          week_meeting_time[meeting_day] += Math.abs(meetings_events[i]["endDate"] - meetings_events[i]["startDate"]) /36e5
  }

  for(var i =0;i<events.length;i++){
      var hour = Math.abs(events[i]["endDate"] - events[i]["startDate"])/36e5
      // console.log("hour",hour)
      var unwill = events[i]["willingness"]
      var day = events[i]["startDate"].getDay()
      week_unwill_data[day] += (unwill*hour);
      if(events[i]["category"] != 'activity'){
        week_unwill_mood_data[day]+= (unwill*hour);
      }
      // find out meeting 
      var startTime = events[i]["startDate"];
      var endTime = events[i]["endDate"];
      // console.log("events",events[i])
      var duration_hour = 0;
      var meeting_unwill = 0;
      if(events[i]["category"]=='activity' || events[i]["category"]== "event")
        continue; 
      for(var j=0;j<meetings_events.length;j++){
        if(meetings_events[j]["accepted"] == false)
          continue;
        if(meetings_events[j]["attendance"] == 1 && meetings_events[j]["startDate"] >= startTime && meetings_events[j]["startDate"] < endTime){
          if(meetings_events[j]["endDate"] <= endTime){
            duration_hour = Math.abs(meetings_events[j]["endDate"] - meetings_events[j]["startDate"]) /36e5
            meeting_unwill = unwill * duration_hour
            week_unwill_meeting[day] += duration_hour;
            total_unwill_with_meeting_duration+=duration_hour
          }else{
            duration_hour = Math.abs(events[i]["endDate"] - meetings_events[j]["startDate"]) /36e5
            meeting_unwill = unwill * duration_hour
            week_unwill_meeting[day] += duration_hour;
            total_unwill_with_meeting_duration+=duration_hour

          }
          if(meetings_events[j]["feedback"] == 1){
              week_unwill_positive[day] += duration_hour
          }
        }else if(meetings_events[j]["attendance"] == 1 && meetings_events[j]["startDate"]<startTime && meetings_events[j]["endDate"] > startTime){
          if(meetings_events[j]["endDate"] <= endTime){
            duration_hour = Math.abs(meetings_events[j]["endDate"] - events[i]["startDate"]) /36e5
            meeting_unwill = unwill * duration_hour
            week_unwill_meeting[day] += duration_hour;
            total_unwill_with_meeting_duration+=duration_hour
          }else{
            duration_hour = Math.abs(events[i]["endDate"] - events[i]["startDate"]) /36e5
            meeting_unwill = unwill * duration_hour
            week_unwill_meeting[day] += duration_hour;
            total_unwill_with_meeting_duration+=duration_hour
          }
          if(meetings_events[j]["feedback"] == 1){
              week_unwill_positive[day] += duration_hour
          }
          console.log("duration_hour",duration_hour)

        }
        console.log("week_unwill_meeting",i,j,week_unwill_meeting)
      }
      

    }
    var total_week_mood_unwill_time = 0;
    var total_week_unwill_with_meeting = 0;
    var total_week_postive_meeting = 0;
    for(var i=0;i<week_unwill_meeting.length;i++){
       total_week_mood_unwill_time += week_unwill_mood_data[i]
       total_week_unwill_with_meeting+= week_unwill_meeting[i]
       total_week_postive_meeting+= week_unwill_positive[i]
    }
    var pie1 = [total_week_mood_unwill_time-total_week_unwill_with_meeting,total_week_unwill_with_meeting]
    var pie2 = [total_week_unwill_with_meeting - total_week_postive_meeting,total_week_postive_meeting]
    console.log(pie1)
    // suggestion part
    var sug1 = $("#suggestion1")  
    var sug2 = $("#suggestion2")  
    var sug1_title = $("#suggestion1-title")  
    var sug2_title = $("#suggestion2-title")  
    if(total_week_mood_unwill_time > 30){
      sug1_title.html("Reduce setting your unwilling mood time")
      sug1.html("Spending more time for social events would make you happy! \
        Going out and attending events offers new knowledge and information by introducing us to different cultures, thought patterns and ideas.")
    }else{
      sug1_title.html("Keep up with your style")
      sug1.html("Keep up with the patient to meet with others!")
    }
    if(total_week_postive_meeting/ total_week_unwill_with_meeting > 0.5){
      sug2_title.html("Explore more events you like")
      sug2.html("You find the meetings to be more fun than you expected! Why not try walking out of your comfort zone!")
    }else{
      sug2_title.html("Explore more other events")
      sug2.html("You can also try other kinds of events if you want, there are many other types of events you can explore Having a social network can get you out and about,\
       and introduce new fun ways to exercise!")
    }
  
  

  var myLineChart = new Chart(ctxL, {
    type: 'line',
    data: {
      labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      datasets: [
        {
          label: "Total Unwillingness number: the sum of each time range multiplying corresponding willingness.",
          data: week_unwill_data,
          backgroundColor: [
            'rgba(0, 137, 132, .2)',
          ],
          borderColor: [
            'rgba(0, 10, 130, .7)',
          ],
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true
    }
  });

  var myLineChart = new Chart(ctxL2, {
    type: 'line',
    data: {
      labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      datasets: [
        {
          label: "Total Unwillingness number of mood: the sum of each time range (with category 'mood') multiplying corresponding willingness",
          data: week_unwill_mood_data,
          backgroundColor: [
            'rgba(0, 137, 132, .2)',
          ],
          borderColor: [
            'rgba(0, 10, 130, .7)',
          ],
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true
    }
  });

  var myLineChart = new Chart(ctxL3, {
    type: 'line',
    data: {
      labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      datasets: [
        {
          label: "Total meeting time (hours) with attendance",
          data: week_meeting_time,
          backgroundColor: [
            'rgba(0, 137, 132, .2)',
          ],
          borderColor: [
            'rgba(0, 10, 130, .7)',
          ],
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true
    }
  });

  var myPieChart = new Chart(ctxL4, {
    type: 'pie',
    data: {
      labels: ["Unwilling mood time with no meeting", "Unwilling mood time with meeting"],
      datasets: [{
        data: pie1,
        backgroundColor: ["#FDB45C", "#46BFBD"],
        hoverBackgroundColor: ["#FFC870","#5AD3D1"]
      }]
    },
    options: {
      responsive: true
    }
  });
  var myPieChart2 = new Chart(ctxL5, {
    type: 'pie',
    data: {
      labels: ["Unwilling mood time with meeting that has negative feedback", "Unwilling mood time with meeting that has positive feedback"],
      datasets: [{
        data: pie2,
        backgroundColor: ["#FDB45C", "#46BFBD"],
        hoverBackgroundColor: [ "#FFC870","#5AD3D1"]
      }]
    },
    options: {
      responsive: true
    }
  });


  

});
