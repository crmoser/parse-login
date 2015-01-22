
// Use Parse.Cloud.define to define as many cloud functions as you want.

Parse.Cloud.define("deleteUser", function(request,response) { 
	var email = request.params.email;
	var query = new Parse.Query(Parse.User);
	query.equalTo("email", email);

	query.first({
	    success: function(user) {
	        user.destroy({
	        	useMasterKey: true,
	        	success: function () {
	        		response.success(user);
	        	}, 
	        	error: function () {
	        		alert('No account with that email address found.')
	        		response.error(error);
	        	}
	        });
	    },
	    error: function(error) {
	        status.error(error.code + ": " + error.message);
	    },
	});
});


