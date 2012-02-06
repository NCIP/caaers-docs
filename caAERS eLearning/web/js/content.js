/**
 * Lesson details
 */

caersIntro = {
    icon: "images/icons/intro.png",
	title: "Introduction to caAERS",
	description: "Brief overview of the caAERS application.",
	swfUri: "lessons/intro/intro.swf",
};

roles = [
	{ title: "Adverse Events Coordinator",
		shortTitle: "AE Coordinator",
		description: "Creates and updates information about an adverse event that needs to be reported and submits the report(s) to appropriate parties per the report definition.",
		headshot: "images/headshots/ae_coordinator.png",
		lessons: [
		    caersIntro,
			{ 
		    	icon: "images/icons/new.png",
				title: "Report Creation",
				description: "Create and submit an adverse event report.",
			},
			{ 
		    	icon: "images/icons/new_expidited.png",
				title: "Expidited Report Creation",
				description: "Create and submit an expidited adverse event report."
			},
			{ 
		    	icon: "images/icons/edit.png",
				title: "Report Editing",
				description: "Edit an in-progress report."
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
		    caersIntro,
		],
		
	},
]