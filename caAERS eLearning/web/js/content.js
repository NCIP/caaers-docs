/**
 * Lesson details
 */

var caersIntro = {
    icon: "images/icons/intro.png",
	title: "Introduction to caAERS",
	description: "Brief overview of the caAERS application.",
	swfUriLarge: "lessons/intro/intro.swf",
	swfUriSmall: "lessons/intro/intro_640.swf"
};

var roles = [
	{ title: "Adverse Events Coordinator",
		shortTitle: "AE Coordinator",
		description: "Creates and updates information about an adverse event that needs to be reported and submits the report(s) to appropriate parties per the report definition.",
		headshot: "images/headshots/ae_coordinator.png",
		lessons: [
		    jQuery.extend({}, caersIntro),
			{ 
		    	icon: "images/icons/enter.png",
				title: "Enter Adverse Events",
				description: "Enter the details of adverse events and determine reporting requirements.",
				swfUriLarge: "lessons/ae_coordinator/create/create.swf",
				swfUriSmall: "lessons/ae_coordinator/create/create_640.swf"
			},
			{ 
		    	icon: "images/icons/report_24_hour.png",
				title: "24 Hour Report",
				description: "Create and submit a 24 hour expedited adverse event report.",
				swfUriLarge: "lessons/ae_coordinator/report_24_hour/report_24_hour.swf",
				swfUriSmall: "lessons/ae_coordinator/report_24_hour/report_24_hour_640.swf"
			},
			{ 
		    	icon: "images/icons/report_expedited.png",
				title: "Expedited Report",
				description: "Create and submit an expedited adverse event report.",
				swfUriLarge: "lessons/ae_coordinator/report_expedited/report_expedited.swf",
				swfUriSmall: "lessons/ae_coordinator/report_expedited/report_expedited_640.swf"
			},
			{ 
		    	icon: "images/icons/edit.png",
				title: "Edit Report",
				description: "Edit an in-progress report.",
				swfUriLarge: "lessons/ae_coordinator/edit/edit.swf",
				swfUriSmall: "lessons/ae_coordinator/edit/edit_640.swf"
			},
			{ 
		    	icon: "images/icons/amend.png",
				title: "Amend Report",
				description: "Amend an already submitted report."
			},
			{ 
		    	icon: "images/icons/export.png",
				title: "Export Data",
				description: "Export adverse events data for further research."
			}
		]
		
	},
	{ title: "Subject Manager",
		shortTitle: "Subject Manager",
		description: "Adds, edits, and registers new subject within caAERS and to studies.",
		headshot: "images/headshots/subject_manager.png",
		lessons: [
		    jQuery.extend({}, caersIntro),
			{ 
		    	icon: "images/icons/add_subject.png",
				title: "Add Subject",
				description: "Add a new subject to caAERS and register it to a study.",
				swfUriLarge: "lessons/study_manager/add_subject/add_subject.swf",
				swfUriSmall: "lessons/study_manager/add_subject/add_subject_640.swf"
			}
		]
		
	},
	{ title: "Adverse Events Data Coordinator",
		shortTitle: "Data Coordinator",
		description: "Performs read-only adverse event reviews and provides comments through the adverse event workflow.",
		headshot: "images/headshots/data_coordinator.png",
		lessons: [
		    jQuery.extend({}, caersIntro)
		]
		
	},
	{ title: "System Administrator",
		shortTitle: "System Admin",
		description: "Adds and edits users, updates system configuration.",
		headshot: "images/headshots/sys_admin.png",
		lessons: [
		    jQuery.extend({}, caersIntro),
			{ 
		    	icon: "images/icons/add_user.png",
				title: "Add Personnel",
				description: "Add new personnel to caAERS, including people and users.",
				swfUriLarge: "lessons/administrator/add_user/add_user.swf",
				swfUriSmall: "lessons/administrator/add_user/add_user_640.swf"
			},
			{ 
		    	icon: "images/icons/edit_user.png",
				title: "Edit Existing Personnel",
				description: "Edit existing personnel in caAERS, including modifying details and deactivating users.",
				swfUriLarge: "lessons/administrator/edit_user/edit_user.swf",
				swfUriSmall: "lessons/administrator/edit_user/edit_user_640.swf"
			}
		]
		
	}
];