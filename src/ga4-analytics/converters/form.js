import { get } from 'lodash';
import { extractPropertyDetails } from '../utils/extract-common-property-details';


const getAgentOffice = (property, contact) => {
    const agents = get(property, 'Agents');
    let agentOffice = null;
    if(agents && contact && contact.email){
        agents.forEach(agent => {
            if(agent && agent.email && agent.email === contact.email){
                agentOffice = agent.office;
            }
        });
    }
    return agentOffice;
};

const extractCommonFields = (source, contact, property) => {
    return {
        source: source,
        listing_broker_name: get(contact, 'name'),
        listing_agent_office: getAgentOffice(property, contact)
    };
};

export const CreateGLFormStartEvent = (source, contact, property) => {
    return {...extractCommonFields(source, contact, property), ...extractPropertyDetails(property)};
};


export const CreateGLFormLoadEvent = (source, contact, property) => {
    return {...extractCommonFields(source, contact, property), ...extractPropertyDetails(property)};
};

export const CreateGLFormSubmitEvent = (source, contact, property) => {

    const submitDetails = {
        listing_form_submit_user_role: get(contact,'CustomerContact.Role'),
        listing_form_submit_company: get(contact, 'CustomerContact.CompanyName')
    };

    return {...submitDetails, ...extractCommonFields(source, contact, property), ...extractPropertyDetails(property)};
};
