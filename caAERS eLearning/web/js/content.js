/**
 * Lesson details
 */

caersIntro = {
    icon: "images/icons/intro.png",
	title: "Introduction to caAERS",
	description: "Brief overview of the caAERS application.",
	swfUriLarge: "lessons/intro/intro.swf",
	swfUriSmall: "lessons/intro/intro_640.swf",
};

roles = [
	{ title: "Adverse Events Coordinator",
		shortTitle: "AE Coordinator",
		description: "Creates and updates information about an adverse event that needs to be reported and submits the report(s) to appropriate parties per the report definition.",
		headshot: "images/headshots/ae_coordinator.png",
		lessons: [
		    jQuery.extend({}, caersIntro),
			{ 
		    	icon: "images/icons/create.png",
				title: "Enter Adverse Events",
				description: "Enter AE details for an adverse event report.",
				swfUriLarge: "lessons/ae_coordinator/create/create.swf",
				swfUriSmall: "lessons/ae_coordinator/create/create_640.swf",
			},
			{ 
		    	icon: "images/icons/report.png",
				title: "Expidited Report Creation",
				description: "Create and submit an expidited adverse event report.",
				swfUriLarge: "lessons/ae_coordinator/report/report.swf",
				swfUriSmall: "lessons/ae_coordinator/report/report_640.swf",
			},
			{ 
		    	icon: "images/icons/edit.png",
				title: "Report Editing",
				description: "Edit an in-progress report.",
				swfUriLarge: "lessons/ae_coordinator/edit/edit.swf",
				swfUriSmall: "lessons/ae_coordinator/edit/edit_640.swf",
			},
			{ 
		    	icon: "images/icons/amend.png",
				title: "Report Amendment",
				description: "Amend an already submitted report."
			},
		],
		
	},
	{ title: "Adverse Events Data Coordinator",
		shortTitle: "Data Coordinator",
		description: "Performs read-only adverse event reviews and provides comments through the adverse event workflow.",
		headshot: "images/headshots/data_coordinator.png",
		lessons: [
		    jQuery.extend({}, caersIntro),
		],
		
	},
]