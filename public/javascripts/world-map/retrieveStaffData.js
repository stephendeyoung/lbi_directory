(function(staffData) {

	var staffMainData = null;

	var popUp = function(data) {
		if (data) {
			staffMainData = data;
		}
		var id = $(this).data('id');
		for(var x = 0, ln = staffMainData.directory.length; x < ln; x += 1) {
			if (data.directory[x]._id === id) {
				whoManages(data.directory[x]);
				return;
			}
		}
		console.log('no match found');
	};

	var whoManages = function(data) {
		var source = $("#popUp").html();
		var template = Handlebars.compile(source);
		var popUpActive = true;
		var removePopUp = function() {
			popUpActive = false;
			$('#olMask').hide();
			$('.popUp').remove();
		};
		$.get('/manager/' + data.givenName + ' ' + data.sn, function(staff) {
			data.managees = staff;
			if (popUpActive) {
				$('.popUp').remove();
			}
			$("#olMask").show();
			$('body').append(template(data));
			$('.findManager').on('click', function() {
				popUp.apply($(this), [staffMainData]);
				return false;
			});
			$('.close').on('click', function() {
				removePopUp();
				return false;
			});
			$(document).keyup(function(e) {
  				if (e.keyCode == 27) { 
  					removePopUp();
  				}   
			});
		});
	};

	var search = function () {
        $.expr[':'].Contains = function(a, i, m) {
            return (a.textContent || a.innerText || '').toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
        };
        var filter = $(this).val();
        var list = $('#list');

        if(filter) {
            var $matches = list.find('a:Contains(' + filter + ')').parent();
            $('li', list).not($matches).hide();
            $matches.show();
        }
        else {
            list.find('li').show();
        }
        return false;
    };
	
	staffData.retrieveData = function(department, office) {
		$.get('/data/' + office + '/' + department, function(data) {
			var source = $("#staff").html();
			var template = Handlebars.compile(source);
			var staffListPos = $('#staffList').offset();
			$('#staffList').empty();
			$('#staffList').append(template(data));
			$('.filterinput').on('keyup', search);
			$('html, body').animate({
				scrollTop: staffListPos.top
			}, 1000);
			$('.card').on('click', function() {
				popUp.apply($(this), [data]);
			});
		});
	};
	
})(window.staffData = window.staffData || {});