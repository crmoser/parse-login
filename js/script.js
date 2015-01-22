Parse.initialize("MhsTx95fClaI5CSB7pPqBoC2BPJvOwyIvRQMTCQS", "yZZMGCjCHlIryXe7cRFqkjrZFOTxf4j587H0gAzw");

window.fbAsyncInit = function() {

	Parse.FacebookUtils.init({
		appId      : '642657672506723',
		status     : true,  
		cookie     : true,  
		xfbml      : true,
		version    : 'v2.2'
	});

  function passwordsMatch() {
    var password = $("#password").val(),
        confirm = $("#confirm").val();
    if (password != "" && confirm != "" && (password === confirm)) {
      return true;
    } else {
      return false;
    }
  }

  function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  function errorMessaging (emailOk, passwordsDoMatch) {
    if (!emailOk && !passwordsDoMatch) {
      alert('All the fields are wrong');
    } else if (!emailOk) {
      alert('Enter a valid email.');
    } else if (!passwordsDoMatch) {
      alert('Your passwords must match.');
    }
  } 

  function signup(email) {
    var passwordsDoMatch = passwordsMatch(),
        emailOk = validateEmail(email),
        password = $("#password").val();

    if (passwordsDoMatch && emailOk) {

      Parse.Cloud.run('deleteUser', {email : email}, {
        success: function(result) {
          console.log(result);
          // var user = new Parse.User();
          // user.set("username", email);
          // user.set("password", password);
          // user.set("email", email);
           
          // user.signUp(null, {
          //   success: function(user) {
          //     alert("You're signed up!");
          //   },
          //   error: function(user, error) {
          //     // Show the error message somewhere and let the user try again.
          //     alert("Error: " + error.code + " " + error.message);
          //   }
          // });
        },
        error: function(error) {
         console.log(error);
        }
      });

    } else {
      errorMessaging(emailOk, passwordsDoMatch);
    }
  }

  function login() {
    var username = $('#email').val(),
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
    $('#email, #password, #forgot, h1').show();
    $("#userinfo").html('');
    $("#logout").attr('id', 'login').text('Login');
  }

  function updateUser() {
    var user = Parse.User.current();
    if (user) {
      $("#userinfo").html('');
      var obj = user.attributes;
      Object.keys(obj).forEach(function (key) {
        $("#userinfo").append('<p>' + key + ' : ' + obj[key] + '</p>').show();
      });

      $('form, #forgot, h1, h1+p').hide();
      
      if (Parse.FacebookUtils.isLinked(user)) {
        $("#link").attr('id', 'unlink').text('Unlink your Facebook account');
        $("#facebook").prepend ('<img src=' + obj.profilepic + '/>');
      } else {
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
            $('#email, #password, #forgot, #form').show();
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

  $(".submit").on('click', function (e) {
    var id = $(this).attr('id');
    var email = $("#email").val();
    var password = $("#password").val();
    var confirm = $("#confirm").val();

    switch (id) {
      case 'login':
        login();
        break;
      case 'logout':
        logout();
        break;
      case 'signup':
        signup(email);
    }
    e.preventDefault();
  });

  $("#facebook").on('click', function() {
    loginWithFacebook();
  });

  $("#forgot").click(function () {
    $(this).hide();
    $("#email, #password, #forgot, #form").hide();
    $("#resetform").show();
  });

  $("#passwordreset").click(function () {
    var email = $("#resetform input").val();
    resetPassword(email);
  });

  $("#back").click(function () {
    $("#email, #password, #forgot, #form").show();
    $("#resetform").hide();
  });

};