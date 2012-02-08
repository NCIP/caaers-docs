/**
 * Bind handlers
 */
$(document).ready(function() {
	populateRoles();
	loadAnchor();
	bindConfiguredUrls();
});

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
 * Switch the visible content to the newly clicked content
 * @param id One or content_main, content_lessons, or content_lesson
 * @return undefined
 */
function switchContent(id) {
	if ($('#' + id).css('display') != 'none') {
		return;
	}
	
	/* content */
	
	$('.content:visible').slideUp(function() {
		$('#' + id).slideDown();
	});	
	
	/* breadcrumbs */
	
	var show = [];
	var hide = [];
	
	if (id == 'content_main') {
		hide = ['role_breadcrumb', 'lesson_breadcrumb'];
	} else if (id == 'content_lessons') {
		hide = ['lesson_breadcrumb'];
		show = ['role_breadcrumb'];
	} else if (id == 'content_lesson') {
		show = ['role_breadcrumb', 'lesson_breadcrumb'];
	}
	for (var i = 0; i < show.length; i++) {
		if ($('#' + show[i]).css('display') == 'none') {
			$('#' + show[i]).slideDown();
		}
	}
	for (var i = 0; i < hide.length; i++) {
		if ($('#' + hide[i]).css('display') != 'none') {
			$('#' + hide[i]).slideUp();
		}
	}
	
	if (id == 'content_main') {
		populateFooter();
	}
}

/**
 * Populate footer with links to the main menu or lessons
 * 
 * @param roleIndex The index in the roles array - optional
 * @return undefined
 */
function populateFooter(roleIndex, lessonIndex) {
	var html = '';

	if (roleIndex != undefined) {
		html += '<a href="content_main" class="main_link">Main Menu</a>';
	}
	
	if (lessonIndex != undefined) {
		html += ' - <a href="' + roleIndex + '" class="role_link">Lessons</a>';
	}
	
	$('#footer').empty().html(html);
	
	$('.main_link').bind('click', function(event) {
		event.preventDefault();
		switchContent($(this).attr('href'));
	});

	$('#footer').find('.role_link').bind('click', function(event) {
		event.preventDefault();
		showLessons(parseInt($(this).attr('href')));
	});
}

/**
 * Append the role title or lesson title to the anchor of the page so that it can be copy/pasted later.
 * 
 * @param roleIndex The index in the roles array - required
 * @param lessonIndex The index in the lessons array of the role identified by roleIndex - optional
 * @return undefined
 */
function updateURL(roleIndex, lessonIndex) {
	var anchor = "";
	var role = null;
	if (roleIndex != undefined) {
		role = roles[roleIndex];
		anchor = role.title;
	}
	if (lessonIndex != undefined) {
		anchor = role.lessons[lessonIndex].title;
	}
	var location = "" + window.location;
	var index = location.indexOf('#');
	if (index != -1) {
		location = location.substring(0, index);
	}
	window.location = location + "#" + encodeURIComponent(anchor);
}

/**
 * If an anchor exists in the URL, it attempts to load the anchor by searching the role and lesson titles
 * 
 * @return Boolean: whether content was loaded
 */
function loadAnchor() {
	var anchor = "" + window.location;
	var index = anchor.indexOf('#');
	if (index == -1 || index == anchor.length-1) {
		return false;
	}
	anchor = decodeURIComponent(anchor.substring(index+1));
	for (var roleIndex = 0; roleIndex < roles.length; roleIndex++) {
		var role = roles[roleIndex];
		if (role.title == anchor) {
			showLessons(roleIndex);
			return true;
		}
		for (var lessonIndex = 0; lessonIndex < role.lessons.length; lessonIndex++) {
			var lesson = role.lessons[lessonIndex];
			if (lesson.title == anchor) {
				showLesson(roleIndex, lessonIndex);
				showRoleBreadcrumb(roleIndex);
				return true;
			}
		}
	}
	return false;
}

/**
 * Populate content_roles with content
 * 
 * @return undefined
 */
function populateRoles() {
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
	
	$('#content_roles').find('.role_link').bind('click', function(event) {
		event.preventDefault();
		showLessons(parseInt($(this).attr('href')));
	});
}

/**
 * Populate content_lessons with the role
 * 
 * @param roleIndex The index of the role to populate
 * @return undefined
 */
