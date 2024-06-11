import { get } from 'lodash';

export const CreateGLSearchEvent = (source, params, userSearchTerm, searchPath, aspectType, selectedSuggestion, searchURL) => {
    return {
        glMarketId: get(params,'Site'),
        search_source: source,
        search_text: userSearchTerm,
        selected_suggestion: get(selectedSuggestion, 'label'),
        place_id: get(params,'placeId'),
        property_type: get(searchPath,'label'),
        listing_type: get(aspectType,'label'),
        search_destination_url: searchURL
    };
};