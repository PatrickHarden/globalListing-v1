import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ContactFormModal from '../../components/ContactForm/ContactFormModal';

class ContactFormWrapper extends Component {
  componentWillReceiveProps(nextProps) {
    const didOpen = nextProps.modal.open && !this.props.modal.open;
    const detailsPage = this.props.modal.route.path.startsWith('details/');

    /*  NOTE: disabling for now to avoid new issues
    const siteTheme = window.cbreSiteTheme;

    // below is a fix for an existing issue, but only applied to r3 for now (scrolling madness when modal is open)
    if(didOpen && siteTheme && siteTheme === 'commercialr3'){
        let bodyWidth = document.body.clientWidth;

        if(document.body.scrollHeight > document.body.clientHeight){
            const fullWindowWidth = window.innerWidth;
            const scrollBarWidth = fullWindowWidth - bodyWidth;
            bodyWidth = fullWindowWidth - scrollBarWidth;
          }
        document.body.style.position = 'fixed';
        document.body.style.width = bodyWidth + 'px';
    }
    */


    if (didOpen && !detailsPage) {
      this.updateSearchContext();
    }
  }

  updateSearchContext() {
    const { pathname, query } = this.context.location;

    this.context.actions.setSearchContext({
      path: pathname,
      query: query
    });
  }

  render() {
    const { stores } = this.context;
    const { modal: { open, property, hide, contact, requestType }, className } = this.props;

    if (!property) {
      return null;
    }

    const recaptchaKey = stores.ConfigStore.getItem('recaptchaKey');
    const apiUrl = stores.ConfigStore.getItem('propertyContactApiUrl');
    const siteId = stores.ConfigStore.getItem('siteId');

    return (
      <ContactFormModal
        property={property}
        contact={contact}
        requestType={requestType}
        showContactDetails={true}
        classNames={className}
        closeHandler={() => {
          /*
          const siteTheme = window.cbreSiteTheme;
          if(siteTheme && siteTheme === 'commercialr3'){
              document.body.style.position = '';
              document.body.style.width = '';
          }
          */

          hide();
        }}
        recaptchaKey={recaptchaKey}
        apiUrl={apiUrl}
        siteId={siteId}
        isShown={open}
        source={this.props.source}
      />
    );
  }
}

ContactFormWrapper.propTypes = {
  modal: PropTypes.object.isRequired,
  className: PropTypes.string
};

ContactFormWrapper.contextTypes = {
  stores: PropTypes.object,
  location: PropTypes.object,
  actions: PropTypes.object,
  spaPath: PropTypes.object
};

export default ContactFormWrapper;
