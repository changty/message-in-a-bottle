(function() {

	Bottled = function(options) {
		var self = this; 
		this.o = options; 
		this.lastPosition = new L.LatLng(60.451667, 22.266944);
		this.user; 

		this.popup = $('<div class="popup hidden"><form class="newMessage"><textarea class="message" placeholder="Bottled message for a friend" rows="10"></textarea><input class="button" type="submit" value="Send"/></form></div>'); 
		$('body').append(this.popup);

		this.initMap();

		$('.newMessage').submit(function(e) {
			e.preventDefault(); 
			console.log("Message: ", $('.message').val(), "lat: ", self.clickedLocation.lat, "lng: ", self.clickedLocation.lng);
		});
	}; 

	Bottled.prototype.initMap = function() {
		var self = this; 

		self.firstLocation = true;
		self.map = new L.map(self.o.map, {
			zoomControl: false,
		}).setView([60.451667, 22.266944], 16); 


		// add OpenStreetMap tile layer
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
		    maxZoom: 19
		}).addTo(self.map);


		self.user = new L.Marker(self.lastPosition).addTo(self.map);

		// Start watching
		self.map.locate({setView: false, maxZoom: 19, watch: true, enableHighAccuracy: true, maximumAge: 15000, timeout: 3000000});


		// other map functions
		self.map.on('locationfound', self.onLocationFound.bind(self));
		self.map.on('locationerror', self.onLocationError.bind(self));
		self.map.on('click', self.onMapClick.bind(self));
		//self.map.on('moveend', self.onMoveEnd.bind(self));

	}	

	Bottled.prototype.onMapClick = function(e) {
		var self = this; 
		console.log("Clicked", e);

		if($('.popup').hasClass('hidden')) {
			$('.popup').reveal('slideInUp');
			self.clickedLocation = e.latlng; 


			// pan the map so that the clicked position is still visible
			var point = self.clickedLocation; 
			point = self.map.latLngToContainerPoint(point); 
			var newPoint = L.point([point.x, point.y + 250]); 
			var newLatLng = self.map.containerPointToLatLng(newPoint); 

			self.map.panTo(newLatLng);

		}
		else {
			$('.popup').hide('fadeOutDown');
		}
	}

	Bottled.prototype.goToMyLocation = function() {
		var self = this; 

		self.map.setView(self.lastPosition, self.map.getZoom());
	}

	Bottled.prototype.onLocationError = function(e) {
		var self = this;
		console.log("we have an error");
		// $('.connection').removeClass('connected');
		// $('.connection').addClass('disconnected');
	}


	Bottled.prototype.onLocationFound = function(e) {
		var self = this;
		console.log("location found"); 
		// $('.connection').addClass('connected');
		// $('.connection').removeClass('disconnected');
		    
	    var radius = e.accuracy / 2;

		var place = [e.latlng.lat, e.latlng.lng];

		self.lastPosition = e.latlng;
		self.user.setLatLng(self.lastPosition);
		self.accuracy = radius;
		self.user.setAccuracy(radius);

		if(self.firstLocation) {
			self.map.setView(e.latlng, self.map.getZoom());
			self.firstLocation = false;
		}
	}

	$.fn.extend({
	    animateCss: function (animationName) {
	        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
	        $(this).addClass('animated ' + animationName).one(animationEnd, function() {
	            $(this).removeClass('animated ' + animationName);
	        });
	    },

	    reveal: function (animationName) {
	    	$(this).removeClass('hidden');
	        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
	        $(this).addClass('animated ' + animationName).one(animationEnd, function() {
	            $(this).removeClass('animated ' + animationName);
	        });
	    },

	    hide: function (animationName) {
	        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
	        $(this).addClass('animated ' + animationName).one(animationEnd, function() {
	            $(this).removeClass('animated ' + animationName);
	            $(this).addClass('hidden');
	        });
	    }
	});


	// place for map
	$('body').append('<div id="bottled"></div>'); 

	var bottled = new Bottled({map: 'bottled'});



})(); 