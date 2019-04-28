// $(document).ready(function(){
//  YUI().use(
//   'aui-scheduler',
//   function(Y) {
    // var events = [
    //   {
    //     content: 'AllDay',
    //     endDate: new Date(2013, 1, 5, 23, 59),
    //     startDate: new Date(2013, 1, 5, 0),
    //     color: '#000000',
    //     id: "123",
    //     name: "456"
    //   },
     
    // ];


// );
// });
//      
// var table_data0 = '{{actList|tojson}}'
function shadeColor(color, percent) {

    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
}

$(document).ready(function(){
  // slider part
  var willingness = 0;
  var tag = false,ox = 0,left = 0,bgleft = 0,bar_length = 200,clickable = true;
  var total_events = [];
  var category_color = {activity:"#FF8F00",mood:"#AD1457"};
  console.log("js",table_data0)
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
      // data["color"] = shadeColor(category_color[data_json[i]["category"]], data["willingness"] * 100 -50);

      events.push(data);
  }
  console.log("initial data",events)
  


  // generate report  
  // according to events
  $(document).on('click','.suggestions-tag',function(e){

      // weekday time
      var weekday_time = 1000*60*60*24*5;
      var weekend_time = 1000*60*60*24*2;

      // get total count
      var week_act_time_sum = 0;
      var weekend_act_time_sum = 0;
      var weekday_act_time_sum = 0;
      var week_unwill_sum = 0;
      var weekend_unwill_sum = 0;
      var weekday_unwill_sum = 0;
      var wake_up_time = 0;
      var sleep_time = 0;
      var weekend_late_sleep_day =0, weekday_late_sleep_day = 0;

      for(var i=0;i<events.length;i++){
        var dis_time = events[i]['endDate'].getTime() - events[i]['startDate'].getTime()
        var start_hour =  events[i]['startDate'].getHours();
        var end_hour = events[i]['endDate'].getHours();
        console.log(start_hour,end_hour)
        week_act_time_sum+=dis_time
        week_unwill_sum+=events[i]["willingness"];

        if(events[i]['startDate'].getDay() == 0 || events[i]['startDate'].getDay() == 6){
          weekend_act_time_sum+=dis_time
          weekend_unwill_sum+=events[i]["willingness"];
          if(start_hour>=1 && end_hour <= 7){
            weekend_late_sleep_day += 1
          }
        }else{
          weekday_act_time_sum+=dis_time
          weekday_unwill_sum+=events[i]["willingness"];
          if(start_hour>=1 && end_hour <= 7){
            weekend_late_sleep_day += 1
          }
        }
        console.log("week_act_time_sum",week_act_time_sum)
        console.log("week_time",weekday_time + weekend_time)
        

      }
      var percent_set_act_week = week_act_time_sum / (weekday_time+weekend_time)
      var percent_set_act_weekend =  weekend_act_time_sum / weekend_time
      var percent_set_act_weekday =  weekday_act_time_sum / weekday_time
      // total number
      $("#activityTbody tr :nth-child(1)").html(events.length);
      $("#sug_week_perc").html((percent_set_act_week * 100).toFixed(2));
      $("#sug_weekend_perc").html((percent_set_act_weekend * 100).toFixed(2));
      $("#sug_weekday_perc").html((percent_set_act_weekday * 100).toFixed(2));

      $("#unw_week_perc").html((week_unwill_sum/events.length * 100).toFixed(2));
      $("#unw_weekend_perc").html((weekend_unwill_sum/events.length * 100).toFixed(2));
      $("#unw_weekday_perc").html((weekday_unwill_sum/events.length * 100).toFixed(2));


      $("#late_week").html(weekend_late_sleep_day+weekday_late_sleep_day);
      $("#late_weekend").html(weekend_late_sleep_day);
      $("#late_weekday").html(weekday_late_sleep_day);

      // get total time
      
      
      // suggestion for going out
      var act_suggestion = "",unw_suggestion = "", sleep_sug="";
      if(percent_set_act_week < 0.4){
          act_suggestion= "Hey, there are so much fun to have more activities! Why not try more?";
      }else if (percent_set_act_week > 0.8){
        act_suggestion = "Hey, don't push yourself too hard! Try to relax more!"
      }else{
        act_suggestion = "Hey, keep up with this attitude!"
      }

      if((week_unwill_sum/events.length * 100).toFixed(2) > 0.7){
        unw_suggestion = "Meeting with friends would gain more fun!"
      }else{
        unw_suggestion = "You have a great attitude towards social activity, keep it up!"
      }

      if(weekend_late_sleep_day+weekday_late_sleep_day >= 3){
        sleep_sug = "Sleep more to relax yourself!"
      }else{
        sleep_sug = "You sleep habit is good, keep it up!"
      }

      $("#sug_for_activity").html(act_suggestion);
      $("#sug_for_events").html(unw_suggestion);
      $("#sug_for_late_sleep").html(sleep_sug);


  });





  // select other category
  $(document).on('click','.dropdown-menu>a',function(e){
    var c = $(this).children('i').css("color");
    var t = $(this).children("span").text();

    console.log("c,t",c,t)
    $(".btn-dropdown > i").css('color',c);
    $(".btn-dropdown > span").text(t);
    $(".btn-dropdown").data("category",$(this).data("category"))

  });
  $(document).on('mousedown','.progress_btn',function(e) {
      if(clickable){
        ox = e.pageX - left;
        tag = true;
      }
      
  });
  $(document).on('mouseup','.progress',function(e) {
      tag = false;
      willingness = left/bar_length // [0,1]
      console.log("mouseup for bar",willingness,left)

  });
  $(document).on('mousemove','.progress',function(e) {//mouse move
      if (tag) {
          left = e.pageX - ox;
          if (left <= 0) {
              left = 0;
          }else if (left > bar_length) {
              left = bar_length;
          }
          $('.progress_btn').css('left', left);
          $('.progress_bar').width(left);
          $('.text').html(parseInt((left/bar_length)*100) + '%');
      }
  });
  $(document).on('click','.progress_bg',function(e) {// mouse click
      if (!tag) {
          bgleft = $('.progress_bg').offset().left;
          left = e.pageX - bgleft;
          if (left <= 0) {
              left = 0;
          }else if (left > bar_length) {
              left = bar_length;
          }
          $('.progress_btn').css('left', left);
          $('.progress_bar').animate({width:left},bar_length);
          $('.text').html(parseInt((left/bar_length)*100) + '%');
      }
  });
  function findmatchEvent(events,current_event){
    console.log("find",events,current_event)
    for(var i =0;i<events.length;i++){

      if(events[i]["startDate"].getTime() == current_event["startDate"] && events[i]["endDate"].getTime() == current_event["endDate"] && events[i]["content"] == current_event["content"])
        return i;
    }
    return -1;
  }
  YUI().use('aui-button', 'aui-scheduler', 'event-custom-base', function (Y) {

    // var eventRecorder = new Y.SchedulerEventRecorder();
    var scheduler;
    var weekView = new Y.SchedulerWeekView();
    var eventRecorder = new Y.SchedulerEventRecorder({
      on: {
        save: function(event) {
          
          
          // console.log("on save event",event)
          // event["currentTarget"].set('color','#000000')
          // console.log("new event",event,event["currentTarget"].get('endDate'))
          // this.syncUI()
          // console.log("node",this.get('node'))
          // event.currentTarget.set("color","#0AA000")

          console.log("event",this)
          this.set("content",$(".scheduler-event-recorder-content").val())
          this.set("category",$(".btn-dropdown").data("category"))
          this.set("willingness", willingness)
          this.set("description",$(".input-context").val())
          var current_color = category_color[this.get("category")];
          // if (current_color!=undefined)
          //   this.set("color",current_color)

          data = this.getTemplateData();
          var new_event = {start:data["startDate"],end:data["endDate"],title:data["content"],
          willingness:this.get("willingness"),description:this.get("description"),category:this.get("category")}

          console.log("prepare data",this.getTemplateData(),new_event)
          var addevent =new_event;
          addevent["startDate"] = new Date(new_event["start"])
          addevent["endDate"] = new Date(new_event["end"])
          addevent["content"] = new_event["title"]
          addevent["category"] = new_event["category"]
          console.log(addevent)
          events.push(addevent)
          // send to server

          $.ajax({
            url: '/save_activity/',
            type: 'POST',
            data: JSON.stringify(new_event), 
            contentType: 'application/json; charset=UTF-8',
            dataType: 'json', 
            success: function(data) { 
              console.log("sent")
              console.log(data)
            },
            error: function(e) {
            console.log(e)
            }
          });

        },
        edit: function(event) {
          // alert('Edit Event:' + this.isNew() + ' --- ' + this.getContentNode().val());

          this.set("content",$(".scheduler-event-recorder-content").val())
          this.set("category",$(".btn-dropdown").data("category"))
          this.set("willingness", willingness)
          this.set("description",$(".input-context").val())
          var current_color = category_color[eventRecorder.get("category")];
          // if (current_color!=undefined)
          //   this.set("color",current_color)
          data = this.getTemplateData();
          var edit_event = {start:data["startDate"],end:data["endDate"],title:data["content"],
          willingness:this.get("willingness"),description:this.get("description"),category:this.get("category")}
          var index = findmatchEvent(events, this.getTemplateData())
          console.log("edit",events,edit_event)
          if(index>=0){
            var will = edit_event["willingness"]
            console.log(events,index)
            events[index]["willingness"] = will
            events[index]["description"] = edit_event["description"]
            events[index]["category"] = edit_event["category"]
          }
          // console.log("prepare edit data",eventRecorder,edit_event)

          // send to server
          $.ajax({
            url: '/update_activity/',
            type: 'POST',
            data: JSON.stringify(edit_event), 
            contentType: 'application/json; charset=UTF-8',
            dataType: 'json', 
            success: function(data) { 
              console.log("sent")
              console.log(data)
            },
            error: function(e) {
            console.log(e)
            }
          });
        },
        delete: function(event) {
          data = this.getTemplateData();
          var old_event = {start:data["startDate"],end:data["endDate"],title:data["content"],
          willingness:this.get("willingness"),description:this.get("description"),category:this.get("category")}
          var old = old_event;
          old["startDate"] = new Date(old_event["start"])
          old["endDate"] = new Date(old_event["end"])
          var index = findmatchEvent(events, old)
          if(index>=0){
            events = events.splice(index,1)
          }
          // console.log(this,this.getTemplateData(),old_event)

          // send to server
          $.ajax({
            url: '/delete_activity/',
            type: 'POST',
            data: JSON.stringify(old_event), 
            contentType: 'application/json; charset=UTF-8',
            dataType: 'json', 
            success: function(data) { 
              console.log("sent delete")
              console.log(data)
            },
            error: function(e) {
            console.log(e)
            }
          });

        }
      }
    });
    
    scheduler = new Y.Scheduler({
        boundingBox: '#mySchedule',
        date: new Date(),
        eventRecorder: eventRecorder,
        items: events,
        views: [weekView]
    }).render();
    // var click_event = $
   
    // scheduler.addEvents([event1])

    var editButton;
    const bar = `<div class="willingness">
                  <h3>Unwillingness</h3>
                  <div class="text">0%</div>
                  <div class="progress">
                    <div class="progress_bg">
                        <div class="progress_bar"></div>
                    </div>
                    <div class="progress_btn"></div>
                    
                  </div>
                </div>`;
    const description = `<textarea class="form-control input-context" 
                          aria-label="With textarea" placeholder="add description"></textarea>`

    const select_bar = ` <div class="dropdown select-category">

                  <button class="btn btn-secondary dropdown-toggle btn-dropdown" data-category="" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fas fa-square select-color"> </i><span></span>
                  </button>

                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item private-option" data-category="activity" href="#">
                      <i class="fas fa-square activity-color"> </i><span> Activity</span>
                    </a>
                    <a class="dropdown-item professional-option" data-category="mood" href="#">
                       <i class="fas fa-square mood-color"></i><span> Mood</span>
                    </a>
                  </div>
                </div>`
    var addPlace;
    Y.Do.after(function(e) {
        // add additional elements

        addPlace = Y.one("#mySchedule .popover-content");
        addPlace.appendChild(bar);
        addPlace.appendChild(description);
        addPlace.appendChild(select_bar);
        var current_category = this.get("category")
        var current_click = this.getTemplateData()
        current_click["title"] = current_click["content"];
        // find the current event
        var index = findmatchEvent(events,current_click)
        if(index>=0){
          $(".input-context").val(events[index]["description"])
          willingness = events[index]["willingness"]
          // console.log("current willingness",willingness)
          left = willingness * bar_length;
          $('.progress_btn').css('left', left);
          $('.progress_bar').animate({width:left},bar_length);
          $('.text').html(parseInt((left/bar_length)*100) + '%');
          console.log("willingness",this.getTemplateData())
          // console.log(category_color[events[index]["category"]])
          // menu for category
          $('.select-color').css('color',category_color[events[index]["category"]])
          $(".btn-dropdown > i").css('color',category_color[current_category]);
          if(events[index]["category"] !=undefined)
            $(".btn-dropdown > span").text(" " + events[index]["category"])
          else
            $(".btn-dropdown > span").text("")
          $(".btn-dropdown").data("category",current_category)
        }else{
           // menu for category
         // $(".btn-dropdown > i").css('color',category_color[current_category]);
         $(".btn-dropdown > span").text(" select")
         // $(".btn-dropdown").data("category",current_category)
        }
        
        
        // // bar
        // if(this.get("willingness")!=undefined){
          

        // }
        
        // console.log("current click category",this)
         // other option color
         $(".activity-color").css('color',category_color["activity"]);
         $(".mood-color").css('color',category_color["mood"]);
         

         
        
         // set bar
         // console.log("willingness",this.get("willingness"))
         // console.log("area",area)

        

        
    }, eventRecorder, 'showPopover');
    
    Y.Do.after(function() {

      // var current_category = this.get("category")
      // // menu for category
      // $(".btn-dropdown > i").css('color',category_color[current_category]);
      // $(".btn-dropdown > span").text(current_category)
      // console.log("after hide popover",this.get("color"),this.get("category"))
      
      var current_color = category_color[this.get("category")];
      // this.setStyle({"color":current_color})
      // this.set("color",current_color);
      // console.log("change event",this);
        // Make sure that the editButton is destroyed to avoid a memory leak.
      // var current_color = category_color[this.get("category")];

        // console.log("change",$(".scheduler-event").css("background-color"))
      
    }, eventRecorder, 'hidePopover');
});


})

