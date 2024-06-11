import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import trackingEvent from '../../utils/trackingEvent';
import ShareMenu from '../ShareMenu/ShareMenu';
import Spinner from 'react-spinner';
import ajax from '../../utils/ajax';
import { isIOS } from '../../utils/browser';

const status = {
    ERROR: 'ERROR',
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS'
};

class ShareModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bitlyStatus: status.PENDING,
            url: ''
        };
    }

    componentWillUpdate(nextProps) {
        if (nextProps.open && !this.props.open) {
            this.updateBitlyLink();
        }
    }

    updateBitlyLink = () => {
        const bitlyToken = this.context.stores.ConfigStore.getItem('bitlyToken');
        let longUrl = encodeURIComponent(location.href);
        if(document.querySelector("link[rel='canonical']") && location.href.includes('/details/')) {
            longUrl = encodeURIComponent(document.querySelector("link[rel='canonical']").href); // Use canonical for Bitly for detail pages only
        }
        const api = 'https://api-ssl.bitly.com';
        const path = `/v3/shorten?access_token=${bitlyToken}&longUrl=${longUrl}`;

        ajax.call(api + path, this.handleBitlySuccess, this.handleBitlyFail);
    };

    handleBitlySuccess = ({ data }) => {
        if (data.url) {
            this.setState({
                url: data.url,
                bitlyStatus: status.SUCCESS
            });
        } else {
            this.setState({
                bitlyStatus: status.ERROR
            });
        }
    };

    handleBitlyFail = () => {
        this.setState({
            bitlyStatus: status.ERROR
        });
    };

    copyBitlyLink = (e) => {
        e.preventDefault();
        const {
            stores,
            actions
        } = this.context;
        if (this.bitlyInput) {
            this.bitlyInput.select();
            document.execCommand('copy');
            if (stores.FavouritesStore.isActive()) {
                trackingEvent('copiedShareFavouritesLink', {}, stores, actions);
            }
        }
    };

    render() {
        const { language, stores } = this.context;

        const modalContainer = document.getElementsByClassName('cbre-react-spa-container')[0];
        const socialConfig = stores.ConfigStore.getItem('socialSharing');
        const { useSocialWidgets } = stores.ConfigStore.getItem('features');

        let linkShare = null;

        switch (this.state.bitlyStatus) {
            case status.SUCCESS:
                linkShare = (
                <fieldset className="formGroup">
                        <legend className="formLegend">{language.ShareModalLink}</legend>
                        <div className="formField formField__textInput form-group">
                            <input
                                ref={ref => this.bitlyInput = ref}
                                type="text"
                                className="textInput is_small"
                                value={this.state.url}
                                id="bitlyUrl"
                            />
                        </div>
                        {isIOS ? null : (
                            <div className="formField formField__button form-group">
                                &nbsp;<button
                                    onClick={this.copyBitlyLink}
                                    className="cbre_button cbre_button__primary cbre_button__tiny text-nowrap"
                                >
                                    {language.ShareModalCopy}
                                </button>
                            </div>
                        )}
                    </fieldset>
                );
                break;
            case status.PENDING:
                linkShare = <Spinner />;
                break;
            case status.ERROR:
            default:
                linkShare = null;
        }

        const socialShare = useSocialWidgets ? (
            <div className="modal_section">
                <div className="formLegend">{language.ShareModalSocial}</div>
                <ShareMenu
                    config={socialConfig}
                    showDirectly
                    isEnabled
                />
            </div>
        ) : null;

        return (
            <Modal
                className={this.props.className}
                show={this.props.open}
                onHide={this.props.hide}
                container={modalContainer}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {language.ShareModalTitle}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="form-inline">
                        {linkShare}
                        {socialShare}
                    </form>
                </Modal.Body>
            </Modal>
        );
    }
}



ShareModal.propTypes = {
    closeHandler: PropTypes.func,
    open: PropTypes.bool,
    property: PropTypes.object.isRequired,
    className: PropTypes.string
};

ShareModal.defaultProps = {
    open: false,
    property : {}
};

ShareModal.contextTypes = {
    language: PropTypes.object,
    stores: PropTypes.object,
    actions: PropTypes.object
};

export default ShareModal;