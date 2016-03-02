/*************************************************
 * Copyright (c) 2016 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

export default
	[	'Wait', '$state', '$scope', '$location',
	 'GetBasePath', 'Rest', 'ProcessErrors', 'CheckLicense', 'moment',
	 function( Wait, $state, $scope, $location,
	 	GetBasePath, Rest, ProcessErrors, CheckLicense, moment){
	 	$scope.getKey = function(event){
	 		// Mimic HTML5 spec, show filename
	 		$scope.fileName = event.target.files[0].name;
	 		// Grab the key from the raw license file
	 		var raw = new FileReader();
	 		// readAsFoo runs async
	 		raw.onload = function(){
	 			$scope.newLicense.file = JSON.parse(raw.result);
	 		}
	 		raw.readAsText(event.target.files[0]);
	 	};
	 	// HTML5 spec doesn't provide a way to customize file input css
	 	// So we hide the default input, show our own, and simulate clicks to the hidden input
	 	$scope.fakeClick = function(){
	 		$('#License-file').click();
	 	}
		$scope.newLicense = {};
		$scope.submit = function(event){
			Wait('start');
			CheckLicense.post($scope.newLicense.file, $scope.newLicense.eula)
				.success(function(res){
					reset();
					init();
					$scope.success = true;
			});
		};
	 	var calcDaysRemaining = function(ms){
	 		// calculate the number of days remaining on the license
	 		var duration = moment.duration(ms);
	 		return duration.days()
	 	};

	 	var calcExpiresOn = function(days){
	 		// calculate the expiration date of the license
	 		return moment().add(days, 'days').calendar()
	 	};
	 	var init = function(){
	 		$scope.fileName = "Please choose a file..."
	 		Wait('start');
	 		CheckLicense.get()
	 		.then(function(res){
	 			$scope.license = res.data;
	 			$scope.time = {};
	 			$scope.time.remaining = calcDaysRemaining($scope.license.license_info.time_remaining);
	 			$scope.time.expiresOn = calcExpiresOn($scope.time.remaining);
	 			$scope.valid = CheckLicense.valid($scope.license.license_info);	 			
	 			Wait('stop');
	 		});
	 	};
	 	var reset = function(){
	 		document.getElementById('License-form').reset()
	 	};
	 	init();	
	 }
	];