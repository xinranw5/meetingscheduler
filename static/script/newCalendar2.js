

$(document).ready(function(){
  // slider part
  var willingness = 0;
  var tag = false,ox = 0,left = 0,bgleft = 0,bar_length = 200,clickable = true;
  var total_events = [];
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

  YUI().use('aui-button', 'aui-scheduler', 'event-custom-base', function (Y) {

    // var eventRecorder = new Y.SchedulerEventRecorder();
    var weekView = new Y.SchedulerWeekView();
    var eventRecorder = new Y.SchedulerEventRecorder({
      on: {
        save: function(event) {
          //
          this.set("willingness", willingness)
          this.set("description",$(".input-context").val())
          data = this.getTemplateData();
          var new_event = {start:data["startDate"],end:data["endDate"],title:data["content"],willingness:this.get("willingness"),description:this.get("description")}
          console.log(this,this.getTemplateData(),new_event)

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
          alert('Delete Event:' + this.isNew() + ' --- ' + this.getContentNode().val());
  // Note: The cancel event seems to be buggy and occurs at the wrong times, so I commented it out.
  //      },
  //      cancel: function(event) {
  //        alert('Cancel Event:' + this.isNew() + ' --- ' + this.getContentNode().val());
        }
      }
    });

    new Y.Scheduler({
        boundingBox: '#mySchedule2',
        date: new Date(2014, 8, 28),
        eventRecorder: eventRecorder,
        items: [],
        views: [weekView]
    }).render();

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
    var description = `<textarea class="form-control input-context" 
                          aria-label="With textarea" placeholder="add description"></textarea>`
    Y.Do.after(function() {
        var addPlace = Y.one("#mySchedule2 .popover-content");
        var toolbarBtnGroup = Y.one('#mySchedule2 .toolbar .btn-group');
        toolbarBtnGroup.appendChild('<button id="edit" type="button">Edit</button>');
        addPlace.appendChild(bar);
        addPlace.appendChild(description)
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

