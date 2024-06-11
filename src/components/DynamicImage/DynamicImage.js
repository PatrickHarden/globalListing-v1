import React from 'react';

const DynamicImage = (props) => {

    const { featureFlag, sizeKey, testId, fitHeight, fitImage } = props;
    let { src } = props;

    if (featureFlag && !fitImage) {
        src = `${src}?key=${sizeKey}&viewPortWidth=${Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)}`;
    }

    if (fitHeight) {
        return (
            <img src={src} style={{ minWidth: 'auto' }} alt={props.alt} onError={props.onError} onClick={props.onClick} data-testid={testId} />
        )
    } else if (fitImage) {
        return (
            <div role="img" aria-label={props.alt} style={{ backgroundImage: `url(${src})`, top: '0', bottom: '0', left: '0', right: '0', position: 'absolute', transition: '.5s ease all', height: '100%', width: '100%', backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}} />
        )
    } else {
        return (
            <img src={src} alt={props.alt} onError={props.onError} onClick={props.onClick} data-testid={testId} />
        );
    }
};


export function DynamicImageContactAvatar(props) {
    if (!props) return props;
    if (!props.src) return props;
    if (!props.sizeKey) return props;
    if (!props.featureFlag) return props.src;

    const newSrc = props.src.split('?')[0]; // chop off any url params
    const urlParams = new URLSearchParams(props.src);
    const isAbsoluteUrl = newSrc.includes("http") || urlParams.get('absUrl') ? true : false;
    const absUrl = urlParams.get('absUrl') ? urlParams.get('absUrl') : newSrc;

    return isAbsoluteUrl
        ? `/resources/avatars/image.jpg?key=${props.sizeKey}&viewPortWidth=${Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)}&absUrl=${absUrl}`
        : `${newSrc}?key=${props.sizeKey}&viewPortWidth=${Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)}`;
}

export default DynamicImage;