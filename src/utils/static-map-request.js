const request = (
    url
    , data
    , success = () => { }
    , error = () => { } 
    , contentType = 'application/json'
) => {
    const oReq = new XMLHttpRequest();
    oReq.open('POST', url, true);

    oReq.setRequestHeader('Content-Type', contentType);

    oReq.onload = () => {
        let response = oReq.response;
        const responseObj = JSON.parse(oReq.response);

        if (responseObj.hasOwnProperty('Message')) {
            error(responseObj);
        } else {
            success(response);
        }
    };

    oReq.send(JSON.stringify(data));
};

const staticmaprequest = {
    getMap: (url, data, success, error = () => { }) => {
        request(
            url,
            data,
            success,
            error
        );
    }
};

export default staticmaprequest;
