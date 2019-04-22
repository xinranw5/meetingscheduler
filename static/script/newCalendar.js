// $(document).ready(function(){
//  YUI().use(
//   'aui-scheduler',
//   function(Y) {
//     var events = [
//       {
//         content: 'AllDay',
//         endDate: new Date(2013, 1, 5, 23, 59),
//         startDate: new Date(2013, 1, 5, 0),
//         color: '#000000',
//         id: "123",
//         name: "456"
//       },
     
//     ];

//     var agendaView = new Y.SchedulerAgendaView();
//     var dayView = new Y.SchedulerDayView();
//     var eventRecorder = new Y.SchedulerEventRecorder();
//     var monthView = new Y.SchedulerMonthView();
//     var weekView = new Y.SchedulerWeekView();
// //     var eventRecorder = new Y.SchedulerEventRecorder({
// //     on: {
// //       save: function(event) {
// //         console.log(this.get("name"))
// //         alert('Save Event:'  + this.isNew() + ' --- ' + this.getContentNode().val());
// //       },
// //       edit: function(event) {
// //         alert('Edit Event:' + this.isNew() + ' --- ' + this.getContentNode().val());
// //       },
// //       delete: function(event) {
// //         alert('Delete Event:' + this.isNew() + ' --- ' + this.getContentNode().val());
// // // Note: The cancel event seems to be buggy and occurs at the wrong times, so I commented it out.
// // //      },
// // //      cancel: function(event) {
// // //        alert('Cancel Event:' + this.isNew() + ' --- ' + this.getContentNode().val());
// //       }
// //     }
//   // });
//     var scheduler = new Y.Scheduler(
//       {
//         activeView: weekView,
//         boundingBox: '#myScheduler',
//         date: new Date(2013, 1, 4),
//         eventRecorder: eventRecorder,
//         items: events,
//         render: true,
//         views: [dayView, weekView, monthView, agendaView]
//       }
//     );
//     var a = scheduler.getEvent("456");
//     console.log(scheduler.getEvents(),eventRecorder)
//     Y.Do.after(function() {
//         // Assuming that the boundingBox of your Scheduler has an id of "bb":
//         var toolbarBtnGroup = Y.one('#myScheduler .yui3-widget-stdmod');
//         console.log(toolbarBtnGroup)
//         toolbarBtnGroup.appendChild('<button id="editdd" type="button">Editdd</button>');
//     }, eventRecorder, 'showPopover');

//   }
// );
// });
//      

$(document).ready(function(){
  // slider part
  var willingness = 0;
  var tag = false,ox = 0,left = 0,bgleft = 0,bar_length = 200,clickable = true;
  var total_events = [];
  var category_color = {Private:"#FF8F00",Professional:"#AD1457",Fun:"#BA0F90",Family:"#AF8C00"};

 


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

  YUI().use('aui-button','event', 'aui-scheduler', 'event-custom-base', function (Y) {

    // var eventRecorder = new Y.SchedulerEventRecorder();
    var weekView = new Y.SchedulerWeekView();
    var eventRecorder = new Y.SchedulerEventRecorder({
      on: {
        save: function(event) {
          this.set("category",$(".btn-dropdown").data("category"))
          this.set("willingness", willingness)
          this.set("description",$(".input-context").val())
          data = this.getTemplateData();
          var new_event = {start:data["startDate"],end:data["endDate"],title:data["content"],
          willingness:this.get("willingness"),description:this.get("description"),category:this.get("category")}

          console.log("prepare data",this,this.getTemplateData(),new_event)

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
          alert('Edit Event:' + this.isNew() + ' --- ' + this.getContentNode().val());
        },
        delete: function(event) {
          // alert('Delete Event:' + this.isNew() + ' --- ' + this.getContentNode().val())
          data = this.getTemplateData();
          var old_event = {start:data["startDate"],end:data["endDate"],title:data["content"],
          willingness:this.get("willingness"),description:this.get("description"),category:this.get("category")}

          console.log(this,this.getTemplateData(),old_event)

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

    new Y.Scheduler({
        boundingBox: '#mySchedule',
        date: new Date(2014, 8, 28),
        eventRecorder: eventRecorder,
        items: [],
        views: [weekView]
    }).render();
    var click_event = $

    var editButton;
    const bar = `<div class="willingness">
                  <h3>Willingness</h3>
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

    Y.Do.after(function() {
        var addPlace = Y.one("#mySchedule .popover-content");
        var toolbarBtnGroup = Y.one('#mySchedule .toolbar .btn-group');
        toolbarBtnGroup.appendChild('<button id="edit" type="button">Edit</button>');
        addPlace.appendChild(bar);
        addPlace.appendChild(description);
        addPlace.appendChild(select_bar);
         // other option color
         $(".private-color").css('color',category_color["Private"]);
         $(".professional-color").css('color',category_color["Professional"]);
         $(".fun-color").css('color',category_color["Fun"]);
         $(".family-color").css('color',category_color["Family"]);

        editButton = new Y.Button({
            // label: 'Edit',
            srcNode: '#edit',
        }).render();

        editButton.on('click', function(event) {
            alert('Edit clicked!');
            eventRecorder.hidePopover();
        });
    }, eventRecorder, 'showPopover');
    
    Y.Do.after(function() {
        
        // Make sure that the editButton is destroyed to avoid a memory leak.
        if (editButton) {
            editButton.destroy();
        }
    }, eventRecorder, 'hidePopover');
});


})

