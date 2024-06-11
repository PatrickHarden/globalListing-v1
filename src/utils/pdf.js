const request = (
    url
    , data
    , success = () => {}
    , error = () => {} // eslint-disable-line
    , responseType
    , fileType
    , contentType = 'application/json'
) => {
    const oReq = new XMLHttpRequest();
    oReq.open('POST', url, true);

    oReq.setRequestHeader('Content-Type', contentType);

    if (responseType) {
        oReq.responseType = responseType;
    }

    oReq.onload = () => {
        let response = oReq.response;
        const responseObj = JSON.parse(oReq.response);

        if (responseObj.hasOwnProperty('Message')) {

            error(responseObj);

        } else {

            if (fileType) {
                const blob = new Blob([response], { type: fileType });
                response = URL.createObjectURL(blob);
            }
            success(response);

        }
    };

    oReq.send(JSON.stringify(data));
};

const pdf = {
    getPdf: (url, data, success, error) => {
        request(
            url,
            data,
            success,
            error,
            'application/pdf',
            'arraybuffer'
        );
    }
};

export default pdf;

