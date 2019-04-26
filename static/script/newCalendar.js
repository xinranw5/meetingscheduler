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
  var category_color = {Private:"#FF8F00",Professional:"#AD1457",Fun:"#BA0F90",Family:"#AF8C00"};
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
  // console.log("table",table_data0)
  // var events =  [{
  //           content: 'AllDay',
  //           endDate: new Date(2019, 4, 23, 23, 59),
  //           startDate: new Date(2019, 4, 23, 12, 59),
  //           color: '#AD1457',
  //           category: "Professional",
  //   },
  //   {
  //           content: 'AllDay',
  //           endDate: new Date(2019, 4, 23, 23, 59),
  //           startDate: new Date(2019, 4, 23, 12, 59),
  //           color: '#FF8F00',
  //           category: "Private",
  //   }
  // ];





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

  YUI().use('aui-button', 'aui-scheduler', 'event-custom-base', function (Y) {

    // var eventRecorder = new Y.SchedulerEventRecorder();
    var scheduler;
    var weekView = new Y.SchedulerWeekView();
    var eventRecorder = new Y.SchedulerEventRecorder({
      on: {
        save: function(event) {
          // console.log("currrent save ");
          // this.get('scheduler').addEvents(event.newSchedulerEvent);
          // scheduler.
          // this._defSaveEventFn(event)
          
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

          eventRecorder.set("content",$(".scheduler-event-recorder-content").val())
          eventRecorder.set("category",$(".btn-dropdown").data("category"))
          eventRecorder.set("willingness", willingness)
          eventRecorder.set("description",$(".input-context").val())
          var current_color = category_color[eventRecorder.get("category")];
          if (current_color!=undefined)
            eventRecorder.set("color",current_color)
          data = eventRecorder.getTemplateData();
          var edit_event = {start:data["startDate"],end:data["endDate"],title:data["content"],
          willingness:eventRecorder.get("willingness"),description:eventRecorder.get("description"),category:eventRecorder.get("category")}

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
    var addPlace;
    Y.Do.after(function(e) {
        // add additional elements

        addPlace = Y.one("#mySchedule .popover-content");
        addPlace.appendChild(bar);
        addPlace.appendChild(description);
        addPlace.appendChild(select_bar);
        var current_category = this.get("category")

        // bar
        if(this.get("willingness")!=undefined){
          willingness = this.get("willingness");
          // console.log("current willingness",willingness)
          left = willingness * bar_length;
          $('.progress_btn').css('left', left);
          $('.progress_bar').animate({width:left},bar_length);
          $('.text').html(parseInt((left/bar_length)*100) + '%');

        }
        
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
         // menu for category
         $(".btn-dropdown > i").css('color',category_color[current_category]);
         $(".btn-dropdown > span").text(current_category)
         $(".btn-dropdown").data("category",current_category)
         // set bar
         // console.log("willingness",this.get("willingness"))
         var area = Y.all('.scheduler-event')
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

