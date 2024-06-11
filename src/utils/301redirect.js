import writeMetaTag from './writeMetaTag';
import isPrerender from './isPrerender';
import createQueryString from './createQueryString';

function redirect(router, path, query = {}){
    return new Promise(function(resolve){
        if(redirect.isPrerender()){
            window.prerenderReady = false;

            writeMetaTag('prerender-status-code', '301', 'html');
            writeMetaTag('prerender-header', 'Location: ' + path + createQueryString(query), 'html');
            resolve(false);
            window.prerenderReady = true;
        }

        else {
            // Looks like React tries to encode the already encoded string
            if(query.location) {
                query.location = decodeURIComponent(query.location).replace(/\+/g, ' ');
            }
            router.push({pathname: path, query: query});
            resolve(true);
        }
    });
}

redirect.isPrerender = isPrerender;

export default redirect;
