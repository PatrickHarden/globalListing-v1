import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal } from 'react-bootstrap';
import { isPrerender } from '../../../utils/browser';

export const Notification = (props) => {

    const { isShown, config } = props;

    const [show, setShow] = useState(isShown);

    const cookie = document.cookie;

    const modalContainer = document.getElementsByClassName('cbre-react-spa-container')[0];

    const hideModal = () => {
        if (cookie.indexOf('popup=true') === -1) {
            document.cookie = " popup=true;";
        }
        setShow(!show);
    }

    if (cookie.indexOf('popup=true') > -1 || isPrerender || typeof window === "undefined" || typeof document === "undefined" || (navigator && navigator.userAgent.indexOf('selenium') > -1)) {
        return (
            <React.Fragment></React.Fragment>
        );
    } else {
        return (
            <Modal
                show={show}
                onHide={() => {
                    hideModal()
                }}
                container={modalContainer}
                className={'notification-modal-r3'}
                style={{ overflowY: 'scroll' }}
            >
                <Container>
                    <ModalContainer>
                        <Modal.Header id="modalHeader">
                            <Modal.Title>
                                <NotificationBanner>
                                    <img src="https://wwwlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/white-notepad-icon.png" alt="notepad icon" />
                                </NotificationBanner>
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <NotificationBody>
                                <h5>{config.header}</h5>
                                <p>{config.body}</p>
                                <ButtonContainer>
                                    <a href={config.link} target="_blank"><button>{config.linkMessage}</button></a>
                                    <button onClick={() => {
                                        hideModal()
                                    }}>{config.closeMessage}</button>
                                </ButtonContainer>
                            </NotificationBody>
                        </Modal.Body>
                    </ModalContainer>
                </Container>
            </Modal>
        );
    }
};

export default Notification;


const Container = styled.div`
background: linear-gradient(
    155.26deg
    ,#69BE28 0.8%,#006A4D 127.42%);
        padding: 6px;
`

const ModalContainer = styled.div`
    background: #fff;
    max-width:650px;

    #modalHeader {
        padding: 0 !important;
    }
`;

const NotificationBanner = styled.div`
    background-image: url('https://wwwlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/notification-banner.png');
    background-size: cover;
    height:100px;
    display: flex;
    align-items: center;
    justify-content: center;
    > img {
        width:100px !important;
        height:100px !important;
        margin-bottom: -16px;
    }
`;

const NotificationBody = styled.div`
    max-width: 400px;
    margin: 0 auto;
    > h5 {
        margin-top: 19px  !important;
        font-style: normal  !important;
        font-weight: bold  !important;
        font-size: 32px  !important;
        line-height: 46px  !important;
        text-align: center  !important;
        text-transform: uppercase  !important;
        color: #333333  !important;
    }

    > p {
        margin-top:10px  !important;
        font-style: normal  !important;
        font-weight: 500  !important;
        font-size: 21px  !important;
        line-height: 36px  !important;
        text-align: center  !important;
        color: #383838  !important;
    }
`;

const ButtonContainer = styled.div`
    display:flex;
    flex-direction: column;
    align-items:center;
    max-width:300px;
    margin:0 auto;
    margin-top: 15px;

    > a > button {
        width: 300px;
        height: 50px;
        background: #006A4D;
        color: #fff !important;
        font-style: normal !important;
        font-weight: bold !important;
        font-size: 16px !important;
        line-height: 16px !important;

        text-align: center;
        letter-spacing: 1px !important;
        text-transform: uppercase !important;
    }
    
    > button {
        margin-top: 10px !important;
        background: #fff;
        color: #006A4D !important;
        cursor: pointer;
        border: 2px solid #00896C;
        box-sizing: border-box;
        height: 50px;
        width:300px;
        margin-bottom:10px !important;

        font-style: normal !important;;
        font-weight: bold !important;;
        font-size: 16px !important;;
        line-height: 16px !important;;

        text-align: center !important;;
        letter-spacing: 0.888889px !important;;
        text-transform: uppercase !important;;
    }
`;