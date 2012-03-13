/**
 * Bind handlers
 */
$(document).ready(function() {
	loadStyles();
	enhanceContent();
	buildTreeNavigation();
	buildRoles();
	bindConfiguredUrls();
	loadAnchor();
});

function loadStyles() {
	var size = $.getUrlVar('size');
	if (size == undefined || size == null || size == "") {
		size = $.cookie('size');
	}
	if (size == undefined || size == null || size == "") {
		size = "small";
	}
	$.cookie('size', size);
	
	$('#size').data('size', size);
	
	if (size == 'small') {
		$('#size').text('Make site larger');
	} else {
		$('#size').text('Make site smaller');
	}

	$('#size').bind('click', function(event) {
		event.preventDefault();

		var url = '' + window.location;
		var index = url.indexOf('?');
		if (index != -1) { url = url.substring(0, index); }
		if (size == 'large') { url += '?size=' + 'small'; }
		else { url += '?size=' + 'large'; }

		window.location.href = url;
		window.location.reload(true);
	});
	
	$('head').append('<link rel="stylesheet" href="css/' + size + '.css" type="text/css" />');
}

/**
 * Adds points within role and lesson objects to next, parent, prev, index, etc.
 *  
 * @return undefined
 */
function enhanceContent() {
	for (var i = 0; i < roles.length; i++) {
		var role = roles[i];
		
		role["next"] = null;
		role["prev"] = null;
		role["parent"] = null;
		role["index"] = i;
		role["type"] = "role";
		if (i < roles.length-1) { role.next = roles[i+1]; }
		if (i > 0) { role.prev = roles[i-1]; }
		
		for (var j = 0; j < role.lessons.length; j++) {
			var lesson = role.lessons[j];
			
			lesson["next"] = null;
			lesson["prev"] = null;
			lesson["parent"] = role;
			lesson["index"] = j;
			lesson["type"] = "lesson";
			if (j < role.lessons.length-1) { lesson.next = role.lessons[j+1]; }
			if (j > 0) { lesson.prev = role.lessons[j-1]; }
		}
	}
}

/**
 * If an anchor exists in the URL, it attempts to load the anchor by searching the role and lesson titles
 * 
 * @return Boolean: whether content was loaded
 */
function loadAnchor() {
	var anchor = "" + window.location;
	
	var index = anchor.indexOf('?');
	if (index != -1) { anchor = anchor.substring(0,index); }
	
	index = anchor.indexOf('#');
	if (index == -1 || index == anchor.length-1) {
		return false;
	}
	
	anchor = decodeURIComponent(anchor.substring(index+1));
	for (var roleIndex = 0; roleIndex < roles.length; roleIndex++) {
		var role = roles[roleIndex];
		if (role.title == anchor) {
			showLessons(getRole(roleIndex));
			return true;
		}
		for (var lessonIndex = 0; lessonIndex < role.lessons.length; lessonIndex++) {
			var lesson = role.lessons[lessonIndex];
			if (lesson.title == anchor) {
				showLesson(getLesson(roleIndex, lessonIndex));
				return true;
			}
		}
	}
	return false;
}

/**
 * Get the role from the roles array, parsing roleIndex into an int if it is a string
 * 
 * @param roleIndex The index - can be a string or int
 * @return The role object
 */
function getRole(roleIndex) {
	if (jQuery.type(roleIndex) == 'string') {
		roleIndex = parseInt(roleIndex);
	}
	return roles[roleIndex];
}

/**
 * Get the lesson from the appropriate role, parsing indices into an int if they are strings
 * 
 * @param roleIndex The role index - can be a string or int
 * @param lessonIndex The lesson index
 * @return The lesson object
 */
function getLesson(roleIndex, lessonIndex) {
	var role = getRole(roleIndex);
	if (jQuery.type(lessonIndex) == 'string') {
		lessonIndex = parseInt(lessonIndex);
	}
	return role.lessons[lessonIndex];
}

/**
 * Populate content_roles with content
 * 
 * @return undefined
 */
function buildRoles() {
	var html = '<table><tbody>';
	for (var i = 0; i < roles.length; i++) {
		var role = roles[i];
		
		html += '<tr>';
		
		html += '<td valign="top"><a href="' + i + '" class="role_link"><img class="headshot" src="' + role.headshot + '"/></a></td>';
		html += '<td valign="top"><div><a href="' + i + '" class="role_link">' + role.title + '</a></div><div>' + role.description + '</div></td>';
		
		html += '</tr>';
	}
	html += '</tbody></table>';
	
	$('#content_roles').html(html);
	
	$('#content_roles .role_link').bind('click', function(event) {
		event.preventDefault();
		showLessons(getRole($(this).attr('href')));
	});
}

/**
 * Builds the tree navigation content
 * 
 * @return undefined
 */
