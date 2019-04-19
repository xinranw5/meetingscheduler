var start_hour = 1;
var end_hour = 24;
var event_start_time = 0, event_start_day=0, event_start_hour = 0, event_start_minute = 0;
var event_end_time = 0, event_end_day=0, event_end_hour = 0, event_end_minute = 0;
var current_event = 0;

$(document).ready(function(){
  moment.locale('en');
  var now = moment();

  /**
   * Many events
   */
  var events = [
   {
     start: now.startOf('week').add(1, 'days').add(1, 'h').add(30, 'm').format('X'),
     end: now.startOf('week').add(1, 'days').add(3, 'h').format('X'),
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
  var calendar = $('#calendar').Calendar({
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
  /**
   * Listening for events
   */
  
  $(document).on('Calendar.init','#calendar', function(event, instance, before, current, after){
    console.log('event : Calendar.init is call');
    // console.log(instance);
    // console.log(before);
    // console.log(current);
    // console.log(after);
  });
  $(document).on('Calendar.daynote-mouseenter', '#calendar',function(event, instance, elem){
    // console.log('event : Calendar.daynote-mouseenter');
    // console.log(instance);
    // console.log(elem);
  });
  $(document).on('Calendar.daynote-mouseleave','#calendar', function(event, instance, elem){
    // console.log('event : Calendar.daynote-mouseleave');
    // console.log(instance);
    // console.log(elem);
  });
  $(document).on('Calendar.event-mouseenter','#calendar', function(event, instance, elem){
    // console.log('event : Calendar.event-mouseenter');
    // console.log(instance);
    // console.log(elem);
  });
  $(document).on('Calendar.event-mouseleave','#calendar', function(event, instance, elem){
    // console.log('event : Calendar.event-mouseleave');
    // console.log(instance);
    // console.log(elem);
  });
  $(document).on('Calendar.daynote-click','#calendar', function(event, instance, elem, evt){
    console.log('event : Calendar.daynote-click');
   
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
    console.log("mousedown",event)
    var height = $(this).height();
    console.log(height)
    var percent = (event.pageY - $(this).offset().top)/height;
    event_start_time = start_hour+ (end_hour - start_hour) * percent;
    event_start_hour = Math.floor(event_start_time)
    event_start_minute = (event_start_time - event_start_hour) * 60;
    event_start_day = new Date($(this).parent()[0].attributes[1].nodeValue * 1000).getDay();
    // console.log("mousedown_day",$(".calendar-events-day > ul").parent())
    console.log("mousedown",percent,event_start_day,event_start_time,event_start_hour,event_start_minute);
  });
  // get new event end time and set new event
  $(document).on('mouseup','.calendar-events-day > ul',function(e){
    console.log("mouseup",event)
    var height = $(this).height();
    var percent = (event.pageY - $(this).offset().top)/height;
    event_end_time = start_hour+ (end_hour - start_hour) * percent;
    event_end_hour = Math.floor(event_end_time)
    event_end_minute = (event_end_time - event_end_hour) * 60;
    event_end_day = new Date($(this).parent()[0].attributes[1].nodeValue * 1000).getDay();
    // console.log("mouseup_day",$(".calendar-events-day > ul").parent())
    console.log("mouseup",percent,event_end_day,event_end_time,event_end_hour,event_end_minute);

    if(event_end_time == event_start_time && event_end_day == event_start_day)
      return;
     var new_event = [
      {
        start: now.startOf('week').add(event_start_day, 'days').add(event_start_hour, 'h').add(event_start_minute, 'm').format('X'),
       end: now.startOf('week').add(event_end_day, 'days').add(event_end_hour, 'h').add(event_end_minute, 'm').format('X'),
       title: 'testclick',
       content: 'test',
       category:'Private'
     }];
     
     calendar.addEvents(new_event);
     calendar.init()
  });

  // modal 
  $('#calendar').unbind('Calendar.event-click');


  // click calendar and get the modal
  $(document).on('click','.calendar-event',function(event){
      $('#ModalCenter').modal('show');
      console.log("click event!");
      console.log("get event",$(this)[0].dataset);
      current_event = $(this)[0].dataset; // get the event element data
      event.stopPropagation();
      var sd = new Date(current_event["start"]*1000);
      var ed = new Date(current_event["end"]*1000);
      var sd_hour = ("0" + sd.getHours()).slice(-2);
      var sd_min = ("0" + sd.getMinutes()).slice(-2);
      var ed_hour = ("0" + ed.getHours()).slice(-2);
      var ed_min = ("0" + ed.getMinutes()).slice(-2);
      $(".btn-edit").show()
      $(".modal-title").show()
      $(".modal-text").show()
      $(".btn-submit").addClass('d-none');
      $(".input-title").addClass('d-none');
      $(".input-context").addClass('d-none');
      $(".select-category").addClass('d-none');

      $(".modal-title").html(current_event["title"]);
      $(".modal-text").html(current_event["content"]);
      $(".modal-time").html(sd_hour+":"+sd_min+'-'+ed_hour+":"+ed_min);

      // menu for category
      $(".current-category > i").css('color',current_event["color"]);
      $(".current-category > span").text(" "+current_event["category"])
      $(".select-color").css('color',current_event["color"]);
      $(".btn-dropdown > span").text(" "+current_event["category"])
      // other option color
      $(".private-color").css('color',category_color["Private"]);
      $(".professional-color").css('color',category_color["Professional"]);
      $(".fun-color").css('color',category_color["Fun"]);
      $(".family-color").css('color',category_color["Family"]);

  });
  // go to edit page
  $(document).on('click','.btn-edit',function(e){
      // hide the btn-edit, show btn-submit
      $(".btn-edit").hide()
      $(".btn-submit").removeClass('d-none');
      // replace the original text area as input block, set the default number to be the original word
      // hide the title
      $(".modal-title").hide()
      $(".input-title").removeClass('d-none');
      $(".input-title").val(current_event["title"])
      $(".current-category").hide();
      // hide the context
      
      $(".modal-text").hide()
      $(".input-context").removeClass('d-none');
      $(".input-context").val(current_event["content"])
      $(".select-category").removeClass('d-none');
  });

  // submit changes
  $(document).on('click','.btn-submit',function(e){
      
      var events = calendar.getEvents()
      console.log("current event",events)
      var index = 0;
      var new_events = events.filter(function(item) { 
          return item.start != current_event.start && item.end != current_event.end;
      });
      // find the current event and delete it
      // add new event;
      current_event["title"] = $(".input-title").val();
      current_event["content"] = $(".input-context").val();
      current_event["category"] = $(".btn-dropdown").data("category");
      new_events.push(current_event);
      calendar.setEvents(new_events);
      calendar.init();
      $('#ModalCenter').modal('hide');

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
    
      calendar.setEvents(new_events);
      calendar.init();
      $('#ModalCenter').modal('hide');
  });

});