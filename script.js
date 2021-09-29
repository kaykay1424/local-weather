/*
	Explanation of program:
	
    Once the page loads the user will be asked to allow their location to be accessed. If the
    user allows this, their geographic location will be determined and weather data from that
    location will be gathered by making a get request to NWS api and displayed in the form of the
    current forecast and a 5-day forecast . Depending on the weather condition and the current time
    of their location, a background image will be displayed to describe that weather condition at
    that time of day. The user can change the measurements of degrees, precipitation, and wind from
    metric to imperial and vice versa by clicking the appropriate button. The user can also click on
    the days of the 5-day forecast to see more weather information for that particular day and change
    the measurements as well. If the user does not allow their location to be accessed or if an error
    occurs, they will be prompted to refresh the page to try again.
	
*/	

$(document).ready(function() {
	
	$('.location-access').show(); // ask user to allow their location to be accessed
	
	getPosition();

}); // end of $(document).ready()

	function chooseWeatherBackground(weather, {hours}) {
		
		let weatherConditions = ['Clear', 'Sun', 'Cloud', 'Overcast', 'Smoke', 'Mist', 'Rain', 'Snow', 'Ice'];

		for (var i = 0; i < weatherConditions.length;i++) {
		
			let regex = new RegExp(weatherConditions[i].toLowerCase(), 'i');

            
			if (weather.match(regex) !== null) {

				weather = weatherConditions[i];
				
			}
		
		} // end of for loop

		// add a background image based on weather condition and time of day
		
		switch(weather) {
		
			case 'Clear':
				
				$('body').css({'background-image': 'url("images/clear_night_sky.jpg")'});
				
			break;
			
			case 'Sun':
			
				$('body').css({'background-image': 'url("images/sunny_day.jpg")'});
			
			break;
			
			case 'Cloud':
				
				if (hours > 19 || hours < 7) {
					
					$('body').css({'background-image': 'url("images/cloudy_night_sky.jpg")'});
			
				}
				
				else {
					
					$('body').css({'background-image': 'url("images/cloudy_sky.jpg")'});
				
				}
			
			break;
			
			case 'Overcast':
            case 'Smoke':
				
				if (hours > 19 || hours < 7) {
					
					$('body').css({'background-image': 'url("images/overcast_night_sky.jpg")'});
			
				}
				
				else {
				
					$('body').css({'background-image': 'url("images/overcast_sky.jpg")'});
				}
				
			break;
			
			case 'Mist':
			
			case 'Fog':
				
				if (hours > 19 || hours < 7) {
					
					$('body').css({'background-image': 'url("images/misty_night_sky.jpg")'});
				
				}
				
				else {
					
					$('body').css({'background-image': 'url("images/misty_sky.jpg")'});
				
				}
				
			break;
			
			case'Rain':
			
				if (hours > 19 || hours < 7) {
					
					$('body').css({'background-image': 'url("images/rainy_night.jpg")'});
				
				}
				
				else {
					
					$('body').css({'background-image': 'url("images/rainy_day.jpg")'});
				}
				
			break;
			
			case 'Snow':
				
				if (hours > 19 || hours < 7) {
					
					$('body').css({'background-image': 'url("images/snowy_night.jpg")'});
				} 
				
				else {
					
					$('body').css({'background-image': 'url("images/snowy_day.jpg")'});
				
				}
				
			break;
			
			case 'Thunder':
			
				$('body').css({'background-image': 'url("images/thunder.jpg")'});
			
			break;
			
			case 'Sleet':
			
				if (hours > 19 || hours < 7) {
					
					$('body').css({'background-image': 'url("images/icy_night.jpg")'});
				}
				
				else {
					
					
					$('body').css({'background-image': 'url("images/day_sleet.jpg")'});
				}
			
			break;
			
			case 'Ice':
			
				if (hours > 19 || hours < 7) {
					
					$('body').css({'background-image': 'url("images/icy_night.jpg")'});
				}
				
				else {
					
					$('body').css({'background-image': 'url("images/icy_day.jpg")'});
				}
				
			break;

            default:
                $('body, #current-forecast, #week-forecast-container').addClass('default');
            break;
		
		} // end of switch()
	
	} // end of chooseWeatherBackground(weather)

	function getPosition() {
	
	 	navigator.geolocation.getCurrentPosition(function(position) {
	 	
		$('.loading').show();
		
		$('.location-access').hide();
		
		latitude = position.coords.latitude;
		
		longitude = position.coords.longitude;
		
		getWeatherData(latitude, longitude);
	
		}, 
		
		function (error) { 
		
	  		if (error.code == error.PERMISSION_DENIED) {
				
				$('.location-access, .loading').hide(); 
				
				$('.refresh-page').show();
			}
			
		  else	if (error.code == error.POSITION_UNAVAILABLE || error.code == error. TIMEOUT ) {
				
				$('.error').show();
				
				$('.loading, .location-access').hide();
			}
		
		}); // end of navigator.geolocation.getCurrentPosition(function(position)
		
	} // end of getPosition()

    function convertWindSpeedText(windSpeedText, measurement, convertToMeasurement) {
        
        windSpeedTextArr = windSpeedText.split(' ');
        
        return convertedWindSpeedText = windSpeedTextArr.map((phrase, i) => {

            const nextElemIndex = i;
            
            if (phrase.match(measurement)) {
                /* If phrase contains other characters than just the measurement
                    e.g. ".", "," add the remaining characters to the end of the measurement
                 */
                if (phrase !== measurement) {
                    const restOfPhraseIndex = phrase.search(measurement) + 3,
                        restOfPhrase = phrase.slice(restOfPhraseIndex, phrase.length);

                    return convertToMeasurement + restOfPhrase;
                }
                        
                return convertToMeasurement;
            } 
            else  if (
                /* If phrase is a number that relates to wind speed
                    e.g. 5 to 12, 20 mph 
                */
                (nextElemIndex < windSpeedTextArr.length - 1) &&
                (windSpeedTextArr[nextElemIndex+1].match('to') || windSpeedTextArr[nextElemIndex+1].match(measurement))
                && !isNaN(parseInt(phrase))) {
                    return convertToMeasurement === 'mph' 
                        ? Math.round(parseInt(phrase) * 1.609)
                        : Math.round(parseInt(phrase) / 1.609)
                    ;
                }
                    
            else return phrase;
        }).join(' ');
    }

    $('.convert-temp').click(function() {
        
        $('.temperature').each(function() {
            
            const symbol = $(this).siblings('.temp-symbol'),
                temp = parseInt($(this).text());
            
                let convertedSymbol,
                    convertedTemp;

            // If degrees are in farenheit, convert them to celsius and vice versa
            if (symbol.text().match('F')) {
                
                convertedSymbol = ' °C';

                convertedTemp = (temp - 32) * 5/9;
            } else {
                
                convertedSymbol = ' °F';
                
                convertedTemp = (temp * 9/5) + 32;
            }

            $('.convert-temp').text(symbol.text());

            $(this).text(Math.round(convertedTemp));

            symbol.text(convertedSymbol);
        });
    });

    $('.convert-wind-speed').click(function() {
        
        $('.wind-speed, #current-forecast .weather').each(function(i, element) {
            
            const windSpeedText = $(element).text();
            
            let convertedWindSpeedText,
                measurement;
            
            if (windSpeedText.match('mph')) {
                
                measurement = 'mph';
                
                convertedWindSpeedText = convertWindSpeedText(windSpeedText, 'mph', 'kph');
                
            } else {
                
                measurement = 'kph';
                
                convertedWindSpeedText = convertWindSpeedText(windSpeedText, 'kph', 'mph');
            }
           
            $(element).text(convertedWindSpeedText);
           
            $('.convert-wind-speed').text(measurement);
        });
    });

	async function getWeatherData(latitude, longitude) {

        /* Grid points are necessary to get forecast for NWS (National Weather Service) API
            This endpoint returns the forecast endpoint with the grid points in the properties
        */
        const gridKeys = await $.ajax({
            url: `https://api.weather.gov/points/${latitude},${longitude}/`,
            type: 'get',
            success: function(data) {
                return new Promise((resolve, reject) => {
                    resolve(data);
                });
            },
            error: function() {
                $('.error').show();
				
                $('.loading, .location-access').hide();
            }
        }),
            city = gridKeys.properties.relativeLocation.properties.city,
            state = gridKeys.properties.relativeLocation.properties.state,
            location = {
                city,
                state
            },
            forecastURL = gridKeys.properties.forecast;
        
        // Get forecast data for current day and next 5 days
		$.get(forecastURL, function(data, status) { 

            if (status !== 'success') {
                $('.error').show();
				
                $('.loading, .location-access').hide();

                return;
            }

            /*  Exclude night forecasts from array of forecasts
                except for the first day in the array
            */
            const periods = data.properties.periods.filter((period) => {
                return period.number === 1 || !period.name.match(/(night)/i);
            });

            $('.forecast-day').each(function(i, currentDayForecast) {
                
                const {
                    icon,
                    detailedForecast,
                    shortForecast,
                    startTime,
                    temperature,
                    windDirection,
                    windSpeed
                } = periods[i];

                let startTimeStr = new Date(startTime).toDateString();

                startTimeStr = startTimeStr.slice(0, startTimeStr.length-4);

                let weather;
                
                // If on current forecast
                if (i === 0) {
                    weather = detailedForecast;

                    const currentDate = new Date();
			
                    const hours = currentDate.getHours();

                    const minutes = currentDate.getMinutes();

                    const time = {
                        hours,
                        minutes
                    }

                    chooseWeatherBackground(weather, time);

                    $('#location').html(location.city + ', ' + location.state );

                } else {
                    weather = `<img class="img-circle" src="${icon}" width="30" />`;
                    $(currentDayForecast).find('.wind-speed').html(windSpeed);
                    $(currentDayForecast).find('.wind-direction').html(windDirection + ' wind ');
                    
                }

                $(currentDayForecast).find('.current-day').html(startTimeStr);
                $(currentDayForecast).find('.weather').html(weather);
                $(currentDayForecast).find('.temperature').html(temperature);

            });
			
            $('#current-forecast-container, #week-forecast-container').show();
			
			$('#loading-div').hide(); 
	
		}); // end of $.getJSON()

	} // end of getWeatherData()