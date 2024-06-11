import trackingEvent from "../utils/trackingEvent";
import Carousel from "../list-map-components/Carousel/Carousel";
import { debounce } from "lodash";
import buildPropertyObject from "../utils/buildPropertyObject";
import Ajax from "../utils/ajax";
import createQueryString from "../utils/createQueryString";
import _ from "lodash";
import { Grid } from "react-bootstrap";
import styled from 'styled-components';

const PropTypes = require("prop-types"),
    React = require("react"),
    ComponentPathMixin = require("../mixins/ComponentPathMixin")(__dirname),
    StoresMixin = require("../mixins/StoresMixin"),
    ApplicationActionsMixin = require("../mixins/ApplicationActionsMixin"),
    BootstrapMixin = require("../mixins/BootstrapMixin"),
    LanguageMixin = require("../mixins/LanguageMixin"),
    PropertyCarousel = require("./PropertyCarousel"),
    ErrorView = require("./ErrorView"),
    DefaultValues = require("../constants/DefaultValues"),
    APIMapping = require("../constants/APIMapping"),
    createReactClass = require("create-react-class"),
    propertiesContainer = require("../containers/propertiesContainer"),
    configContainer = require("../containers/configContainer");

const siteTheme = window.cbreSiteTheme || DefaultValues.cbreSiteTheme;