function showLessons(roleIndex) {
	var role = roles[roleIndex];
	
	/* content */
	
	var html = '<p><a href="' + roleIndex + '" class="role_link">' + role.title + '</a>: ' + role.description + '</p>';
	
	html += '<p>The following are the lessons for a(n) <a href="' + roleIndex + '" class="role_link">' + role.title + '</a>:</p>';
	
	html += '<table class="lesson_table"><tbody>';
	for (var i = 0; i < role.lessons.length; i++) {
		var lesson = roles[roleIndex].lessons[i];
		html += '<tr>';
		html += '<td valign="top"><a href="' + i + '" class="lesson_link"><img class="icon" src="' + lesson.icon + '"/></a></td>';
		html += '<td valign="top"><div><a href="' + i + '" class="lesson_link">' + lesson.title + '</a></div>' + lesson.description + '</td>';
		html += '</tr>';
	}
	html += '</tbody></table>';
	
	$('#content_lessons').empty().html(html);

	$('#content_lesson').find('.role_link').bind('click', function(event) {
		event.preventDefault();
		showLessons(parseInt($(this).attr('href')));
	});	
	
	$('#content_lessons').find('.lesson_link').each(function(lessonIndex) {
		$(this).bind('click', { roleIndex: roleIndex }, function(event) {
			event.preventDefault();
			showLesson(event.data.roleIndex, parseInt($(this).attr('href')));
		});
	});
	
	/* breadcrumb */
	
	showRoleBreadcrumb(roleIndex);
	populateFooter(roleIndex);

	/* show content */
	
	switchContent('content_lessons');
	updateURL(roleIndex);
}

/**
 * Populate role_breadcrumb with the role
 * 
 * @param roleIndex The index of the role to populate
 * @return undefined
 */
function showRoleBreadcrumb(roleIndex) {
	var role = roles[roleIndex];

	var html = '<a href="' + roleIndex + '" class="role_link"><img class="headshot headshot_breadcrumb" src="' + role.headshot + '"/></a>';
	html += '<a href="' + roleIndex + '" class="role_link">' + role.shortTitle + '</a>'
	
	$('#role_breadcrumb').empty().html(html); 

	$('#role_breadcrumb').find('.role_link').bind('click', function(event) {
		event.preventDefault();
		showLessons(parseInt($(this).attr('href')));
	});
}

/**
 * Populate content_lesson with the lesson
 * 
 * @param roleIndex The index of the role to look for the lesson within
 * @param lessonIndex The index of the lesson to populate
 * @return undefined
 */
function showLesson(roleIndex, lessonIndex) {
	var role = roles[roleIndex];
	var lesson = role.lessons[lessonIndex];

	/* content */
	var html = '<p><a href="' + roleIndex + '" class="role_link">' + role.title + '</a>: ' + role.description + '</p>';

	html += '<p>The following is the lesson for the <a href="' + roleIndex + '" class="role_link">' + role.title + '</a>';
	html += ' on <a href="' + lessonIndex + '" class="lesson_link">' + lesson.title + '</a>:</p>'; 
	html += '<div id="CaptivateContent">&nbsp;\n</div>';

	$('#content_lesson').empty().html(html);

	$('#content_lesson').find('.role_link').bind('click', function(event) {
		event.preventDefault();
		showLessons(parseInt($(this).attr('href')));
	});

	$('#content_lesson').find('.lesson_link').each(function(lessonIndex) {
		$(this).bind('click', { roleIndex: roleIndex }, function(event) {
			event.preventDefault();
			showLesson(event.data.roleIndex, parseInt($(this).attr('href')));
		});
	});
		
	/* breadcrumb */
	
	html = '<a href="' + lessonIndex + '" class="lesson_link"><img class="icon_breadcrumb" src="' + lesson.icon + '"/></a>';
	html += '<a href="' + lessonIndex + '" class="lesson_link">' + lesson.title + '</a>'

	$('#lesson_breadcrumb').empty().html(html); 

	$('#lesson_breadcrumb').find('.lesson_link').bind('click', function(event) {
		event.preventDefault();
		showLesson(roleIndex, parseInt($(this).attr('href')));
	});
	
	populateFooter(roleIndex, lessonIndex);

	/* show content */
	
	switchContent('content_lesson');
	updateURL(roleIndex,lessonIndex);
	
	if (lesson['swfUri']) {
		loadCaptivateContent(lesson.swfUri);
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
function loadCaptivateContent(swfUri) {
	var so = new SWFObject(swfUri, "Captivate", "641", "512", "10", "#CCCCCC");
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