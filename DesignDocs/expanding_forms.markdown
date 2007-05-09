# Handling autoexpanding forms #

A caAERS design document.

## Problem ##

Many input forms need to support one or more groups of fields which repeat. For a concrete example, take course information in AE report flow's Treatment tab.  A course may consist of several agents, each with its own dose information, etc.  How do we allow the user to enter 0, 1, or several agents?  

## Approaches ##

There are a few possible approaches:

### Server round trips ###

You could present the user with a submit button for the form named "Add agent."  When clicked, it would submit the whole form to the server and re-render it with another set of (blank) fields for the new agent.

Pros: relatively simple to implement.  Form is always rendered by the same code (i.e., in the JSP).

Cons:  slow.  Lots of state (all the form fields) has to be transferred up to the server and back.  Do you validate it each time?  Requires branching or a `MultiActionController` for the server-side code.

### Lots of blank fields ###

You could provide a fixed, large number of blank groups of fields (for many agents) and let the user fill in only as many as they need.  How many?  "More than enough."

Pros: ... it would work.  Form is always rendered by the same code.

Cons: takes up lots of space.  Submitting a bunch of blank fields would require some pre- or post-processing in the controller to exclude the entirely blank from the partially blank.  Someone will eventually need more than "more than enough."  (All of the other criticisms could be addressed -- e.g., you could hide and disable the blank forms until the user requests to use them -- but this last one is more than enough to reject it.)

### Javascript DOM modification ###

You could write some javascript that would add another instance of the field group.  You could do this by hand or by using an existing library (e.g., Scriptaculous' Builder.)

Pros: Quick, since it's all client side. You only submit as many fields as the user enters.

Cons: Form is now rendered in two places -- the original JSP and the javascript implementation.  Any time anything referenced in the form changes, both the JSP and the javascript have to be changed. 

### Ajax HTML partial ###

You could use an asynchronous call to request the HTML for the next field group from the server.

Pros: Form is always rendered by the same code.  No form data is submitted to the server (or acted upon) and the browser doesn't have to re-render the whole page, so it is relatively quick.

Cons: More complex server-side implementation (some additional server-side view code is required).  Some custom javascript is required for the page (though not as much as for the previous option).

## Ajax expanding forms ##

For the AE flow, I opted for the last option -- an asynchronous request from the page for just the pieces of the view that are needed to add another group of fields.  The implementation has 3 parts:

  * Javascript to make the call and then receive the response and add it to the page.  Implemented as a javascript class (`ListEditor`).
  * Server-side interface to receive and respond to the javascript call.  Implemented with new methods in an existing DWR facade.
  * A method for sharing the JSP rendering code between the main page view and the partial view returned by the ajax code.  Implemented with a small change to the AE flow's base controller and some JSP tagfiles.
  
Each section below elaborates on the implementation of one of these points.  As an example, I'll use the treatment tab of the AE flow.

### Client side ###

The javascript for the add operation is encapsulated in a js class called `ListEditor`.  It has one method, `add`, which starts the whole asynchronous process.  It's implemented using a fairly straightforward mix of prototype (for DOM insertions) and scriptaculous (for effects).  It's in `common.js`.

Here's how the editor is created on the treatment tab:

    new ListEditor("courseAgent", createAE, "CourseAgent", {
        addParameters: [aeReportId],
        addFirstAfter: "single-fields",
        addCallback: function(index) {
            registerDoseModHandler(index)
            AE.registerCalendarPopups("courseAgent-" + index)
        }
    })

The first three parameters are, respectively, the css class of the divs that will be added by this editor, the DWR interface bean to invoke, and the basename of the server-side editing functions.  (I'm considering a refactoring which would remove the third one; I'll update this doc if I apply it.)  The fourth parameter is an options hash which customized the editor behavior for this page.  In this case, it indicates that:

  * The DWR functions will be called with a single parameter, `aeReportId` (if you examine treatment.jsp, you'll find that this is the ID for the current report, if any).
  * If there are no course agents in the form, the first one will be added after the element with id `"single-fields"`.
  * After the response is received and it is added to the page, a callback will be called.  In this case, it adds a custom event handler for the "is modified?" checkbox in the new group and ensures that the calendar popups will work.

### Server-side facade ###

The DWR methods which enable this behavior are very simple.  They rely on `WebContext#forwardToString`, a DWR feature that lets you provide a local URL and receive back the view from that URL as a string.  

In this case, due to an adaptation in the AE flow's controller (next section), the URL is the same as the URL the request is coming from, which DWR supplies.  This means the same code can work for both the create and edit flows with no changes.

### Web layer ###

As mentioned in the last section, the partial form is rendered using the state set up by the same controller as the entire view.  Since the same command object (loaded from the session) is available, the spring form taglib will still work.  This is important for view code reuse -- though the fields the ajax call are returning are blank, you need to use the form:form tags to get spring's binding and validation support in the main view.

The AE flow controller decides which view to use based on a parameter ("subview") which is passed in only when it is invoked from the DWR facade.  This is potentially a security hole (the value of the parameter is used as the basename for the view -- i.e., it's taking outside input and interpreting it as part of the name of a file), so I'm considering alternate implementations.

The view for the field group itself is in a tagfile containing a single `chrome:division`.  This tag is used in the main view to render any groups that exist at the time the page is loaded:

    <c:forEach items="${command.aeReport.treatmentInformation.courseAgents}" varStatus="status">
        <ae:oneCourseAgent index="${status.index}"/>
    </c:forEach>

The partial view is a very thin wrapper around the tag file (this is an example of an entire partial's JSP):

    <%@taglib prefix="tags" tagdir="/WEB-INF/tags"%>
    <%@taglib prefix="ae" tagdir="/WEB-INF/tags/ae"%>
    <tags:noform>
        <ae:oneCourseAgent index="${param.index}" style="display: none"/>
    </tags:noform>

(`tags:noform` is a tagfile which simulates the side effects of a spring `form:form` tag, but without actually wrapping its contents in an HTML `<form>`.)

## Summary ##

It takes a little bit of initial setup, but the ajax solution for expanding forms works pretty well.  It's a recurring requirement all over the application and this solution will cut down on duplicated code, both on the framework side and each time it is used.