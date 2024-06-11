import { findEventModel } from './event-models/find-event-model';

export const verifyEventModel = (eventType, data) => {

    // first, find the event model definition we will be using
    const model = findEventModel(eventType);
    
    // now that we have the model, use the properties defined on the model to hydrate the model and prepare it to send
    // if we were using typescript, we could use an interface but for now we'll just use an object with properties
    const modelProperties = Object.keys(model); // get the properties from the event model

    const eventData = {};
    // iterate over the model properties and ensure we hydrate our final event object properly
    modelProperties.forEach(property => {
        let foundData = null;
        if(data[property]){
            foundData = data[property] || null;
        }
        eventData[property] = foundData;
    });

    // if there are any properties we expect to pull from the model itself, assign those values here
    eventData['event'] = model['event'];

    return eventData;
};