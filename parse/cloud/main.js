
// Use Parse.Cloud.define to define as many cloud functions as you want.

Parse.Cloud.define("updateUser", function(request,response) { 
	var email = request.params.email,
		password = request.params.password,
		username = request.params.username;
		query = new Parse.Query(Parse.User);
	query.equalTo("email", email);

	query.first().then(
		function (user) {
	    	if (user) {
	    		user.save({
	    			password : password,
	    			username : username
	    		}, {
	    			useMasterKey : true
	    		}).then(
	    			function (user) {
	    				response.success(true);
	    			},
	    			function (error) {
	    				response.error(error);
	    			}
	    		);
	    	} else {
	    		//Gets really confusing. The query succeeds, but the user doesn't exist.
	    		//So this then gets passed to the success method of the Parse.Cloud.Run fn either way.
	    		response.success(false);
	    	}
	    },
	    function (error) {
	        status.error(error.code + ": " + error.message);
	    }
    );
});



