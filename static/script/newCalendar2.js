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


// get willingness sum in events intervals
function calculateIntervals(total_events){
  // get timestamp of start and end time
  var timestamp_list = []
  console.log(total_events)
  for(var i =0;i<total_events.length; i++){
    var start = total_events[i]["start"]
    var end = total_events[i]["end"]
    timestamp_list.push(start)
    timestamp_list.push(end)
  }
  // sort 
  timestamp_list.sort()

  console.log("sorted result",timestamp_list)
  // iterate each inteval
  var willing_sum = []
  var wanted_indexes = {}
  for(var i = 0; i<timestamp_list.length-1; i++){
    var start = timestamp_list[i];
    var end = timestamp_list[i+1];
    // check how many events contains these interval
    summ = 0
    var flag  = 0
    for(var j = 0; j<total_events.length; j++){
       if(total_events[j]["start"] <= start && total_events[j]["end"] > start){
          summ+= total_events[j]["willingness"];
          flag = 1
       }else if (total_events[j]["start"] >= start && total_events[j]["start"] < end){ 
          summ += total_events[j]["willingness"];
          flag = 1
       }
    }
    if (summ > 1)
          summ = 1
    if(flag == 1){
      wanted_indexes[i] = 1
    }else{
      wanted_indexes[i] = 0
    }
    willing_sum.push(summ)
  }
  // console.log(wanted_indexes)
  // console.log(willing_sum)
  // calculate the color
  var default_color = "#AD1457"
  var interval_events = []
  for(var i = 0; i < timestamp_list.length-1;i++){
     if(timestamp_list[i] == timestamp_list[i+1] || wanted_indexes[i] == 0)
        continue;
     var interval = {
        content: "",
        startDate: new Date(timestamp_list[i]),
        endDate: new Date(timestamp_list[i+1]),
        willingness: willing_sum[i],
        color: shadeColor("#1ea4d800", - willing_sum[i] * 100 +30 )
     }
     // console.log(new Date(timestamp_list[i]))
     interval_events.push(interval);
  }
  return interval_events;

}
$(document).ready(function(){
  // slider part
  var willingness = 0;
  var tag = false,ox = 0,left = 0,bgleft = 0,bar_length = 200,clickable = true;
  var category_color = {Private:"#FF8F00",Professional:"#AD1457",Fun:"#BA0F90",Family:"#AF8C00"};

  // get rendering data
  console.log("js",data_list)  

  var events_data = JSON.parse(data_list); // from rendering
  console.log("getting all events from users friend",events_data)
  var interval_list = calculateIntervals(events_data)






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
  // suppose event 
  $(document).on('click','#superimpose_btn',function(event){
      console.log("superpose now")
      // get friendlist
      var friend_id_list = []
      var checkboxes = $('input[name="usercheckbox"]:checked')
      console.log("checked checkbox", checkboxes)
      for(var i=0;i<checkboxes.length;i++){
        console.log("checkbox i ", checkboxes[i])
        var id = checkboxes[i].value
        friend_id_list.push(id);
      }
      var json_list = {supList: friend_id_list}
      console.log("supList", json_list)
      $.ajax({
              url: '/supCalendarPage',
              type: 'POST',
              data: JSON.stringify(json_list), 
              context: document.body,
              contentType: 'application/json; charset=UTF-8',
              success: function(data) { 
                console.log("sent")
                // console.log(data)
                // $(this).html("")
                $(this).html(data)
                // window.location.reload()
              },
              error: function(e) {
                console.log("error")
                console.log(e)
              }
      });
      // $.post('/supCalendarPage',json_list,function(data,status){
      //     alert(data)
      //     $(document).find("html").html(data);
      // });
  });

  


  $(document).on('click','.btn-sumbit-event',function(event){
      

  });

  YUI().use('aui-button', 'aui-scheduler', 'event-custom-base', function (Y) {

    // var eventRecorder = new Y.SchedulerEventRecorder();
    var scheduler;
    var weekView = new Y.SchedulerWeekView();
    var eventRecorder = new Y.SchedulerEventRecorder({
      on: {
        save: function(event) {
          
         var friend_id_list = []
         var checkboxes = $('input[name="usercheckbox"]:checked')
         console.log("checked checkbox", checkboxes)
         for(var i=0;i<checkboxes.length;i++){
            console.log("checkbox i ", checkboxes[i])
            var id = checkboxes[i].value
            friend_id_list.push(id);
          }     
          this.set("description",$(".input-context").val())
          data = this.getTemplateData();
          var new_event = {start:data["startDate"],end:data["endDate"],title:$(".scheduler-event-recorder-content").val(),
          description:$(".input-context").val(),friend_list:friend_id_list}

          console.log("prepare data",new_event)

          // send to server
          $.ajax({
            url: '/startevent',
            type: 'POST',
            data: JSON.stringify(new_event), 
            contentType: 'application/json; charset=UTF-8',
            success: function(data) { 
              console.log("sent")
              console.log(data)
            },
            error: function(e) {
            console.log(e)
            }
          });

        },
      }
    });
    
    scheduler = new Y.Scheduler({
        boundingBox: '#mySchedule2',
        date: new Date(),
        eventRecorder: eventRecorder,
        items: interval_list,
        views: [weekView]
    }).render();
    // var click_event = $
   
    // scheduler.addEvents([event1])

    var editButton;
    const description = `<textarea class="form-control input-context" 
                          aria-label="With textarea" placeholder="add description"></textarea>`

    const select_bar = ` <div class="dropdown select-category">

                  <button class="btn btn-secondary dropdown-toggle btn-dropdown" data-category="" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fas fa-square select-color"> </i><span></span>
                  </button>

                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item private-option" data-category="Private" href="#">
                      <i class="fas fa-square private-color"> </i><span> Private</span>
                    </a>
                    <a class="dropdown-item professional-option" data-category="Professional" href="#">
                       <i class="fas fa-square professional-color"></i><span> Professional</span>
                    </a>
                    <a class="dropdown-item fun-option" data-category="Fun" href="#">
                      <i class="fas fa-square fun-color"> </i><span> Fun</span>
                    </a>
                    <a class="dropdown-item Family-option" data-category="Family" href="#">
                      <i class="fas fa-square family-color"> </i><span> Family</span>
                    </a>
                  </div>
                </div>`
    var addPlace;
    const submit_btn = `<button type="button" class="btn btn-primary btn-submit-event">Start</button>`

    Y.Do.after(function() {
        // add additional elements
        addPlace = Y.one("#mySchedule2 .popover-content");
        addPlace.appendChild(description);
        // addPlace.appendChild(submit_btn);
        // console.log($(" .toolbar .btn-group").children().first())
        console.log($(".toolbar .btn-group :nth-child(2)"))
        $(".toolbar .btn-group :nth-child(2)").hide();

        // bar
        // if(this.get("willingness")!=undefined){
        //   willingness = this.get("willingness");
        //   // console.log("current willingness",willingness)
        //   left = willingness * bar_length;
        //   $('.progress_btn').css('left', left);
        //   $('.progress_bar').animate({width:left},bar_length);
        //   $('.text').html(parseInt((left/bar_length)*100) + '%');

        // }
        
        // console.log("current click category",this)
         // other option color
         $(".private-color").css('color',category_color["Private"]);
         $(".professional-color").css('color',category_color["Professional"]);
         $(".fun-color").css('color',category_color["Fun"]);
         $(".family-color").css('color',category_color["Family"]);

         $(".private-color").data('category',"Private");
         $(".professional-color").data('category',"Professional");
         $(".fun-color").data('category',"Fun");
         $(".family-color").data('category',"Family");
        
         

        

        
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

