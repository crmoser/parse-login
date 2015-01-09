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
        checkNewUser(username);
      },
      error: function(user, error) {
        alert(error.message);
      }
    });
  }

  function checkNewUser(username) {
    var user = Parse.User.current();
    if (user) {
      var isNew = user.attributes.isNew;
      if (isNew) {
        alert("Noob. Make a new password right meow.");
        $("#username, #password, #forgot, #login").hide();
        $("#resetform").show();
        $("#resetform input").val(username);
      } else {
        updateUser();
      }
    }
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
      $("#userinfo").html('');
      var obj = user.attributes;
      Object.keys(obj).forEach(function (key) {
        if (key != "authData") {
          $("#userinfo").append('<p>' + key + ' : ' + obj[key] + '</p>').show();
        }
      });
      $("#facebook").show();
      $('#username, #password, #forgot, #mainlogin h1').hide();
      $("#login").attr('id', 'logout').text('Logout');
      
      if (Parse.FacebookUtils.isLinked(user)) {
        $("#link").attr('id', 'unlink').text('Unlink your Facebook account');
        $(".fa-facebook").hide();
        $("#facebook").prepend ('<img src=' + obj.profilepic + '/>');
      } else {
        $(".fa-facebook").show();
        $("#facebook img").remove();
        $("#unlink").text("Link your Facebook account");
      }
    }
  }

  function resetPassword(email) {
    var user = Parse.User.current();
    Parse.User.requestPasswordReset(email, {
      success: function() {
        user.set("isNew", false);
        user.save(null, {
          success: function(user) {
            alert("Check your email to reset your password.");
            $('#username, #password, #forgot, #login').show();
            $('#resetform').hide();
            logout();
          },
          error: function(user, error) {
            alert(error.message);
            logout();
          }
        });
      },
      error: function(error) {
        alert(error.message);
        logout();
      }
    });
  }

  function linkFB() {
    
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
                  updateUser();
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
        user.unset("name");
        user.unset("location"); 
        user.unset("profilepic");
        user.save(null, {
          success: function(user) {
            updateUser();
          },
          error: function(user, error) {
            console.log(error.message);
          }
        });
      }
    });
  }
  
  updateUser();

  //Event Handlers

  $(".login-button").on('click', function (e) {
    if ($(this).attr('id') === 'login') {
      login();
    } else {
      logout();
    }
    e.preventDefault();
  });

  $(".fb-button").on('click', function() {
    if ($(this).attr('id') === 'link') {
      linkFB();
    } else {
      unlinkFB();
    }
  });

  $("#forgot").click(function () {
    $(this).hide();
    $("#username, #password, #forgot, #login").hide();
    $("#resetform").show();
  });

  $("#passwordreset").click(function () {
    var email = $("#resetform input").val();
    resetPassword(email);
  });

  $("#back").click(function () {
    $("#username, #password, #forgot, #login").show();
    $("#resetform").hide();
  });

};