$(document).ready(function(){
  var ctxL = document.getElementById("lineChart").getContext('2d');
  var ctxL2 = document.getElementById("lineChart2").getContext('2d');
  var ctxL3 = document.getElementById("lineChart3").getContext('2d');
  var ctxL4 = document.getElementById("lineChart4").getContext('2d');
  var ctxL5 = document.getElementById("lineChart5").getContext('2d');

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
  var meetings_json = [{start: events[0]["startDate"], end: events[0]["endDate"],attendence:1,feedback:1}]; // to do 
  var meetings_events = []
  var week_meeting_time = [0,0,0,0,0,0,0];
  var week_unwill_meeting = [0,0,0,0,0,0,0];
  var week_unwill_positive = [0,0,0,0,0,0,0];
  console.log("meetings_json",meetings_json)
  if (meetings_json.length != 0){
      for(var i = 0; i<meetings_json.length; i++){
        var data = {}
        data["startDate"] = new Date(meetings_json[i]["start"]);
        data["endDate"] = new Date(meetings_json[i]["end"]);
        data["feedback"] = meetings_json[i]["feedback"];
        data["attendence"] = meetings_json[i]["attendence"];
        meetings_events.push(data);
    }
  }
  

  for(var i =0;i<events.length;i++){
      var hour = Math.abs(events[i]["endDate"] - events[i]["startDate"])/36e5
      // console.log("hour",hour)
      var unwill = events[i]["willingness"]
      var day = events[i]["startDate"].getDay()
      week_unwill_data[day] += (unwill*hour);
      if(events[i]["category"] == 'mood'){
        week_unwill_mood_data[day]+= (unwill*hour);
      }
      // find out meeting 
      var startTime = events[i]["startDate"];
      var endTime = events[i]["endDate"];
      // console.log("events",events[i])
      for(var j=0;j<meetings_events.length;j++){
        if(i == 0){
          var meeting_day = meetings_events[i]["startDate"].getDay();
          week_meeting_time[meeting_day] += Math.abs(meetings_events[i]["endDate"] - meetings_events[i]["startDate"]) /36e5
        }
        console.log()
        if(meetings_events[j]["attendence"] == 1 && meetings_events[j]["startDate"] >= startTime && meetings_events[j]["startDate"] < endTime){
          if(meetings_events[j]["endDate"] <= endTime){
            var duration_hour = Math.abs(meetings_events[i]["endDate"] - meetings_events[i]["startDate"]) /36e5
            var meeting_unwill = unwill * duration_hour
            week_unwill_meeting[day] += meeting_unwill;
          }else{
            var duration_hour = Math.abs(events[i]["endDate"] - meetings_events[j]["startDate"]) /36e5
            var meeting_unwill = unwill * duration_hour
            week_unwill_meeting[day] += meeting_unwill;
          }
          if(meetings_events[j]["feedback"] == 1){
              week_unwill_positive[day] += meeting_unwill
          }
        }else if(meetings_events[j]["attendence"] == 1 && meetings_events[j]["startDate"]<startTime && meetings_events[j]["endDate"] > startTime){
          if(meetings_events[j]["endDate"] <= endTime){
            var duration_hour = Math.abs(meetings_events[j]["endDate"] - events[i]["startDate"]) /36e5
            var meeting_unwill = unwill * duration_hour
            week_unwill_meeting[day] += meeting_unwill;
          }else{
            var duration_hour = Math.abs(events[i]["endDate"] - events[i]["startDate"]) /36e5
            var meeting_unwill = unwill * duration_hour
            week_unwill_meeting[day] += meeting_unwill;
          }
          if(meetings_events[j]["feedback"] == 1){
              week_unwill_positive[day] += meeting_unwill
          }
        }
      }
    }
    console.log("week_unwill_meeting",week_unwill_meeting)
    console.log("week_unwill_meeting",week_unwill_positive)
    for(var i=0;i<week_unwill_meeting.length;i++){
       if(week_unwill_meeting[i]==0)
          continue;
       week_unwill_positive[i] /= week_unwill_meeting[i];
       week_unwill_meeting[i] /= 16;
    }

  console.log("week_unwill_meeting",week_unwill_meeting)
  console.log("week_unwill_meeting",week_unwill_positive)
  
  
  
  

  var myLineChart = new Chart(ctxL, {
    type: 'line',
    data: {
      labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      datasets: [
        {
          label: "Total Unwillingness number",
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
          label: "Total Unwillingness number",
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
          label: "Total attendance meeting time",
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

  

  var myLineChart = new Chart(ctxL4, {
    type: 'line',
    data: {
      labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      datasets: [
        {
          label: "Total percentage of unwilling time for meetings",
          data: week_unwill_meeting,
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

  var myLineChart = new Chart(ctxL5, {
    type: 'line',
    data: {
      labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      datasets: [
        {
          label: "Total percentage of unwilling time for meetings with positive feedback",
          data: week_unwill_positive,
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

});
