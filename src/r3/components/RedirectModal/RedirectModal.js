import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal } from 'react-bootstrap';


export const RedirectModal = (props) => {

    const { isShown, closeHandler, config } = props;

    const [show, setShow] = useState(isShown)

    const modalContainer = document.getElementsByClassName('cbre-react-spa-container')[0];

    const hideModal = () => {
        document.body.classList.remove("redirect");
        setShow(!show)
    }

    return (
        <Modal
            show={show}
            onHide={() => hideModal()}
            container={modalContainer}
            className={'redirect-modal-r3'}
            style={{ overflowY: 'scroll' }}
        >
            <ModalContainer>
                <Modal.Header closeButton>
                    {/* <Modal.Title>redirect</Modal.Title> */}
                    {/* <img src="https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/icon-contact-on.png" className="redirect-modal-header-icon" /> */}
                </Modal.Header>
                <Modal.Body>
                    <Body>
                        <img src="https://wwwlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/404.png" />
                        {config.features.propertyUnavailableText ?
                            <Header1>{config.features.propertyUnavailableText}</Header1> :
                            <Header1>The property you're looking for is no longer available</Header1>
                        }
                        {config.features.propertyUnavailableTextExtra ?
                            <Header2>{config.features.propertyUnavailableTextExtra}</Header2> :
                            <Header2>It seems that you're looking for a property that is no longer online</Header2>
                        }
                    </Body>
                </Modal.Body>
            </ModalContainer>
        </Modal>
    );
};

export default RedirectModal;




const ModalContainer = styled.div`
    background:#fff;
    font-family: futura-pt;
    min-width:55vw;

    .modal-header {
        height:50px;
        background:#eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fff;
        flex-direction: row-reverse;
        margin-bottom: -10px;
        h4, .close {
            color: #fff;
        }
        img {
            margin-left: 10px !important;

        }
        .close {
            margin-right: 0 !important;
        }
        .modal-title {
            span {
                font-weight:500;
            }
        }
        button{
            transition:.2s ease all;
            font-size:24px !important;
            margin-top:0 !important;
            color: #0A694E !important;
            > span {
                font-size:60px;
                font-weight:100;

            }
        }
        button:hover {
            opacity:.85 !important;
        }
    }

    .modal-body {
        min-height: 176.88px;
        padding: 8vh 0 !important;
        > div {
            width: 100%;
            img {
                margin: 0 auto;
            }
        }

    }

    .cbre-spa--pre-line {
        d:nth-of-type(1){
            margin-top:20px;
        }
        a:nth-of-type(1){
            margin: 14px 0 10px;
            display:block;
        }
    }

    @media (max-width:767px){
        .modal-title {
            span {
                margin-left:auto !important;
            }
        }
        .contact-form-container {
            margin: 15px 0 60px 0 !important;
        }
        .modal-body {
            display:flex;
            flex-direction:column;
        }
    }
`;

const Header1 = styled.div`
    margin: 0 auto;
    margin-top:15px;
    font-style: normal;
    font-weight: bold;
    font-size: 30px;
    line-height: 38px;
    text-align: center;
    color: #003F2D;
    max-width:439px;
`;

const Header2 = styled.div`
    margin-top:20px;
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 24px;
    color: #435254 !important;
    margin-bottom: 30px;
`

const Body = styled.div`
    text-align:center;
    img {
        max-width: 96.88px;
        min-height:96px;
    }
`;