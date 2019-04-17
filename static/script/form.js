function CreateInvitation() {
  //check form...
  $.ajax({
    type: "POST",
    url: "/user/",
    data: $('#createInvForm').serialize(),
    cache: false,
    success: function(msg) {
      alert("Create Invitation Succeed!");
      window.open("/invitation/"+msg);
    }
  });
  return false;
}