function buildTreeNavigation() {
	var html = '';
	
	html += '<div class="tree_roles">';
	for (var i = 0; i < roles.length; i++) {
		var role = roles[i];
		
		html += '<div class="tree_role">';
		html += '<a href="' + i + '" class="tree_role_link"><img src="' + role.headshot + '" class="tree_role_img"/></a>';
		html += ' <a href="' + i + '" class="tree_role_link tree_link_text">' + role.shortTitle + '</a>';
		html += '</div>';
		
		html += '<div class="tree_lessons">';
		for (var j = 0; j < role.lessons.length; j++) {
			var lesson = role.lessons[j];
			
			html += '<div class="tree_lesson">';
			html += '<a href="' + j + '" class="tree_lesson_link"><img src="' + lesson.icon + '" class="tree_lesson_img"/></a>';
			html += ' <a href="' + j + '" class="tree_lesson_link tree_link_text">' + lesson.title + '</a>';
			html += '</div>';
		}
		html += '</div>';
	}
	html += '</div>';
	
	$('#tree').html(html);

	$('#tree a.tree_role_link').bind('click', function(event) {
		event.preventDefault();
		showLessons(getRole($(this).attr('href')));
	});
	
	$('#tree a.tree_lesson_link').bind('click', function(event) {
		event.preventDefault();
		showLesson(getLesson(
			$(this).parent().parent().prevAll('.tree_role:first').children('a.tree_role_link').attr('href'), 
			$(this).attr('href')
		));
	});
}


/**
 * Binds the URLs in config.js to the appropriate links.
 * 
 * @return undefined
 */
function bindConfiguredUrls() {
	$('.elearning_link').bind('click', function(event) {
		event.preventDefault();
		switchContent($(this).attr('href'));
		updateURL();
	});

	if (caaersUrl != '') {
		$('.caaers_link').attr('href', caaersUrl);
	} else {
		$('.caaers_link').bind('click', function(event) {
			event.preventDefault();
			alert('No URL configured for caAERS.  Please contact your administrator or manually edit js/config.js.');
		});
	}
}

/**
 * Switch the visible content to the newly clicked content - updates the tree, footer, and URL as well
 * 
 * @param id The active role or lesson - optional
 * @return undefined
 */
function switchContent(obj) {
	var id = 'content_main';
	if (obj != undefined && obj.type == 'role') {
		id = 'content_lessons';
	} else if (obj != undefined && obj.type == 'lesson') {
		id = 'content_lesson';
	}
	if ($('#' + id + ':hidden').length > 0) {
		$('.content:visible').slideUp(function() {
			$('#' + id).slideDown();
		});	
	}
	
	updateTree(obj);
	updateFooter(obj);
	updateURL(obj);
}

/**
 * Populate footer with links to the main menu or lessons
 * 
 * @param obj The active role or lesson - optional
 * @return undefined
 */
function updateFooter(obj) {
	var html = '';

	if (obj != undefined) {
		html += '<a href="content_main" class="main_link">Main Menu</a>';
	}
	
	if (obj != undefined && obj.type == 'lesson') {
		html += ' - <a href="' + obj.parent.index + '" class="role_link">Lessons</a>';
		if (obj.prev != null) {
			html += ' - <a href="' + obj.prev.index + '" class="lesson_link">Previous Lesson</a>';			
		}
		if (obj.next != null) {
			html += ' - <a href="' + obj.next.index + '" class="lesson_link">Next Lesson</a>';			
		}
	}
	
	$('#footer').html(html);
	
	$('#footer .main_link').bind('click', function(event) {
		event.preventDefault();
		switchContent();
	});

	$('#footer .role_link').bind('click', function(event) {
		event.preventDefault();
		showLessons(getRole($(this).attr('href')));
	});

	$('#footer .lesson_link').bind('click', function(event) {
		event.preventDefault();
		showLesson(getLesson($(this).siblings('.role_link').attr('href'), $(this).attr('href')));
	});
}

/**
 * Append the role title or lesson title to the anchor of the page so that it can be copy/pasted later.
 * 
 * @param roleIndex The index in the roles array - required
 * @param lessonIndex The index in the lessons array of the role identified by roleIndex - optional
 * @return undefined
 */
function updateURL(obj) {
	var anchor = "";
	var role = null;
	if (obj != undefined) {
		anchor = obj.title;
	}
	var location = "" + window.location;
	var index = location.indexOf('#');
	if (index != -1) {
		location = location.substring(0, index);
	}
	window.location = location + "#" + encodeURIComponent(anchor);
}

/**
 * Update the tree to show the newly clicked content
 * 
 * @param obj Role or lessson - can be undefined
 * @return undefined
 */
