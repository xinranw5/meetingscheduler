$(document).ready(function(){
  var ctxL = document.getElementById("lineChart").getContext('2d');
  var ctxL2 = document.getElementById("lineChart2").getContext('2d');
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
      data["color"] = shadeColor("#1ea4d800", - data["willingness"] * 100 + 30);
      events.push(data);
  }
  console.log("initial data for suggestion",events)
  var week_unwill_data = [0,0,0,0,0,0,0];
  var week_unwill_mood_data = [0,0,0,0,0,0,0];

  for(var i =0;i<events.length;i++){
    var hour = Math.abs(events[i]["endDate"] - events[i]["startDate"])/36e5
    // console.log("hour",hour)
    var unwill = events[i]["willingness"]
    var day = events[i]["startDate"].getDay()
    week_unwill_data[day] += (unwill*hour);
    if(events[i]["category"] == 'mood'){
      week_unwill_mood_data[day]+= (unwill*hour);
    }
  }
  console.log(week_unwill_data)
  var myLineChart = new Chart(ctxL, {
    type: 'line',
    data: {
      labels: ["Sunday", "Monday", "Tuesday", "March", "Thursday", "Friday", "Saturday"],
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
      labels: ["Sunday", "Monday", "Tuesday", "March", "Thursday", "Friday", "Saturday"],
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

});
