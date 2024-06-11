import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import IconButton from "@mui/material/IconButton";
import styled from "styled-components";
import { RetailSize } from "../../../../constants/APIMapping";

/**
 * Contact
 * @example
 *
 * <Contact
 *  firstName="Micheal"
 *  lastName="Jones"
 *  avatar={<Avatar src="http://dummyimage.com/60x60/000/fff" size={60} />}
 *  icons={<FontIcon iconName="icon_phone" />}
 *  />
 */
class Contact extends Component {
    render() {
        const {
            firstName,
            lastName,
            name,
            avatar,
            icons,
            className,
            jobtitle,
            onClick,
            features,
            ...other
        } = this.props;

        let contactName;
        let isR4PLP =
            !window.location.pathname.includes("details") &&
            window.cbreSiteTheme == "commercialr4";
        const displayName =
            firstName && lastName
                ? `${firstName} ${lastName}`
                : name
                ? name
                : null;
        
        if (displayName) {
            if (isR4PLP) {
                contactName = (
                    <div className={"cbre_button_text"}>
                        <p className="Contact_text-wrap">
                            <span style={{ fontSize: "14px" }}>
                                {displayName}
                            </span>
                            {features && features.displayContactInfoOnPropertyCard && (
                                <span style={{ marginRight: "auto" }}>
                                    <Icons>
                                        <IconContainer>
                                            <IconButton>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 20 20"
                                                    fill="none"
                                                >
                                                    <path
                                                        d="M16.6666 5.00002H15.8333V11.6667C15.8333 12.125 15.4583 12.5 15 12.5H4.99996V13.3334C4.99996 14.25 5.74996 15 6.66663 15H15L18.3333 18.3334V6.66669C18.3333 5.75002 17.5833 5.00002 16.6666 5.00002ZM14.1666 9.16669V3.33335C14.1666 2.41669 13.4166 1.66669 12.5 1.66669H3.33329C2.41663 1.66669 1.66663 2.41669 1.66663 3.33335V14.1667L4.99996 10.8334H12.5C13.4166 10.8334 14.1666 10.0834 14.1666 9.16669Z"
                                                        fill="#003F2D"
                                                    />
                                                </svg>
                                            </IconButton>
                                        </IconContainer>
                                    </Icons>
                                </span>
                            )}
                        </p>
                        {jobtitle && (
                            <span style={{ display: "block" }}>{jobtitle}</span>
                        )}
                    </div>
                );
            } else {
                contactName = (
                    <div className={"cbre_button_text"}>
                        <p className="Contact_text-wrap">{displayName}</p>
                        {jobtitle && (
                            <span style={{ display: "block" }}>{jobtitle}</span>
                        )}
                    </div>
                );
            }
        } else {
            return null;
        }

        let iconMarkup;
        if (icons && icons.length) {
            iconMarkup = icons;
        }

        const classes = classNames(
            "external-libraries-contact-container",
            className
        );

        return (
            <div onClick={onClick} className={classes}>
                {avatar}
                {contactName}
                {iconMarkup}
            </div>
        );
    }
}

const IconContainer = styled.div`
    font-size: 16px;
    display: flex;
    color: #003f2d !important;
    font-family: "Calibre Regular";
    text-indent: 8px;
    margin-top: 8px;
    svg {
        margin-right: 9px;
    }
`;

const Icons = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: -3px;
`;

Contact.propTypes = {
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    name: PropTypes.string,
    avatar: PropTypes.node,
    icons: PropTypes.array,
    jobtitle: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
    features: PropTypes.object
};
Contact.defaultProps = {
    firstName: "",
    lastName: "",
    name: "",
    avatar: "",
    icons: [],
    className: "",
    jobtitle: "",
    onClick: () => {},
    features: {}
};

export default Contact;