function updateTree(obj) {
	var role = obj;
	var lesson = undefined;			
	if (obj != undefined && obj.type == 'lesson') {
		lesson = obj;
		role = lesson.parent;
	}
	
	var differentRole = false;
	if (role == undefined || $('.tree_lessons:visible').prev().find('.tree_role_link').attr('href') != ''+role.index) {
		$('.tree_lessons:visible').slideUp();
		differentRole = true;
	}
	if (lesson == undefined || differentRole || $('.tree_lesson_selected').find('.tree_lesson_link').attr('href') != ''+lesson.index) {
		$('.tree_lesson_selected').removeClass('tree_lesson_selected');
	}
	
	
	if (role != undefined && $('a.tree_role_link[href="' + role.index + '"]').parent().next(':hidden')) {
		$('a.tree_role_link[href="' + role.index + '"]').parent().next().slideDown();
	}
	if (lesson != undefined) {
		$('a.tree_role_link[href="' + role.index + '"]').parent().next().find('a.tree_lesson_link[href="' + lesson.index + '"]').parent().addClass('tree_lesson_selected');
	}
}


/**
 * Populate content_lessons with the role
 * 
 * @param roleIndex The index of the role to populate
 * @return undefined
 */
function showLessons(role) {	
	var html = '<p><a href="' + role.index + '" class="role_link">' + role.title + '</a>: ' + role.description + '</p>';
	
	html += '<p>The following are the lessons for a(n) <a href="' + role.index + '" class="role_link">' + role.title + '</a>:</p>';
	
	html += '<table class="lesson_table"><tbody>';
	for (var i = 0; i < role.lessons.length; i++) {
		var lesson = role.lessons[i];
		html += '<tr>';
		html += '<td valign="top"><a href="' + i + '" class="lesson_link"><img class="icon" src="' + lesson.icon + '"/></a></td>';
		html += '<td valign="top"><div><a href="' + i + '" class="lesson_link">' + lesson.title + '</a></div>' + lesson.description + '</td>';
		html += '</tr>';
	}
	html += '</tbody></table>';
	
	$('#content_lessons').html(html);

	$('#content_lesson .role_link').bind('click', function(event) {
		event.preventDefault();
		showLessons(getRole($(this).attr('href')));
	});	
	
	$('#content_lessons .lesson_link').each(function(lessonIndex) {
		$(this).bind('click', { role: role }, function(event) {
			event.preventDefault();
			showLesson(getLesson(event.data.role.index, $(this).attr('href')));
		});
	});
	
	switchContent(role);
}

/**
 * Populate content_lesson with the lesson
 * 
 * @param lesson The lesson to populate
 * @return undefined
 */
function showLesson(lesson) {
	var role = lesson.parent;

	/* content */
	var html = '<p><a href="' + role.index + '" class="role_link">' + role.title + '</a>: ' + role.description + '</p>';

	html += '<p>The following is the lesson for the <a href="' + role.index + '" class="role_link">' + role.title + '</a>';
	html += ' on <a href="' + lesson.index + '" class="lesson_link">' + lesson.title + '</a>:</p>'; 
	html += '<div id="CaptivateContent">&nbsp;\n</div>';

	$('#content_lesson').empty().html(html);

	$('#content_lesson .role_link').bind('click', function(event) {
		event.preventDefault();
		showLessons(getRole($(this).attr('href')));
	});

	$('#content_lesson .lesson_link').each(function(lessonIndex) {
		$(this).bind('click', { role: role }, function(event) {
			event.preventDefault();
			showLesson(getLesson(event.data.role.index, $(this).attr('href')));
		});
	});
		

	switchContent(lesson);
	
	var url = undefined;
	var size = $('#size').data('size', size);
	var width = "641"; var height = "512";
	if (size == "small") {
		url = lesson['swfUriSmall'];
	} else {
		width = "1025"; var height = "800";
		url = lesson['swfUriLarge'];
	}
	
	if (url) {
		loadCaptivateContent(url, width, height);
	} else {
		$('#CaptivateContent').html('<p align="center">No tutorial available yet for this lesson</p>');
	}
}

/**
 * Load the Captivate flash file into element with id Captivate
 * 
 * @param swfUri The relative or absolute path to the SWF file to load
 * @return undefined
 */
function loadCaptivateContent(swfUri, width, height) {
	var so = new SWFObject(swfUri, "Captivate", width, height, "10", "#CCCCCC");
	so.addParam("quality", "high");
	so.addParam("name", "Captivate");
	so.addParam("id", "Captivate");
	so.addParam("wmode", "window");
	so.addParam("bgcolor","#f5f4f1");
	so.addParam("menu", "false");
	so.addVariable("variable1", "value1");
	so.setAttribute("redirectUrl", "http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash");
	so.write("CaptivateContent");

	document.getElementById('Captivate').focus();
	document.Captivate.focus();
}