const Carousel2 = createReactClass({
    displayName: "Carousel2",

    mixins: [
        StoresMixin,
        LanguageMixin,
        ApplicationActionsMixin,
        ComponentPathMixin,
        BootstrapMixin
    ],

    contextTypes: {
        router: PropTypes.object,
        stores: PropTypes.object,
        language: PropTypes.object,
        actions: PropTypes.object
    },

    childContextTypes: {
        language: PropTypes.object,
        searchType: PropTypes.string,
        spaPath: PropTypes.object,
        options: PropTypes.object
    },

    getInitialState: function () {
        const { staticQuery } = this.props;
        const { retainOrder, carouselStaticQuery } = this.getConfigStore().getFeatures();

        if (carouselStaticQuery && staticQuery) {
            return { properties: [] };
        }

        const list = this.getParamStore().getParam("propertyId")
            ? this.getParamStore()
                .getParam("propertyId")
                .split(",")
            : null;

        if (!retainOrder || !list || list.length === 0) {
            return { properties: this.props.properties };
        } else {
            let properties = [];
            list.forEach(id => {
                const property = this.props.properties.filter(
                    doc => doc.PropertyId === id
                )[0];
                if (property) {
                    properties.push(property);
                }
            });
            return { properties };
        }
    },

    componentWillMount() {
        window.addEventListener("resize", this.handleResize);
        this.setBreakpointState();
        const { staticQuery } = this.props;
        const features = this.getConfigStore().getFeatures();

        if (features && features.carouselStaticQuery && staticQuery) {
            this.fetchStaticQueryProperties(staticQuery);
        }
    },

    fetchStaticQueryProperties(staticQuery) {
        const ConfigStore = this.getConfigStore(),
            ParamStore = this.getParamStore(),
            _culture = ConfigStore.getItem("language") || DefaultValues.culture,
            _units = ParamStore.getParam("Unit") || DefaultValues.uom,
            _currency =
                ParamStore.getParam("CurrencyCode") || DefaultValues.currency,
            _urlslug =
                ConfigStore.getItem("urlPropertyAddressFormat") ||
                DefaultValues.urlPropertyAddressFormat;

        const params = createQueryString(
            _.pick(ParamStore.getParams(), [
                "CurrencyCode",
                "Unit",
                "Interval",
                "Site"
            ])
        );

        const url =
            ConfigStore.getItem("api") +
            `/propertylistings/query${params}&${staticQuery}`;

        Ajax.call(
            url,
            data => {
                if (data.Documents[0].length) {
                    const [docs] = data.Documents;
                    let properties = [];
                    const retainOrder = this.getConfigStore().getFeatures()
                        .retainOrder;
                    const primaryKeys = staticQuery
                        .split("&")
                        .filter(i => i.indexOf("PrimaryKey") !== -1)[0];

                    const list = primaryKeys.split("=")[1].split(",");

                    if (!retainOrder || !list || list.length === 0) {
                        properties = docs.map(item =>
                            buildPropertyObject(
                                item,
                                _culture,
                                _units,
                                _currency,
                                _urlslug,
                                ConfigStore
                            )
                        );
                    } else {
                        list.forEach(id => {
                            const doc = docs.filter(
                                doc => doc["Common.PrimaryKey"] === id
                            )[0];
                            if (doc) {
                                properties.push(
                                    buildPropertyObject(
                                        doc,
                                        _culture,
                                        _units,
                                        _currency,
                                        _urlslug,
                                        ConfigStore
                                    )
                                );
                            }
                        });
                    }
                    this.setState({ properties });
                }
            },
            error => {
                console.log(error);
            }
        );
    },

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    },

    setBreakpointState() {
        const isMobile = !!window.matchMedia("(max-width: 767px)").matches;
        this.setState(
            {
                breakpoints: {
                    isMobile
                }
            },
            this.forceUpdate.bind(this)
        );
    },

    handleResize() {
        var _this = this;
        var debounced = debounce(function () {
            _this.setBreakpointState();
        }, 500); // Maximum run of once per 500 milliseconds
        return debounced();
    },

    getChildContext: function () {
        return {
            searchType: this.state.searchType,
            language: this.state.language,
            spaPath: this.props.spaPath
        };
    },

    componentDidUpdate: function () {
        if (!this.state.loading) {
            this.state.dispatchCustomEvent.preRender(this.getActions());
        }
    },

    carouselScroll: function (index) {
        const { stores, actions } = this.context;

        trackingEvent(
            "siblingCarouselScroll",
            {
                carousel: index
            },
            stores,
            actions
        );
    },

    loadRelatedProperty: function (coordinates, index, id) {
        //const { stores, actions } = this.context;
        // Get related property
        this.context.actions.getProperty(id, true);

        // trackingEvent('siblingCarouselClickThru', {
        //     propertyId: id
        // }, stores, actions);
    },

    render: function () {
        if (this.state.error) {
            return (
                <ErrorView
                    title={this.state.language.ErrorTitle}
                    className="config-error container"
                >
                    <h4>{this.state.language.ErrorSubTitle}</h4>
                    <p>{this.state.language.ErrorText}</p>
                </ErrorView>
            );
        }

        if (this.state.fatalError) {
            return (
                <ErrorView title="Sorry" className="config-error container">
                    <h4>We are sorry, there has been an error.</h4>

                    <p>Please try again later.</p>
                </ErrorView>
            );
        }

        var searchType =
            this.getSearchStateStore().getItem("searchType") ||
            DefaultValues.searchType,
            config = this.getConfigStore().getConfig();

        const carouselCardProps = {
            spaPath: this.getChildContext().spaPath,
            siteType:
                window.cbreSiteType ||
                this.context.stores.ConfigStore.getItem("siteType") ||
                DefaultValues.cbreSiteType,
            propertyLinkClickHandler: this.loadRelatedProperty
        };

        let configForCta = this.props.carouselConfig
            ? { ...config.carouselConfig, ...this.props.carouselConfig }
            : config.carouselConfig;

        let ctaProps = {
            text: configForCta.callToActionLinkTitle,
            link: configForCta.callToActionLink,
            target: configForCta.callToActionTarget,
            description: configForCta.description
        };
        let title =
            this.props.carouselConfig && this.props.carouselConfig.title
                ? this.props.carouselConfig.title
                : config.title;

        return (
            <Grid fluid>
                {config.carouselConfig &&
                    config.carouselConfig.type === "Card" ? (
                    <div
                        className={
                            siteTheme == "commercialr3"
                                ? "cbre_container featuredCarousel"
                                : "cbre_container"
                        }
                    >
                        <div className="row" style={{marginTop: '35px'}}>
                            <div className="col-xs-12 col-md-12 col-lg-12 center-block">
                                {(siteTheme === "commercialr4") ?
                                    <StyledCarousel>
                                        <Carousel
                                            cta={ctaProps}
                                            title={title}
                                            dots={false}
                                            arrows={true}
                                            slidesToShow={4}
                                            slidesToScroll={1}
                                            items={this.state.properties}
                                            cardProps={carouselCardProps}
                                            className="cbre_multiCarousel margin-bottom-40 cbre_standalone_carousel r4Carousel"
                                            type="Card"
                                            useHardLink={true}
                                            featuredRedesignCarousel={false}
                                        />
                                    </StyledCarousel>
                                    :
                                    <Carousel
                                        cta={ctaProps}
                                        title={title}
                                        dots={true}
                                        arrows={false}
                                        slidesToShow={
                                            config.carouselConfig &&
                                                config.carouselConfig.numberOfItems
                                                ? config.carouselConfig
                                                    .numberOfItems
                                                : 4
                                        }
                                        slidesToScroll={
                                            config.carouselConfig &&
                                                config.carouselConfig.numberOfItems
                                                ? config.carouselConfig
                                                    .numberOfItems
                                                : 4
                                        }
                                        items={this.state.properties}
                                        cardProps={carouselCardProps}
                                        className="cbre_multiCarousel margin-bottom-40 cbre_standalone_carousel"
                                        type="Card"
                                        useHardLink={true}
                                        featuredRedesignCarousel={
                                            siteTheme == "commercialr3"
                                                ? true
                                                : false
                                        }
                                    />
                                }
                            </div>
                        </div>
                    </div>
                ) : (
                    <PropertyCarousel
                        searchResultsPage={
                            config.carouselConfig
                                ? config.carouselConfig.searchResultsPage
                                : config.searchConfig.searchResultsPage
                        }
                        standAlone={true}
                        hideCounter={true}
                        searchType={searchType}
                        properties={this.state.properties}
                        isImageRestricted={false}
                    />
                )}
            </Grid>
        );
    }
});

const StyledCarousel = styled.div`
    .r4Carousel {
        margin-top: 30px !important;
        > img {
            top: -55px !important;
            height: 50px !important;
            width: 50px !important;
        }
        .slick-prev {
            left: auto;
            right: 65px;
            transform: rotate(180deg);
            top: -80px !important;
        }
        .slick-next {
            right: 0 !important;
        }
    }
`;

module.exports = {
    _Carousel: Carousel2,
    Carousel: configContainer(
        propertiesContainer(Carousel2, {
            propertiesMap: [
                APIMapping.Highlights._key,
                APIMapping.ContactGroup.contacts._key,
                APIMapping.MinimumSize._key,
                APIMapping.MaximumSize._key,
                APIMapping.TotalSize._key
            ],
            loadOnMount: true
        })
    )
};
