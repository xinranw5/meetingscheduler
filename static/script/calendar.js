
// get color darken or lighter
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
  var start_hour = 1;
  var end_hour = 24;
  var event_start_time = 0, event_start_day=0, event_start_hour = 0, event_start_minute = 0;
  var event_end_time = 0, event_end_day=0, event_end_hour = 0, event_end_minute = 0;
  var current_event = 0;
  var total_events = []
  var willingness = 0;
  var tag = false,ox = 0,left = 0,bgleft = 0,bar_length = 300,clickable = false;
  var start_day_timestamp = 0, end_day_timestamp = 0,start_timestamp = 0, end_timestamp = 0;
  moment.locale('en');
  var now = moment();
  var edit = 0; // 1 is edit mode
  /**
   * Many events
   */
  var events = [
   {
     start: now.startOf('week').add(1, 'days').add(1, 'h').add(30, 'm').format('X'),
     end: now.startOf('week').add(3, 'days').add(3, 'h').format('X'),
     title: '28',
     content: 'Hello World! <br> <p>Foo Bar</p>',
     category:'Private'
   }
  ];

  /**
   * A daynote
   */
  var daynotes = [
    // {
    //   time: now.startOf('week').add(1,'days').add(1, 'h').add(30, 'm').format('X'),
    //   end: now.startOf('week').add(1, 'days').add(2, 'h').add(30, 'm').format('X'),
    //   title: 'Leo\'s holiday',
    //   content: 'yo',
    //   category: 'holiday'
    // }
  ];

  /**
   * Init the calendar
   */

  var calendar = $('#userCalendar').Calendar({
    locale: 'en',
    weekday: {
      timeline: {
        intervalMinutes: 30,
        fromHour: start_hour,
        toHour:23
      }
    },
    events: events,
    daynotes: daynotes,
    colors:{
      random: false
    }
  });
 
  var category_color = {Private:"#FF8F00",Professional:"#AD1457",Fun:"#BA0F90",Family:"#AF8C00"};
  var revise_info = {title:"",content:"",category:""};
  calendar.setEventCategoriesColors([{category:"Private", color: "#FF8F00"}, {category:"Professional", color:"#AD1457"}, {category:"Fun", color: "#BA0F90"}, {category:"Family", color: "#AF8C00"}]);
  calendar.init();
  console.log("calendar first",calendar)
  var calendar2 = $('#supCalendar').Calendar({
    locale: 'en',
    weekday: {
      timeline: {
        intervalMinutes: 30,
        fromHour: start_hour,
        toHour:23
      }
    },
    events: events,
    daynotes: daynotes,
    colors:{
      random: false
    }
  });
  calendar2.init()
  /**
   * Listening for events
   */
  
  $(document).on('Calendar.init','#calendar', function(event, instance, before, current, after){
    console.log('event : Calendar.init is call');
  });
  $(document).on('Calendar.daynote-mouseenter', '#calendar',function(event, instance, elem){
  });
  $(document).on('Calendar.daynote-mouseleave','#calendar', function(event, instance, elem){
    
  });
  $(document).on('Calendar.event-mouseenter','#calendar', function(event, instance, elem){
    
  });
  $(document).on('Calendar.event-mouseleave','#calendar', function(event, instance, elem){
    
  });
  $(document).on('Calendar.daynote-click','#calendar', function(event, instance, elem, evt){   
  });
 
  
  // if there is an event, don't create new event
  $(document).on('mousedown','.calendar-event',function(event){
      event.stopPropagation();
  });
  $(document).on('mouseup','.calendar-event',function(event){
      event.stopPropagation();
  });


  // get new event start time
  $(document).on('mousedown','.calendar-events-day > ul',function(e){
    clickable = false;
    console.log("mousedown",event)
    var height = $(this).height();
    console.log(height)
    var percent = (event.pageY - $(this).offset().top)/height;
    event_start_time = start_hour+ (end_hour - start_hour) * percent;
    event_start_hour = Math.floor(event_start_time)
    event_start_minute = Math.floor((event_start_time - event_start_hour) * 60);
    // console.log("start_minute",event_start_minute)
    start_day_timestamp = $(this).parent()[0].attributes[1].nodeValue
    start_timestamp = new Date(start_day_timestamp * 1000)
    start_timestamp.setHours(event_start_hour)
    start_timestamp.setMinutes(event_start_minute)
    console.log("new start date",start_timestamp)
    event_start_day = new Date(start_timestamp * 1000).getDay();
    // console.log("mousedown",percent,event_start_day,event_start_time,event_start_hour,event_start_minute);
  });


  // get new event end time and set new event
  $(document).on('mouseup','.calendar-events-day > ul',function(e){
    console.log("mouseup",event)
    clickable = true;
    //willingness
    tag = false,ox = 0,left = 0,bgleft = 0;
    var height = $(this).height();
    var percent = (event.pageY - $(this).offset().top)/height;
    event_end_time = start_hour+ (end_hour - start_hour) * percent;
    event_end_hour = Math.floor(event_end_time)
    event_end_minute = Math.floor((event_end_time - event_end_hour) * 60);
    
    event_end_day = new Date(end_timestamp * 1000).getDay();
    end_day_timestamp = $(this).parent()[0].attributes[1].nodeValue;
    end_timestamp = new Date(end_day_timestamp * 1000)
    end_timestamp.setHours(event_end_hour)
    end_timestamp.setMinutes(event_end_minute)
    console.log("new end date",end_timestamp)

    console.log("mouseup_day",$(this).parent()[0].dataset)
    // console.log("mouseup",percent,event_end_day,event_end_time,event_end_hour,event_end_minute);


    if(event_end_time == event_start_time && event_end_day == event_start_day)
      return;
     var new_event = [
      {
       start: moment(start_timestamp).format('X'),
       end: moment(end_timestamp).format('X'),
       title: 'testclick',
       content: 'test',
       category:'Private',
       willingness:0
     }];
     console.log("new event",new_event)

     total_events.push(new_event[0]);

     calendar.addEvents(new_event);
     calendar.init()
     current_event = new_event[0];

     // after generating new event slot
     // hide text and display input
     $('#ModalCenter').modal('show');
     $(".modal-text").hide();
     $(".btn-edit").hide();
     $(".btn-submit").show();
     $(".modal-title").hide();
     $(".current-category").hide();
     $(".modal-input-time").show();
     $(".input-context-group").show();
     console.log("show input-context-group")
     $(".input-title-area").show()
     // remove the old word in input area
     $(".input-context").val("")
     $(".input-title").val("")
     // show time
     var sd_hour = ("0" + event_start_hour).slice(-2);
     var sd_min = ("0" + event_start_minute).slice(-2);
     var ed_hour = ("0" + event_end_hour).slice(-2);
     var ed_min = ("0" + event_end_minute).slice(-2);
     // console.log(sd_hour,sd_min,ed_hour,ed_min)
     $(".start-hour").val(sd_hour)
     $(".start-minute").val(sd_min)
     $(".end-hour").val(ed_hour)
     $(".end-minute").val(ed_min)

      // menu for category
     $(".btn-dropdown > i").css('color',category_color["Private"]);
     $(".btn-dropdown > span").text(" Private")
     $(".select-category").show()
     // other option color
     $(".private-color").css('color',category_color["Private"]);
     $(".professional-color").css('color',category_color["Professional"]);
     $(".fun-color").css('color',category_color["Fun"]);
     $(".family-color").css('color',category_color["Family"]);
     $(".btn-dropdown").data("category","Private")
     // willingness bar  position
     $('.progress_btn').css('left', left);
     $('.progress_bar').width(left);
     $('.text').html(parseInt((left/300)*100) + '%');
     $('.progress_btn').show();
  });

  // modal 
  $('#calendar').unbind('Calendar.event-click');


  // click calendar and get the modal
  $(document).on('click','.calendar-event',function(event){

      console.log('click event')
      $('#ModalCenter').modal('show');
      console.log("click event!");
      console.log("get event",$(this)[0].dataset);
      current_event = $(this)[0].dataset; // get the event element data
      // find willingness
      var current_item = total_events.filter(function(item) { 
          return item.start == current_event.start && item.end == current_event.end;
      });
      current_event["willingness"] = current_item[0]["willingness"]
      willingness = current_event["willingness"]

      event.stopPropagation();
      start_day_timestamp = $(this).parent().parent()[0].attributes[1].nodeValue;
      end_day_timestamp = $(this).parent().parent()[0].attributes[1].nodeValue;
      console.log("parent data",parent)
      start_timestamp = current_event["start"];
      end_timestamp = current_event["end"];
      var sd = new Date(current_event["start"]*1000);
      var ed = new Date(current_event["end"]*1000);
      var sd_hour = ("0" + sd.getHours()).slice(-2);
      var sd_min = ("0" + sd.getMinutes()).slice(-2);
      var ed_hour = ("0" + ed.getHours()).slice(-2);
      var ed_min = ("0" + ed.getMinutes()).slice(-2);
      //time
      $(".start-hour").val(sd_hour)
      $(".start-minute").val(sd_min)
      $(".end-hour").val(ed_hour)
      $(".end-minute").val(ed_min)

      $(".btn-edit").show()
      $(".modal-title").show()
      $(".modal-text").show()
      $(".btn-submit").hide();
      $(".modal-input-time").hide();
      $(".input-title-area").hide();
      // $(".input-context").hide();
      $(".select-category").hide();

      $(".modal-title").html(current_event["title"]);
      $(".modal-text").html(current_event["content"]);
      $(".modal-time").html(sd_hour+":"+sd_min+'-'+ed_hour+":"+ed_min);

      $(".input-context-group").hide();
      // menu for category
      $(".current-category").show()
      $(".current-category > i").css('color',current_event["color"]);
      $(".current-category > span").text(" "+current_event["category"])
      $(".select-color").css('color',current_event["color"]);
      $(".btn-dropdown > span").text(" "+current_event["category"])
      // other option color
      $(".private-color").css('color',category_color["Private"]);
      $(".professional-color").css('color',category_color["Professional"]);
      $(".fun-color").css('color',category_color["Fun"]);
      $(".family-color").css('color',category_color["Family"]);

      // willingness bar  position
     left = bar_length*willingness
     console.log("now bar left",left)
     $('.progress_btn').css('left', left);
     $('.progress_bar').width(left);
     $('.text').html(parseInt(willingness*100) + '%');
     clickable =false;
     $('.progress_btn').hide();
  });
  // go to edit page
  $(document).on('click','.btn-edit',function(e){
      // hide the btn-edit, show btn-submit
      edit = 1;
      $(".btn-edit").hide()
      $(".btn-submit").show();
      // replace the original text area as input block, set the default number to be the original word
      // hide the title
      $(".modal-title").hide()
      $(".input-title-area").show();
      $(".input-title").val(current_event["title"])
      $(".current-category").hide();
      // hide the context
      
      $(".modal-text").hide()
      $(".input-context").show();
      $(".input-context").val(current_event["content"])
      $(".select-category").show();
      $(".modal-input-time").show();
      $(".modal-time").hide();
      $(".input-context-group").show();
      $('.progress_btn').show();
      clickable = true;

  });

  // submit changes
  $(document).on('click','.btn-submit',function(e){
      
      var events = calendar.getEvents()
      console.log("current event",events)
      var index = 0;
      // remove old event
      var new_events = events.filter(function(item) { 
          return item.start != current_event.start && item.end != current_event.end;
      });
      var new_total_events = total_events.filter(function(item) { 
          return item.start != current_event.start && item.end != current_event.end;
      });
      // find the current event and delete it
      // add new event;
      // moment.locale('en');
      // var now = moment();
      current_event["title"] = $(".input-title").val();
      current_event["content"] = $(".input-context").val();
      current_event["category"] = $(".btn-dropdown").data("category");
      console.log($(".start-hour").val(),$(".start-minute").val(),$(".end-hour").val(),$(".end-minute").val())
      sh = parseInt($(".start-hour").val(),10)
      sm = parseInt($(".start-minute").val(),10)
      eh = parseInt($(".end-hour").val(),10)
      em = parseInt($(".end-minute").val(),10)
      sd = (new Date(current_event["start"] * 1000) ).getDay()
      // console.log(sh,sm,eh,em)
      start_timestamp = new Date(start_day_timestamp * 1000)
      start_timestamp.setHours(sh)
      start_timestamp.setMinutes(sm)
      end_timestamp = new Date(end_day_timestamp * 1000)
      end_timestamp.setHours(eh)
      end_timestamp.setMinutes(em)

      st = moment(start_timestamp).format('X')
      et = moment(end_timestamp).format('X')
      // console.log(new Date(st * 1000),new Date(et * 1000))
      current_event["start"] = st
      current_event["end"] = et
      current_event["willingness"] = willingness;
      current_event["color"] = shadeColor(category_color[current_event["category"]],willingness*100 - 50)
      console.log("change color",current_event["color"],willingness)
      new_events.push(current_event);
      new_total_events.push(current_event)
      total_events = new_total_events;
      calendar.setEvents(new_events);
      calendar.init();
      $('#ModalCenter').modal('hide');
      console.log("total_events",total_events)
      clickable = false;
      $(".calendar-event[data-start='"+current_event["start"]+"'][data-end='"+current_event["end"]+"']").css('background', current_event["color"]);
      console.log($(".calendar-event[data-start='"+current_event["start"]+"'][data-end='"+current_event["end"]+"']"))
      console.log(JSON.stringify(current_event))
      // post data to database
      if(edit ==0){
          $.ajax({
          url: '/save_activity/',
          type: 'POST',
          data: JSON.stringify(current_event), 
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
      }else{
        edit = 0;
        // $.ajax({
        //   url: '/update_activity/',
        //   type: 'POST',
        //   data: JSON.stringify(current_event), 
        //   contentType: 'application/json; charset=UTF-8',
        //   dataType: 'json', 
        //   success: function(data) { 
        //     console.log("sent")
        //     console.log(data)
        //   },
        //   error: function(e) {
        //   console.log(e)
        //   }
        // });
      }
      console.log("submit done")
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

  // delete event
  $(document).on('click','.btn-delete',function(e){
      var events = calendar.getEvents()
      var new_events = events.filter(function(item) { 
          return item.start != current_event.start && item.end != current_event.end;
      });
      var new_total_evnets = total_events.filter(function(item) { 
          return item.start != current_event.start && item.end != current_event.end;
      });
      total_events = new_total_evnets
      calendar.setEvents(new_events);
      calendar.init();
      $('#ModalCenter').modal('hide');

      // $.ajax({
      //   url: '/delete_activity/',
      //   type: 'POST',
      //   data: JSON.stringify(current_event), 
      //   contentType: 'application/json; charset=UTF-8',
      //   dataType: 'json', 
      //   success: function(data) { 
      //     console.log("delete")
      //     console.log(data)
      //   },
      //   error: function(e) {
      //     console.log(e)
      //   }
      // });
  });
  // slider part
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
      if (tag && clickable) {
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
      if (!tag && clickable) {
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



});

 
