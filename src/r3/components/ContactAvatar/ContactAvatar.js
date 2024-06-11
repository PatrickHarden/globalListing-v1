import React from 'react';
import styled from 'styled-components';
import {DynamicImageContactAvatar} from '../../../../src/components/DynamicImage/DynamicImage';

export const ContactAvatar = (props) => {
    const { name, avatar } = props;
    const avatarImgExists = ((avatar && avatar != '' && typeof avatar == "string") || (avatar && avatar.props && avatar.props.src && avatar.props.src !== '' && typeof avatar.props.src === 'string' )) ? true : false;

    const avatarProps = {
        src: avatar && avatar.props ? avatar.props.src : avatar,
        featureFlag: props.dynamicImageSizing ? props.dynamicImageSizing : false,
        sizeKey: 'largeAvatar'
    };

    const imageDoesnt404 = (image_url) => {
        var http = new XMLHttpRequest();
    
        http.open('HEAD', image_url, false);
        try {
            http.send();
        } catch (error) {
            console.log(error);
        }
    
        return http.status != 404;
    }

    if (name || avatarImgExists) {
        const split = name.split(' ');
        return (
            <ContactInitials>
                {avatarImgExists && imageDoesnt404(DynamicImageContactAvatar(avatarProps)) ?
                    <img src={DynamicImageContactAvatar(avatarProps)} alt={'Contact avatar ' + name} />
                    :
                    <span>
                        {split && split[0] && split[0].substr(0, 1)}{split[1] && split[1].substr(0, 1)}
                    </span>
                }
            </ContactInitials>
        );
    }else{
        return null;
    }
};

export default ContactAvatar;


const ContactInitials = styled.div`
    font-family: 'Calibre Regular';
    font-style: normal;
    font-weight: 500;
    color: #fff;
    border-radius:50%;
    font-size: 24px;
    background: #778f9c;
    height: 75px;
    width: 75px;
    text-align: center;
    align-items: center;
    display: flex;
    justify-content: center;

    img {
        border-radius: 50%;
    }

    @media (max-width:767px){
        margin:0 auto;
    }
`;