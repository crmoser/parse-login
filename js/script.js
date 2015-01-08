Parse.initialize("MhsTx95fClaI5CSB7pPqBoC2BPJvOwyIvRQMTCQS", "yZZMGCjCHlIryXe7cRFqkjrZFOTxf4j587H0gAzw");

window.fbAsyncInit = function() {

	Parse.FacebookUtils.init({
		appId      : '642657672506723',
		status     : true,  
		cookie     : true,  
		xfbml      : true,
		version    : 'v2.2'
	});

  function login() {
    var username = $('#username').val(),
        password = $('#password').val();

    Parse.User.logIn(username, password, {
      success: function(user) {
        updateUser();
      },
      error: function(user, error) {
        alert(error.message);
      }
    });
  }

  function logout() {
    Parse.User.logOut();
    $("#facebook").hide();
    $('#username, #password, #forgot, #mainlogin h1').show();
    $("#userinfo").html('');
    $("#logout").attr('id', 'login').text('Login');
  }

  function updateUser() {
    var user = Parse.User.current();
    if (user) {
      var obj = user.attributes;
      Object.keys(obj).forEach(function (key) {
        $("#userinfo").append('<p>' + key + ' : ' + obj[key] + '</p>').show();
      });
      $("#facebook").show();
      $('#username, #password, #forgot, #mainlogin h1').hide();
      $("#login").attr('id', 'logout').text('Logout');
    }

    // if (Parse.FacebookUtils.isLinked) {
    //     $("#userinfo").html(
    //         '<img src=' + user.attributes.profilepic + '/>' + '<br />' +
    //         'Name: ' + user.attributes.name + '<br />' +
    //         'Username: ' + user.attributes.username + '<br />' +
    //         'Email: ' + user.attributes.email + '<br />' +
    //         'Location: ' + user.attributes.location
    //     );

    //   $("#link").text("Yay, your accounts are linked.");
    //   $("#signout, #userinfo").show();

    // } else if (user) {
    //   $("#logout, #facebook").css('display', 'block');
    //   $('#username, #password, #forgot, #mainlogin h1').hide();

    //   $("#userinfo").html(
    //       'Username: ' + user.attributes.username + '<br />' +
    //       'Email: ' + user.attributes.email + '<br />' 
    //   ).show();

    // } else {
    //   $("#link").text("Connect with Facebook");
    //   $("#signout, #userinfo").hide();
    // }
  }

  function resetPassword(email) {
    Parse.User.requestPasswordReset(email, {
      success: function() {
        alert("Check your email to reset your password.");
        $('#username, #password, #forgot, #mainlogin h1').show();
        $('#resetform').hide(); 
      },
      error: function(error) {
        // Show the error message somewhere
        alert(error.message);
      }
    });
  }

  function linkFB() {
    // Make a new Parse user, 'sign in' with FB, and set their info in the Parse.user object.
   //  var user = new Parse.User();
   //  Parse.FacebookUtils.logIn('email, user_location', {
			// success: function(user) {
   //      updateUser();
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

  function unlinkFB() {
    var user = Parse.User.current();
    Parse.FacebookUtils.unlink(user, {
      success: function(user) {
        alert("The user is no longer associated with their Facebook account.");
        $("#link").text("Link your Facebook account");
        $("#signout").hide();
      }
    });
  }
  
  updateUser();

  //Event Handlers
  $("#link").click(function() {
      linkFB();
  });

  $("#signout").click(function() {
    unlinkFB();
    updateUser();
  });

  $("button").on('click', function (e) {
    if ($(this).attr('id') === 'login') {
      login();
    } else {
      logout();
    }
    e.preventDefault();
  });

  $("#forgot").click(function () {
    $(this).hide();
    $("#username, #password, #forgot").hide();
    $("#resetform").show();
  });

  $("#passwordreset").click(function () {
    var email = $("#resetform input").val();
    resetPassword(email);
  });

};