function getInv(){
  // $('#invTbody').append("<tr><td><a href=\"{{url_for('invitation',inv_id='001')}}\"> invitation 002 </a></td><td>voting</td><td>evelyn</td></tr>");
  $.ajax({
    type: "POST",
    url: "/getinv/",
    data: "getinv",
    cache: false,
    success: function(data) {
      alert(data);
    }
  });
  return true;
};
// function getInv(){
//   $.ajax({
//     type: "POST",
//     url: "/getinv/",
//     success: function(data) {
//       var obj = JSON.parse(data);
//       for ( item in obj ){
//         var status="unknown";
//         if(item['istatus']=='v'){
//           status="voting";
//         }
//         else if (item['istatus']=='f'){
//           status="finished";
//         }
//         $(#invTbody).append("<tr><td><a href=\"{{url_for('invitation',inv_id='"+item['iid']+"',host='true')}}\">"+item['ititle']+"</a></td><td>"+status+"</td><td>"+item['icount']+"</td></tr>");
//       }
//     }
//   });
//   return true;
// }
// function getEve(){
//   $.ajax({
//     type: "POST",
//     url: "/getUinv/",
//     success: function(data) {
//       var obj = JSON.parse(data);
//       for ( item in obj ){
//         var status="unknown";
//         if(item['istatus']=='v'){
//           status="voting";
//         }
//         else if (item['istatus']=='f'){
//           status="finished";
//         }
//         $(#invTbody).append("<tr><td><a href=\"{{url_for('invitation',inv_id='"+item['iid']+"')}}\">"+item['ititle']+"</a></td><td>"+status+"</td><td>"+item['icount']+"</td><td>"+item['icreator']+"</td></tr>");
//       }
//     }
//   });
//   return true;
// }
