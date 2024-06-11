/* globals grecaptcha */

/**
 * Copyright (c) Amido Ltd. All rights reserved.
 */
import PropTypes from 'prop-types';
import DefaultValues from '../../constants/DefaultValues';
import React from 'react';
import createReactClass from 'create-react-class';
import ReactDOM from 'react-dom';
import Spinner from 'react-spinner';
import $ from 'jquery';
import Validator from 'validator';
import { Button, FormControl, FormGroup, ControlLabel } from 'react-bootstrap';
var ApplicationActionsMixin = require('../../mixins/ApplicationActionsMixin'),
StoresMixin = require('../../mixins/StoresMixin'),
TrackingEventMixin = require('../../mixins/TrackingEventMixin');

import createQueryString from '../../utils/createQueryString';
import TranslateString from '../../utils/TranslateString';
import Select_R3 from '../../r3/external/agency365-components/Select/Select.r3';
import { debounce } from 'lodash';
import { fireAnalyticsTracking } from '../../ga4-analytics/send-event';
import { eventTypes } from '../../ga4-analytics/event-types';
import { CreateGLFormSubmitEvent, CreateGLFormLoadEvent, CreateGLFormStartEvent } from '../../ga4-analytics/converters/form';
 
 var ContactForm = createReactClass({
     displayName: 'ContactForm',
     mixins: [StoresMixin, ApplicationActionsMixin, TrackingEventMixin],
 
     // Strict format for supplied properties.
     propTypes: {
         labels: PropTypes.shape({
             formTitle: PropTypes.string,
             buttonTxt: PropTypes.string,
             closeLinkTxt: PropTypes.string,
             successMsg: PropTypes.string,
             errorMsg: PropTypes.string
         }),
         recaptchaKey: PropTypes.string,
         PropertyAddress: PropTypes.object,
         PropertyId: PropTypes.string,
         RequestType: PropTypes.string,
         RecipientEmailAddress: PropTypes.string,
         AgentOffice: PropTypes.string,
         ReferrerPageTitle: PropTypes.string,
         SiteID: PropTypes.string,
         ApiUrl: PropTypes.string,
         property: PropTypes.object,
         source: PropTypes.string
     },
 
     getInitialState: function () {
         return {
             postData: {},
             canSubmit: false,
             disableSubmit: false,
             formError: false,
             activeElement: '',
             formStarted: false,
             formData: {
                 name: {
                     value: '',
                     changed: false,
                     error: ''
                 },
                 email: {
                     value: '',
                     changed: false,
                     error: ''
                 },
                 telephone: {
                     value: '',
                     changed: false,
                     error: ''
                 },
                 message: {
                     value: this.getPropertyDetails(),
                     changed: false,
                     error: ''
                 },
                 verification: {
                     value: '',
                     changed: false,
                     error: ''
                 },
                 company: {
                     value: '',
                     changed: false,
                     error: ''
                 },
                 disclaimer: {
                     value: false,
                     changed: false,
                     error: ''
                 }
             },
             renderedCaptcha: false,
             submitted: false,
             submitSuccessful: false,
             submitFailure: false,
             indiaTerms: false,
             indiaComms: false
         };
     },
 
     componentDidMount: function () {
         const features = this.context.stores.ConfigStore.getItem('features');
 
         if (features.recaptchaV3) {
             if (!document.getElementById('recaptchaV3')) {
                 const script = document.createElement("script")
                 script.src = "https://www.google.com/recaptcha/api.js?render=" + features.recaptchaV3;
                 script.id = 'recaptchaV3';
                 document.body.appendChild(script);
 
                 var styles = `
                     .grecaptcha-badge { visibility: hidden !important; }
                 `;
                 var styleSheet = document.createElement("style");
                 styleSheet.type = "text/css";
                 styleSheet.innerText = styles;
                 document.head.appendChild(styleSheet);
             }
         } else {
             grecaptcha.render(ReactDOM.findDOMNode(this.refs.recaptcha), {
                 sitekey: this.props.recaptchaKey,
                 callback: this.verifyCallback,
                 size: 'invisible',
                 badge: 'inline'
             });
 
             grecaptcha.execute();
         }

         // new ga4 form load
        this.context.stores.ConfigStore.getItem('features');
        fireAnalyticsTracking(this.context.stores.ConfigStore.getItem('features'), this.context, eventTypes.FORM_LOADED, CreateGLFormLoadEvent(this.props.source || '', this.props.contact, this.props.property), false);
     },
 
     open: function () {
        this._fireEvent('launchContactUs', {
            propertyId: this.props.PropertyId
        });
     },
 
     close: function () {
         if (!this.state.submitted) {
             if(this.features.ga4 !== true){
                 this._fireEvent('abandonContactUs', {
                     propertyId: this.props.PropertyId
                 });
             }
         }
 
         // Let others know (event buttons) that we closed the modal
         if (this.props.onClose) {
             this.props.onClose();
         }
         this.getActions().closeModal();
         this.replaceState(this.getInitialState());
     },
 
 
     verifyCallback: function (response) {
         this.state.formData.verification.changed = true;
         this.state.formData.verification.value = response;
 
         this.runValidations(this.state);
     },
 
     handleChange: function (name, e) {
         var state = this.state;
         const { target } = e;
 
         state.activeElement = name;
         state.formData[name].value =
             target.type === 'checkbox'
                 ? target.checked
                 : Validator.trim(target.value);
         state.formData[name].changed = true;
         this.runValidations(state);
         this.fireFormStarted();
     },
 
     handleDropdownChange: function (value) {
         const updatedValues = this.state.formData;
         updatedValues.dropDownValue = value.value;
         this.setState({ formData: updatedValues });
         this.runValidations(this.state);
         this.fireFormStarted();
     },

     fireFormStarted : function(){
        if(!this.state.formStarted){
            this.context.stores.ConfigStore.getItem('features');
            fireAnalyticsTracking(this.context.stores.ConfigStore.getItem('features'), this.context, eventTypes.FORM_STARTED, CreateGLFormLoadEvent(this.props.source || '', this.props.contact, this.props.property), false);
            this.setState({ formStarted: true });
        }
     },
 
     runValidations: function (state, submission) {
         const { stores } = this.context;
         const features = stores.ConfigStore.getItem('features');
         if (typeof submission === 'undefined') {
             submission = false;
         }
 
         var elements = state.formData,
             error = false,
             validations = {
                 name: ['required'],
                 email: ['required', 'email'],
                 verification: ['required']
             };
 
         if (features && features.companyNameRequired) { validations.company = ['required'] }
         if (features && features.displaySupplimentaryDisclaimer || features && features.displayIndiaDisclaimer) {
             validations.disclaimer = ['requiredCheckbox'];
         }
 
         if (features && features.displayIndiaDisclaimer) {
             if (this.state.indiaComms && this.state.indiaTerms) {
                 this.state.formData.disclaimer.value = true;
             } else {
                 this.state.formData.disclaimer.value = false;
             }
         }
 
         for (var elementName in elements) {
             var element = elements[elementName];
 
             error = this.validateElement(
                 validations,
                 element,
                 elementName,
                 submission
             )
                 ? error
                 : true;
 
         }
 
         state.formError = error;
         state.canSubmit = !error; // Negate as is opposite.
 
         this.setState({ ...state });
 
     },
 
     validateElement: function (validations, element, elementName, submission) {
         var labels = this.props.labels;
 
         if (!validations.hasOwnProperty(elementName)) {
             return true;
         }
 
         if (element.changed || submission) {
             var elementError = false;
 
             // Check validations
             validations[elementName].forEach(function (validation) {
                 switch (validation) {
                     case 'requiredCheckbox':
                         elementError = !element.value ? true : elementError;
                         break;
                     case 'required':
                         elementError = !element.value.length
                             ? true
                             : elementError;
                         break;
 
                     case 'alpha':
                         elementError = !Validator.isAlpha(element.value)
                             ? true
                             : elementError;
                         break;
 
                     case 'email':
                         elementError = !Validator.isEmail(element.value)
                             ? true
                             : elementError;
                         break;
 
                     case 'numeric':
                         elementError = !Validator.isNumeric(element.value)
                             ? true
                             : elementError;
                         break;
                 }
             });
 
             if (elementError) {
                 element.error = labels[elementName].errorMsg;
             } else {
                 element.error = '';
             }
 
             return !elementError;
         } else {
             return false;
         }
     },
 
     handleClick: function () {
         this.setState({ ...this.state, disableSubmit: true });
         const features = this.context.stores.ConfigStore.getItem('features');
         if (features.recaptchaV3) {
             this.recaptchaChallenge(features.recaptchaV3);
         } else {
             this.runValidations(this.state, true);
             this.formSubmit();
         }
     },
 
     recaptchaChallenge: function (recaptchav3) {
 
         grecaptcha.ready(() => {
             grecaptcha.execute(recaptchav3, { action: 'contactForm' }).then((token) => {
                 this.verifyCallback(token);
                 this.runValidations(this.state, true);
                 this.formSubmit();
             });
         });
     },
 
     buildDetailsPagePath: function (
         basePath,
         propertyId,
         addressSummary,
         stores
     ) {
         const config = stores.ConfigStore.getItem('searchConfig');
         let searchResultsPage = config ? config.searchResultsPage : null;
         let path = '/details/' + propertyId + '/' + addressSummary;
         let useHardLink = true;
 
         // Check if we're not on the default searchResultsPage.
         if (
             searchResultsPage &&
             searchResultsPage !== '/' &&
             basePath !== searchResultsPage
         ) {
             // Remove trailing '/' from searchResultsPage.
             if (searchResultsPage.endsWith('/')) {
                 searchResultsPage = searchResultsPage.replace(/\/$/, '');
             }
             // Set a hard link to the default search page.
             path = searchResultsPage + path;
         } else {
             path = basePath + path;
         }
         return {
             useHardLink,
             path
         };
     },
 
     createPropertyUrl: function () {
         const { stores, spaPath } = this.context;
         const { PropertyId, PropertyAddress } = this.props;
 
         const searchType = stores.SearchStateStore.getItem('searchType');
         const viewType = { view: searchType };
 
         const detailsLink = this.buildDetailsPagePath(
             spaPath.path,
             PropertyId,
             PropertyAddress.urlAddress,
             stores
         );
 
         let linkProps = {
             to: { pathname: detailsLink.path, query: viewType || null }
         };
 
         const aspectParam = (searchType == null) ? "?view=" : createQueryString(viewType);
 
         if (detailsLink.useHardLink) {
             linkProps = {
                 href: detailsLink.path + aspectParam
             };
         }
 
         return window.location.origin + linkProps.href;
     },
 
     // Form submission method.
     formSubmit: function () {
         const { stores } = this.context;
         const features = stores.ConfigStore.getItem('features');
         const language = stores.ConfigStore.getItem('i18n');
         const placeholder = language.contactModalAdditionalDropdownPlaceholder ? language.contactModalAdditionalDropdownPlaceholder : (features.contactModalAdditionalDropdownPlaceholder ? features.contactModalAdditionalDropdownPlaceholder : 'Role');
         let state = { ...this.state };
 
         if (features && features.displayIndiaDisclaimer) {
             if (this.state.indiaComms && this.state.indiaTerms) {
                 state.formData.disclaimer.value = true;
             } else {
                 state.formData.disclaimer.value = false;
             }
         }
 
         this.setState(state);
         // If we are trying to submit the form but user has dismissed the initial challenge, show it again
         if (!this.state.formData.verification.value && !features.recaptchaV3) {
             grecaptcha.execute();
         } else if (!this.state.formData.verification.value && features.recaptchaV3) {
             this.recaptchaChallenge(features.recaptchaV3);
             return;
         }
 
         if (!state.canSubmit) {
             state.submitted = true;
             this.runValidations(state, true);
             this.setState({ ...this.state, disableSubmit: false });
             return;
         }
 
         const secondaryEmails = stores.ConfigStore.getItem(
             'additionalEmailAddresses'
         );
 
         var formData = state.formData,
             postData = {
                 CaptchaResponse: formData.verification.value,
                 CustomerContact: {
                     EmailAddress: formData.email.value,
                     Name: formData.name.value,
                     TelephoneNumber: formData.telephone.value,
                     CompanyName: formData.company.value,
                     Role: formData.dropDownValue
                 },
                 Message: formData.message.value,
                 // leaving comment with prev code to append Role to message body below in case this still needs to happen
                 MessageBody: formData.message.value,// + (formData.dropDownValue ? ('                ' + placeholder + ': ' + formData.dropDownValue) : ''), 
                 Disclaimer: formData.disclaimer.value,
                 PropertyId: this.props.PropertyId,
                 PropertyUrl: this.createPropertyUrl(),
                 RequestType: this.props.RequestType,
                 RecipientEmailAddress: this.props.RecipientEmailAddress,
                 AgentOffice: this.props.AgentOffice,
                 ReferrerPageTitle: this.props.ReferrerPageTitle,
                 SiteID: this.props.SiteID,
                 SecondaryReceipients: secondaryEmails,
                 PropertyType: this.props.property && this.props.property.UsageType
             };
 
         if (!features.showCompanyFieldOnContactModal) {
             delete postData.CustomerContact.CompanyName;
         }
         // Bypass API telephone validation
         if (formData.telephone.value === '') {
             delete postData.CustomerContact.TelephoneNumber;
         }
 
         $.ajax({
             url: this.props.ApiUrl,
             type: 'post',
             contentType: 'application/json',
             data: JSON.stringify(postData),
 
             success: this.formSubmissionSuccess(postData),
             error: this.formSubmissionFailure
         }).then(() => {
             if (features.recaptchaV3) {
                 const temp = postData;
                 if (temp.formData.verification.value) {
                     temp.formData.verification.value = '';
                 }
                 this.setState({ postData: temp, submitted: true, disableSubmit: false });
             } else {
                 this.setState({ postData: postData, submitted: true, disableSubmit: false });
             }
         });
     },
 
     formSubmissionSuccess: function (contactData) {
 
        const features = this.context.stores.ConfigStore.getItem('features');
         // ga4 event
        fireAnalyticsTracking(features, this.context, eventTypes.FORM_SUBMITTED, CreateGLFormSubmitEvent(this.props.source || '', contactData, this.props.property), false);
        // ua event
        this._fireEvent('contactUsSuccessful', {
        propertyId: this.props.PropertyId
        });
        
        
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'formSubmission',
            formType: 'contactUsSuccessful',
            formPosition: window.location.href.includes('/details/')
                ? 'Property details'
                : 'Search Results',
            siteType: window.cbreSiteType || DefaultValues.cbreSiteType,
            searchType:
                this.getSearchStateStore().getItem('searchType') ||
                DefaultValues.searchType,
            propertyId: this.props.PropertyId,
            propertyAddress: this.props.PropertyAddress.line1,
            propertyCity: this.props.PropertyAddress.locality,
            form: {
                brokerId: this.props.RecipientEmailAddress,
                propertyId: this.props.PropertyId,
                propertyAddress: this.props.PropertyAddress.line1,
                brokerRole: (this.state.formData.dropDownValue ? this.state.formData.dropDownValue : '')
            },
            path: window.location.href
        });
        

         // Analytics: -- 'close', 'User successfully submitted contact form', this.state.postData
         this.setState({
             submitSuccessful: true
         });
     },
 
     formSubmissionFailure: function (response) {
         this._fireEvent('contactUsFailure', {
             propertyId: this.props.PropertyId,
             errorData: response
         });
         // Analytics: -- 'failure', 'User experienced a failure while submitting the contact form', response
         this.setState({
             submitFailure: true
         });
     },
 
     getPropertyDetails: function () {
         var msg = this.props.labels.message.defaultValue,
             token = this.props.labels.message.messageToken,
             address = {
                 propertyId: this.props.PropertyId || '',
                 addressLine1: this.props.PropertyAddress.line1 || '',
                 addressLine2: this.props.PropertyAddress.line2 || '',
                 addressLine3: this.props.PropertyAddress.line3 || '',
                 addressLine4: this.props.PropertyAddress.line4 || '',
                 addressLocality: this.props.PropertyAddress.locality || '',
                 addressRegion: this.props.PropertyAddress.region || '',
                 addressCountry: this.props.PropertyAddress.country || '',
                 addressPostCode: this.props.PropertyAddress.postcode || ''
             };
 
         for (var key in address) {
             if (address.hasOwnProperty(key)) {
                 token = token.replace('%(' + key + ')s', address[key]);
             }
         }
 
         return msg.replace('%(propertyDetails)s', token).replace(' ,', ' ');
     },
 
     render: function () {
         const { stores } = this.context;
         const features = stores.ConfigStore.getItem('features');
         const language = stores.ConfigStore.getItem('i18n');
         const messgaePlaceHolder = language['contactMessagePlaceHolder'] || 'Enter message';
 
         var props = this.props,
             state = this.state,
             msg = this.getPropertyDetails();
 
         if (this.state.submitSuccessful) {
             if (features.enableContactModalReredesign) {
                 if (window.cbreSiteTheme === 'commercialr4') {
                     return (
                         <div className="ContactForm-message" style={{ background: '#eee', marginTop: '30px', minWidth: '330px', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                             {/* <img src="https://wwwlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/icon-success.png" alt="form-success" style={{ maxWidth: '60px', margin: '20px auto' }} /> */}
                             <p className="cbre-spa--pre-line" style={{ color: '#666', lineHeight: '15px', fontFamily: 'futura-pt', fontWeight: '700' }}>
                                 <span id="successMessageText" style={{fontFamily: 'Financier Medium', fontSize: '24px', fontWeight: '500'}}>
                                     {props.labels.successMsg}
                                 </span>
                                 {this.props.hideContactInfoOnModal}
                             </p>
                         </div>
                     );
                 } else {
                     return (
                         <div className="ContactForm-message" style={{ background: '#eee', marginTop: '30px', minWidth: '330px', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                             <img src="https://wwwlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/icon-success.png" alt="form-success" style={{ maxWidth: '60px', margin: '20px auto' }} />
                             <p className="cbre-spa--pre-line" style={{ color: '#666', lineHeight: '15px', fontFamily: 'futura-pt', fontWeight: '700' }}>
                                 {props.labels.successMsg}
                                 {this.props.hideContactInfoOnModal}
                             </p>
                         </div>
                     );
                 }
             } else {
                 return (
                     <div className="ContactForm-message">
                         <p className="cbre-spa--pre-line">
                             {props.labels.successMsg}
                         </p>
                         <Button bsStyle="link" onClick={this.close}>
                             {props.labels.closeLinkTxt}
                         </Button>
                     </div>
                 );
             }
         }
 
         if (this.state.submitFailure) {
             return (
                 <div className="ContactForm-message">
                     <p className="cbre-spa--pre-line failureMessage">
                         {props.labels.errorMsg}
                     </p>
                     <Button bsStyle="link" onClick={this.close}>
                         {props.labels.closeLinkTxt}
                     </Button>
                 </div>
             );
         }
 
         // HACK: only thing i could find that actually worked.
         // This will force Chrome to respect the form autocomplete attribute
         var _autoCompleteHack = (
             <div style={{ display: 'none' }}>
                 <input
                     type="text"
                     id="PreventChromeAutocomplete"
                     name="PreventChromeAutocomplete"
                     autoComplete="address-level4"
                 />
             </div>
         );
 
         return (
             <div className={window.cbreSiteTheme === 'commercialr3' ? 'contact-form-container' : ''}>
                 <form
                     ref="contactForm"
                     className="ContactForm-form"
                     autoComplete="off"
                 >
                     {this.props.children}
                     {_autoCompleteHack}
                     <FormGroup bsSize="lg">
                         <ControlLabel
                             bsClass={
                                 state.formData.name.error.length
                                     ? "control-label form-error"
                                     : "control-label sr-only"
                             }
                         >
                             {state.formData.name.error.length
                                 ? state.formData.name.error
                                 : props.labels.name.label}
                         </ControlLabel>
                         <FormControl
                             type="text"
                             defaultValue={props.labels.name.defaultValue}
                             bsSize="large"
                             placeholder={props.labels.name.label}
                             required
                             onFocus={this.bindUserIntention}
                             onBlur={this.handleChange.bind(this, "name")}
                             onChange={
                                 state.formData.name.error.length
                                     ? this.handleChange.bind(this, "name")
                                     : null
                             }
                         />
                     </FormGroup>
 
                     <FormGroup bsSize="lg">
                         <ControlLabel
                             bsClass={
                                 state.formData.email.error.length
                                     ? "control-label form-error"
                                     : "control-label sr-only"
                             }
                         >
                             {state.formData.email.error.length
                                 ? state.formData.email.error
                                 : props.labels.email.label}
                         </ControlLabel>
                         <FormControl
                             type="email"
                             defaultValue={props.labels.email.defaultValue}
                             bsSize="large"
                             placeholder={props.labels.email.label}
                             required
                             onBlur={this.handleChange.bind(this, "email")}
                             onChange={
                                 state.formData.email.error.length
                                     ? this.handleChange.bind(this, "email")
                                     : null
                             }
                         />
                     </FormGroup>
 
                     {features.contactModalAdditionalDropdown &&
                         <Select_R3
                             name="Contact-Options"
                             id="Roles"
                             placeholder={
                                 this.state.formData.dropDownValue ? undefined :
                                     (language.contactModalAdditionalDropdownPlaceholder ? language.contactModalAdditionalDropdownPlaceholder :
                                         (features.contactModalAdditionalDropdownPlaceholder ? features.contactModalAdditionalDropdownPlaceholder : 'Role')
                                     )
                             }
                             optionsArray={language.contactModalAdditionalDropdown ? language.contactModalAdditionalDropdown : features.contactModalAdditionalDropdown}
                             onChange={this.handleDropdownChange}
                         />
                     }
                     {features.showCompanyFieldOnContactModal &&
                         <FormGroup bsSize="lg" id="Company">
                             <ControlLabel
                                 bsClass={
                                     state.formData.company.error.length
                                         ? "control-label form-error"
                                         : "control-label sr-only"
                                 }
                             >
                                 {state.formData.company.error.length
                                     ? state.formData.company.error
                                     : props.labels.company.label}
                             </ControlLabel>
                             <FormControl
                                 name="Company"
                                 type="text"
                                 defaultValue={props.labels.company.defaultValue}
                                 bsSize="large"
                                 placeholder={props.labels.company.label}
                                 onFocus={this.bindUserIntention}
                                 onBlur={this.handleChange.bind(this, "company")}
                                 onChange={
                                     state.formData.company.error.length
                                         ? this.handleChange.bind(this, "company")
                                         : null
                                 }
                             />
                         </FormGroup>
                     }
                     <FormGroup bsSize="lg">
                         <ControlLabel
                             bsClass={
                                 state.formData.telephone.error.length
                                     ? "control-label form-error"
                                     : "control-label sr-only"
                             }
                         >
                             {state.formData.telephone.error.length
                                 ? state.formData.telephone.error
                                 : props.labels.telephone.label}
                         </ControlLabel>
                         <FormControl
                             type="text"
                             defaultValue={props.labels.telephone.defaultValue}
                             bsSize="large"
                             placeholder={props.labels.telephone.label}
                             onBlur={this.handleChange.bind(this, "telephone")}
                             onChange={
                                 state.formData.telephone.error.length
                                     ? this.handleChange.bind(this, "telephone")
                                     : null
                             }
                         />
                     </FormGroup>
                     <div className="form-group">
                         <label
                             className={
                                 state.formData.message.error.length
                                     ? "form-label form-error"
                                     : "sr-only"
                             }
                         >
                             {state.formData.message.error.length
                                 ? state.formData.message.error
                                 : props.labels.message.label}
                         </label>
                         <textarea
                             className="form-control"
                             type="textarea"
                             placeholder={messgaePlaceHolder}
                             rows="4"
                             defaultValue={features.contactFormUseDefaultMessage ? state.formData.message.value : ''}
                             onBlur={this.handleChange.bind(this, "message")}
                             onChange={
                                 state.formData.message.error.length
                                     ? this.handleChange.bind(this, "message")
                                     : null
                             }
                             style={(window.cbreSiteTheme === "commercialr4") ? { height: '65px', fontSize: '18px', 'padding-left': '17px' } : {}}
                         />
                     </div>
 
                     <div className="form-group">
                         <label
                             className={
                                 state.formData.verification.error.length
                                     ? "form-error control-label"
                                     : "sr-only"
                             }
                         >
                             {state.formData.verification.error.length
                                 ? state.formData.verification.error
                                 : props.labels.verification.label}
                         </label>
 
 
                         {(features && features.recaptchaV3) ?
                             <div
                                 className="g-recaptcha"
                                 data-sitekey={features.recaptchaV3}
                                 data-size="invisible"
                             ></div>
                             :
                             <div
                                 id="recaptcha"
                                 ref="recaptcha"
                                 className="g-recaptcha"
                             />
                         }
 
                     </div>
                     {features && features.displaySupplimentaryDisclaimer && (
                         <div className="form-group checkboxGroup max-width-300px">
                             <label className="checkboxWrap">
                                 <FormControl
                                     type="checkbox"
                                     defaultValue={false}
                                     checked={state.formData.disclaimer.value}
                                     onChange={this.handleChange.bind(
                                         this,
                                         "disclaimer"
                                     )}
                                     className="formField formField__checkbox"
                                 />
                                 <span className="cbre_checkbox" />
                                 <span className="formLabel">
                                     {props.labels.disclaimer.label}
                                 </span>
                             </label>
                             {state.formData.disclaimer.error.length > 0 && (
                                 <div className="control-label form-error">
                                     {state.formData.disclaimer.error}
                                 </div>
                             )}
                         </div>
                     )}
                     {features && features.displayIndiaDisclaimer && (
                         <div className="form-group checkboxGroup max-width-300px">
                             <label className="checkboxWrap">
                                 <FormControl
                                     name="indiaTerms"
                                     type="checkbox"
                                     defaultValue={false}
                                     checked={this.state.indiaTerms}
                                     onChange={() =>
                                         this.setState({
                                             indiaTerms: !this.state.indiaTerms
                                         })
                                     }
                                     className="formField formField__checkbox"
                                 />
                                 <span className="cbre_checkbox" />
                                 <span className="formLabel">
                                     <TranslateString
                                         string="ContactFormFieldDisclaimerLabel"
                                         unsafe
                                     />
                                 </span>
                             </label>
                             {state.formData.disclaimer.error &&
                                 !this.state.indiaTerms && (
                                     <div className="control-label form-error">
                                         {state.formData.disclaimer.error}
                                     </div>
                                 )}
                         </div>
                     )}
                     {features && features.displayIndiaDisclaimer && (
                         <div className="form-group checkboxGroup max-width-300px">
                             <label className="checkboxWrap">
                                 <FormControl
                                     name="indiaComms"
                                     type="checkbox"
                                     defaultValue={false}
                                     checked={this.state.indiaComms}
                                     onChange={() =>
                                         this.setState({
                                             indiaComms: !this.state.indiaComms
                                         })
                                     }
                                     className="formField formField__checkbox"
                                 />
                                 <span className="cbre_checkbox" />
                                 <span className="formLabel">
                                     {language["ContactFormFieldCommunicationLabel"]}
                                 </span>
                             </label>
                             {state.formData.disclaimer.error &&
                                 !this.state.indiaComms && (
                                     <div className="control-label form-error">
                                         You must accept the marketing communications
                                         agreement
                                     </div>
                                 )}
                         </div>
                     )}
 
                     <div className="contact_button_wrapper">
                         {this.state.disableSubmit && <Spinner className="submit_spinner" />}
                         <Button
                             className="cbre_button cbre_button__primary"
                             onClick={this.handleClick}
                             disabled={this.state.disableSubmit}
                             bsStyle="primary"
                             bsSize="large"
                             block
                             style={window.cbreSiteTheme === "commercialr3" ? { textTransform: "uppercase", fontWeight: "700", fontSize: "14px", letterSpacing: "3px" } : {}}
                         >
                             {props.labels.buttonTxt}
                         </Button>
                     </div>
 
 
                     {features && features.displayContactFormSubmitDisclaimerLabel && (
                         <div id="disclaimer" style={window.cbreSiteTheme === "commercialr3" ? { marginTop: "20px" } : { marginTop: "10px" }}>
                             <TranslateString
                                 string="ContactFormSubmitDisclaimerLabel"
                                 unsafe
                             />
                         </div>
                     )}
 
                     {features && features.recaptchaV3 &&
                         <div id="recaptchaDisclaimer" style={{ marginTop: '15px' }}>
                             {language["GoogleDisclaimer"] ? (
                                 <TranslateString
                                 string="GoogleDisclaimer"
                                 unsafe
                             />
                             ) :  (
                                 <React.Fragment>
                             This site is protected by reCAPTCHA and the Google
                             <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer"> Privacy Policy</a> and
                             <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer"> Terms of Service</a> apply.
                             
                             </React.Fragment>)}
                             </div>
                     }
 
                 </form>
             </div>
         );
     }
 });
 
 ContactForm.contextTypes = {
     stores: PropTypes.object,
     location: PropTypes.object,
     actions: PropTypes.object,
     spaPath: PropTypes.object
 };
 
 // module.exports = ContactForm;
 export default ContactForm;
 