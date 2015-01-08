Parse.initialize("MhsTx95fClaI5CSB7pPqBoC2BPJvOwyIvRQMTCQS", "yZZMGCjCHlIryXe7cRFqkjrZFOTxf4j587H0gAzw");

window.fbAsyncInit = function() {
  
	Parse.FacebookUtils.init({
		appId      : '642657672506723',
		status     : true,  
		cookie     : true,  
		xfbml      : true,
		version    : 'v2.2'
	});

  function userInfo() {
    var user = Parse.User.current();

    if (Parse.FacebookUtils.isLinked) {
        $("#userinfo").html(
            '<img src=' + user.attributes.profilepic + '/>' + '<br />' +
            'Name: ' + user.attributes.name + '<br />' +
            'Username: ' + user.attributes.username + '<br />' +
            'Email: ' + user.attributes.email + '<br />' +
            'Location: ' + user.attributes.location
        );

      $("#connect").text("Yay, your accounts are linked.");
      $("#signout, #userinfo").show();

    } else if (user) {
      $("#logout, #facebook").css('display', 'block');
      $('#username, #password, #note, #mainlogin h1').hide();

      $("#userinfo").html(
          'Username: ' + user.attributes.username + '<br />' +
          'Email: ' + user.attributes.email + '<br />' 
      ).show();

    } else {
      $("#connect").text("Connect with Facebook");
      $("#signout, #userinfo").hide();
    }
  }

  function fbLink() {
    // Make a new Parse user, 'sign in' with FB, and set their info in the Parse.user object.
   //  var user = new Parse.User();
   //  Parse.FacebookUtils.logIn('email, user_location', {
			// success: function(user) {
   //      userInfo();
   //    },
   //    error: function(user, error) {
   //      alert(error.message);
			// }
    // });
    
    var user = Parse.User.current();

    if (!Parse.FacebookUtils.isLinked(user)) {
      Parse.FacebookUtils.link(user, null, {
        success: function(user) {            
          var fbID = "/" + user.attributes.authData.facebook.id;

          FB.api(fbID, function(response) {
              user.set("name", response.name);
              user.set("location", response.location.name); 
              user.set("profilepic", "http://graph.facebook.com/" + response.id + "/picture");
              user.save(null, {
                success: function(user) {
                  console.log("User Saved!");
                  
                  $("#userinfo").html(
                      '<img src=' + user.attributes.profilepic + '/>' + '<br />' +
                      'Name: ' + user.attributes.name + '<br />' +
                      'Username: ' + user.attributes.username + '<br />' +
                      'Email: ' + user.attributes.email + '<br />' +
                      'Location: ' + user.attributes.location
                  );

                },
                error: function(user, error) {
                  alert(error.message);
                }
              });
          });
        },
          
        error: function(user, error) {
          alert("User cancelled the Facebook login or did not fully authorize.");
        }
      });
    }

  }

  function fbUnlink() {
    var user = Parse.User.current();
    Parse.FacebookUtils.unlink(user, {
      success: function(user) {
        alert("The user is no longer associated with their Facebook account.");
        $("#connect").text("Connect with Facebook");
        $("#signout").hide();
      }
    });
  }

  function parseSignIn() {
    var username = $('#username').val(),
        password = $('#password').val();

    Parse.User.logIn(username, password, {
      success: function(user) {
        $("#logout, #facebook").css('display', 'block');
        $('#username, #password, #note, #mainlogin h1').hide();
        userInfo();
      },
      error: function(user, error) {
        alert(error.message);
      }
    });
  }

  function parseSignOut() {
    Parse.User.logOut();
    $("#logout").hide();
    $('#username, #password, #note, #mainlogin h1').show();
  }

  function resetPassword(email) {
    Parse.User.requestPasswordReset(email, {
      success: function() {
        alert("Check your email to reset your password.");
        $('#username, #password, #note, #mainlogin h1').show();
        $('#resetform').hide(); 
      },
      error: function(error) {
        // Show the error message somewhere
        alert(error.message);
      }
    });
  }
  
  userInfo();

  //Event Handlers
  $("#connect").click(function() {
      fbLink();
  });

  $("#signout").click(function() {
    fbUnlink();
    userInfo();
  });

  $("#mainlogin button").click(function (e) {
    parseSignIn();
    e.preventDefault();
  });

  $("#logout").click(function() {
    parseSignOut();
  });

  $("#note").click(function () {
    $(this).hide();
    $("#username, #password, #note").hide();
    $("#resetform").show();
  });

  $("#passwordreset").click(function () {
    var email = $("#resetform input").val();
    resetPassword(email);
  });

};