/* 
* @Author: Eslam El-Meniawy
* @Date: 2015-10-15 13:37:33
* @Last Modified by: eslam
* @Last Modified time: 2015-10-19 12:59:55
*
* Dear maintainer:
* When I wrote this, only God and I understood what I was doing
* Now, God only knows
* So, good luck maintaining the code :D
*/

var id = GetDataValue('id');
var connected;
var page = 0;
var temp = '<a class="tdn" href="details.html?id={{id}}"><div class="tab-book fr category-book"><img src="{{img}}"><h6 class="rtl nom mdl-color-text--black">{{title}}</h6></div></a>';
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	$('.mdl-layout__drawer-button').html('<img class="material-icons" src="img/menu.png">');
	document.addEventListener("backbutton", onBackKeyDown, false);
	checkConnection();
	if (connected == 1) {
		$('#loading').show();
		loadData();
	} else {
		createSnackbar("لا يوجد اتصال بالانترنت", 'إغلاق');
		loadDataOffline();
	}
	$('#show-more').click(function() {
		checkConnection();
		if (connected == 1) {
			$('#loading').show();
			loadData();
		} else {
			createSnackbar("لا يوجد اتصال بالانترنت", 'إغلاق');
		}
	});
}
function onBackKeyDown() {
	if ($('.mdl-layout__drawer').hasClass('is-visible')) {
		$('.mdl-layout__drawer').removeClass('is-visible');
	} else {
		window.location = "index.html";
	}
}
function checkConnection() {
	var networkState = navigator.connection.type;
	if (networkState == Connection.NONE || networkState == Connection.UNKNOWN) {
		connected = 0;
	} else {
		connected = 1;
	}
}
function GetDataValue(VarSearch) {
	var SearchString = window.location.search.substring(1);
	var VariableArray = SearchString.split('&');
	for (var i = 0; i < VariableArray.length; i++) {
		var KeyValuePair = VariableArray[i].split('=');
		if (KeyValuePair[0] == VarSearch) {
			return KeyValuePair[1];
		}
	}
}
function loadData() {
	$.ajax({
		type : 'GET',
		url : 'http://192.168.1.2/books/index.php?option=com_mobile&view=catogery&catid=' + id + '&page=' + page,
		dataType : 'JSON'
	}).done(function(response) {
		if (page == 0) {
			window.localStorage.setItem('savedCategory' + id, JSON.stringify(response));
		}
		fillData(response);
		page ++;
		$('#loading').hide();
	}).fail(function() {
		$('#loading').hide();
		createSnackbar("حدث خطأ اثناء تحميل الكتب", 'إغلاق');
		if (page == 0) {
			loadDataOffline();
		}
	});
}
function loadDataOffline() {
	var data = window.localStorage.getItem('savedCategory' + id);
	if (!(typeof data === 'undefined' || data === null)) {
	    fillData(JSON.parse(data));
	}
}
function fillData(response) {
	for (var i = 0; i < response.length; i++) {
		$('#main-data').append(temp.replace(/{{id}}/g, response[i].id).replace(/{{img}}/g, 'http://192.168.1.2/books/' + response[i].image).replace(/{{title}}/g, response[i].title));
	}
	$('.tab-book').each(function() {
		$(this).width((($(window).width() - 32) / 3) + 'px');
	});
}