#Agency365 Analytics Integration

We fire 3 different events to document.

 - CBRESPA_LOADED
 - CBRESpaUserEvent
 - CBRESpaRouteEvent

These can be listened to using standard browser event listeners.

Demo: 

```
document.addEventListener("CBRESPA_LOADED", function(e) {
    console.log("CBRESPA_LOADED", e.detail);
});

document.addEventListener("CBRESpaUserEvent", function(e) {
    console.log("CBRESpaUserEvent", e.detail);
});

document.addEventListener("CBRESpaRouteEvent", function(e) {
    console.log("CBRESpaRouteEvent", e.detail);
});
```

##Event structure
###CBRESpaUserEvent
When a user interacts with the SPA, an event of the following structure is emitted.

```
{
  "details": {
    "propertyId": "GB-ReapIT-cbrrps-BOW120347",
    "event": "Viewed property details",
    "eventType": "analytics",
    "spaType": "commercial",
    "path": "http://localhost:3000/results",
    "searchType": "isSale",
    "widgetName": "Demo Search widget",
    "placeName": "London, United Kingdom"
  }
}
```

####eventType
This is always ```analytics```
####spaType
Configured by the SPA configuration, one of:

 - commercial
 - residential

####propertyId
The full ID of the property acted on, or currently viewed.

####event
One of the following user actions:

 - Scroll Through carousel
 - listings view switched to map view
 - map view switched to list view
 - map view viewed property summary
 - listings view view next
 - listings view view previous
 - listings view view all
 - details view view next
 - details view previous
 - details back to results
 - Viewed Property Details From Carousel
 - Conducted search bar search
 - Viewed property details
 - New search performed
 - listings view agent phone number
 - listings view launch contact us
 - details view launch contact us
 - abandoned contact us
 - completed contact us
 - failed contact us
 - details launch image lightbox from image
 - details launch image lightbox from floorplan
 - details view EPC
 - details view brochure
 - details view walkthrough
 - details view Property Website

####path
The current URL.

####searchType
Whether the SPA is showing properties that are to sale or rent, one of:

 - isSale
 - isLetting

####widgetName
The name of the instance of the SPA. This can be set in configuration to allow you to identify which instance of the SPA is firing the event. For example: a search box and a carousel might coexist on the same page.

####placeName
The name of the place that the user searched for before coming to this page, or was configured in the application for them.


###CBRESpaRouteEvent
When a user navigates from one page to another on the SPA. Becuase we use the HTML5 History API analytics packages can't always detect these page transitions.

```
{
  "details": {
    "pathname": "/details/GB-ReapIT-cbrrps-BOW120347/soho-square-soho",
    "search": "?view=isSale",
    "hash": "",
    "state": null,
    "action": "PUSH",
    "key": "qmy85w",
    "query": {
      "view": "isSale"
    },
    "$searchBase": {
      "search": "?view=isSale",
      "searchBase": ""
    },
    "spaRoute": "details/GB-ReapIT-cbrrps-BOW120347/soho-square-soho"
  }
}
```

####pathName
The relative domain relative URL to which the user navigated.

####path
The query string to which the user navigated.

####action
The user action which triggered this navigation, one of:

 - PUSH - When the user actively navigates.
 - POP - When the user uses the Back/Forwards buttons in their 
