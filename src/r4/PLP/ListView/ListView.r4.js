import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { CardGroup, responsiveContainer, debounce } from '../../../external-libraries/agency365-components/components';
import TranslateString from '../../../utils/TranslateString';
import scrollToTop from '../../../utils/scrollToTop';
// import trackingEvent from '../../../utils/trackingEvent';
import Slider from 'react-slick';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import PropertyCard_R4 from '../PropertyCard/PropertyCard.r4';
import ContactFormWrapper from '../../../list-map-components/ContactFormWrapper/ContactFormWrapper';
import $ from 'jquery';
import LazyLoad from 'react-lazyload';
import { isPrerender } from '../../../utils/browser';
import ListPageBar from '../../../list-map-components/PaginatedListMap/components/PageBar.jsx';
import { generateControlBarMessage } from '../../../list-map-components/PaginatedListMap/components/ControlBar.jsx';
import styled from 'styled-components';
import ListControlBar from '../../../list-map-components/PaginatedListMap/components/ControlBar.jsx';

class ListView_R4 extends Component {
    constructor(props, context) {
        super(props);
        this.cards = {};
        this.cardGroups = {};
        this.setMultiplePropertyStyles = this.setMultiplePropertyStyles.bind(
            this
        );
        this.onCarouselChange = this.onCarouselChange.bind(this);
        this.scrollWindowHeightModifier = 0;
        this.scrollTime = 100;
        this.onTouchEndUpdateWindowHeightModifierTimeout = undefined;
        this.features = context.stores.ConfigStore.getItem('features');
        this.fullScreenSticky = props.fullScreenSticky;
        this.spinAfterTransition = props.spinAfterTransition || function () { };
        this.shouldTriggerScroll = false;
        this.debouncedActivateTopProperty = debounce(
            this.activateTopProperty,
            this.features.enhancedMapList ? 250 : 150
        );
        this.debouncedHandleEndScroll = debounce(
            this.handleEndScroll,
            this.features.enhancedMapList ? 250 : 150
        );
        this.onCarouselAboutToChange = this.onCarouselAboutToChange.bind(this);
    }

    ieVersion() {
        var ua = window.navigator.userAgent;
        if (ua.indexOf("Trident/7.0") > -1)
            return 11;
        else if (ua.indexOf("Trident/6.0") > -1)
            return 10;
        else if (ua.indexOf("Trident/5.0") > -1)
            return 9;
        else
            return 0;  // not IE9, 10 or 11
    }

    componentWillMount() {
        if (this.fullScreenSticky) {
            $('body').addClass('fullScreenSticky');
        }
    }

    componentDidMount() {
        if (!this.fullScreenSticky) {
            this.getCardListNode().addEventListener('scroll', this.handleScroll);
            this.getCardListNode().addEventListener(
                'mousedown',
                this.toggleScrollAreaClickState
            );
            this.getCardListNode().addEventListener(
                'mouseup',
                this.toggleScrollAreaClickState
            );
            this.activateTopProperty();
        } else {
            window.addEventListener('resize', function () {
                if ($(window).width() < 768 && this.fullScreenSticky) {
                    this.setState({ fullScreenSticky: false })
                }
            });
        }
        this.props.modal.addModal('contact');
        if (isPrerender){
            window.prerenderReady = true;
        }
    }

    componentWillUnmount() {
        if (!this.fullScreenSticky) {
            this.getCardListNode().removeEventListener('scroll', this.handleScroll);
            this.getCardListNode().removeEventListener(
                'mousedown',
                this.toggleScrollAreaClickState
            );
            this.getCardListNode().removeEventListener(
                'mouseup',
                this.toggleScrollAreaClickState
            );
        }
    }

    toggleScrollAreaClickState = () => {
        this.isMouseDown = !this.isMouseDown;
        if (!this.isMouseDown) {
            this.debouncedActivateTopProperty();
        }
    };

    getCardListNode = () => {
        return findDOMNode(this.refs.cardList);
    };

    jqueryScrollToProperty = (nextProps) => {
        const currentProperty = this.props.selectedItems.property;
        let incomingProperty = nextProps.selectedItems.property;
        let isGroup = false;

        // if the selected pin is a group, the props we need to target will be selectedItems.scrollToProperty instead
        if (Object.keys(nextProps.selectedItems.property).length === 0) {
            incomingProperty = nextProps.selectedItems.scrollToProperty ? nextProps.selectedItems.scrollToProperty : '';
            isGroup = true;
        }

        // set up Dom element targets
        let currentPropertyCard = $('.' + currentProperty.PropertyId);
        if (!currentPropertyCard) {
            currentPropertyCard = $('.' + currentProperty.PropertyId + 'group');
        }
        const incomingPropertyCard = $('.' + incomingProperty.PropertyId + (isGroup ? 'group' : ''));

        if ((Object.keys(incomingProperty).length == 0) || (!incomingPropertyCard.offset())) {
            return;
        }

        // move the element to the middle of the viewport - 93px for the subnav + filter bar
        const scrollTo = () => {
            $([document.documentElement, document.body]).animate({
                scrollTop: incomingPropertyCard.offset().top - ($(window).height() / 2 - 93)
            }, 500);

            // double check scrollTo positioning after initial the scrollTo, adjusting immediately if the inital scrollTo is offset
            // some property cards might have a height different than the default card height once they're lazy loaded, causing an offset on initial scrollTo calls as they pass unloaded cards
            $([document.documentElement, document.body]).animate({
                scrollTop: incomingPropertyCard.offset().top - ($(window).height() / 2 - 93)
            }, 1);
        };


        // if currentProperty doesn't exist, it's likely due to no initial property selected 
        if (currentProperty && currentProperty.PropertyId && incomingProperty.PropertyId) {
            scrollTo();
            currentPropertyCard.removeClass('is-selected');
            incomingPropertyCard.addClass('is-selected');
        } else {
            if (incomingProperty.PropertyId) {
                scrollTo();
                if (currentPropertyCard) { currentPropertyCard.removeClass('is-selected'); }
                incomingPropertyCard.addClass('is-selected');
            }
        }
    };

    shouldComponentUpdate(nextProps) {
        if (this.fullScreenSticky) {
            this.jqueryScrollToProperty(nextProps);
            setTimeout(() => {
                this.jqueryScrollToProperty(nextProps);
            }, 400);
            return true;
        } else {
            const triggerState = this.shouldTriggerScroll;
            if (triggerState !== nextProps.shouldTriggerScroll) {
                if (nextProps.shouldTriggerScroll === true) {
                    this.shouldTriggerScroll = false;
                    this.spinning = true;
                    setTimeout(
                        () =>
                            this.debouncedHandleEndScroll({
                                ...this.props.selectedItems
                            }),
                        100
                    );
                    setTimeout(() => (this.spinning = false), 600);
                }
                return false;
            }
            return true;
        }
    }

    componentDidUpdate(prevProps) {
        const { selectedItems } = prevProps;

        const {
            selectedItems: newSelectedItems,
            renderAsCarousel
        } = this.props;

        if (renderAsCarousel) {
            const id =
                newSelectedItems.group || newSelectedItems.property.PropertyId;
            this.goToPropertySlide(id);
        }

        // Bail if we're not supposed to scroll
        if (newSelectedItems.disableScroll || this.spinning) {
            return;
        }

        if (selectedItems != newSelectedItems && !this.fullScreenSticky) {
            this.spinTo(
                this.getSpinTarget(newSelectedItems),
                newSelectedItems.group
            );
        }

        if (prevProps.properties !== this.props.properties) {
            const cardList = this.getCardListNode();
            if (cardList) {
                scrollToTop(cardList, 0, this.scrollTime, () => {
                    setTimeout(() => {
                        this.spinning = false;
                    }, 150);
                });
            }
        }
    }

    goToPropertySlide = id => {
        try {
            const slideIndex = this.refs.slickCarousel.props.children.findIndex(
                c => c.key === id
            );
            if (slideIndex !== -1) {
                // with 'enhanced' mode off there could be none selected
                this.refs.slickCarousel.slickGoTo(slideIndex);
            }
        } catch (e) {
            // suppress for now
        }

    };

    getSpinTarget = selectedItems => {
        let id;
        if (selectedItems.scrollToProperty) {
            id = selectedItems.scrollToProperty.PropertyId;
        } else {
            id = selectedItems.property.PropertyId;
        }

        let $spinTo = this.cards[`propertyCard_${id}`];
        if (!$spinTo) {
            $spinTo = this.cardGroups[`cardGroup_${id}`];
        }

        return $spinTo;
    };

    spinTo = (to, group, topOffset = 10) => {
        const cardList = this.getCardListNode();
        let overrideScrollAuto;

        if (this.clearFavouritesButton) {
            const cardListRect = cardList.getBoundingClientRect();
            const clearFavouritesButtonRect = this.clearFavouritesButton.getBoundingClientRect();
            if (cardListRect.bottom === clearFavouritesButtonRect.bottom) {
                overrideScrollAuto = true;
            }
        }

        if (cardList && to && !overrideScrollAuto) {
            this.spinning = true;
            let offset = to.offsetTop;
            if (group) {
                offset += this.cardGroups[`cardGroup_${group}`].offsetTop;
            }
            scrollToTop(cardList, offset - topOffset, this.scrollTime, () => {
                setTimeout(() => {
                    this.spinning = false;
                }, 150);
            });
        }
    };

    activateTopProperty = () => {
        const { isMobile } = this.props.breakpoints;
        const enhanced = this.features.enhancedMapList ? !isMobile : false;

        if (this.isMouseDown || this.scrolling || this.spinning || !enhanced) {
            return;
        }

        const sortBar = this.props.sortBarRef;

        if (typeof sortBar === 'undefined' || !sortBar || !sortBar.getBoundingClientRect) {
            return;
        }

        const marginTopOffset = 10;
        const cardListViewPortTop =
            sortBar.getBoundingClientRect().top +
            sortBar.offsetHeight +
            marginTopOffset;
        const cards = this.cards;

        for (let card in cards) {
            if (cards.hasOwnProperty(card)) {
                const _card = cards[card];
                const cardRect = _card.getBoundingClientRect();
                const cardBottomPosition = cardRect.bottom;
                const cardHeight = cardRect.height;
                const cardMidPoint = cardBottomPosition - cardHeight / 2;

                // Get first card with its bottom position within viewport.
                if (
                    cardBottomPosition >= cardListViewPortTop &&
                    cardMidPoint >= cardListViewPortTop
                ) {
                    const cardId = card.split('_')[1];
                    const property = this.findMatchingProperty(
                        this.props.groupedProperties,
                        cardId
                    );
                    if (Array.isArray(property)) {
                        this.setLiveMarkerId(property[0], false, property[1]);
                    } else {
                        this.setLiveMarkerId(property, false);
                    }
                    return;
                }
            }
        }
    };

    findMatchingProperty = (properties, findId) => {
        let result;

        for (let i = 0; i < properties.length; i++) {
            const property = properties[i];
            if (property.PropertyId === findId) {
                result = property;
            } else if (property.items && property.items.length) {
                result = property.items.find(p => p.PropertyId === findId);
                if (result) {
                    result = [property, result];
                }
            }

            if (result) return result;
        }
    };

    handleScroll = () => {
        if (!this.fullScreenSticky) {
            this.scrolling = true;
            this.debouncedHandleEndScroll();
        }
    };

    handleEndScroll = (selectedItems = null) => {
        selectedItems = selectedItems || this.props.selectedItems;
        this.scrolling = false;
        if (this.features.sortPropertiesByRelevancy) {
            this.debouncedHandleEndScroll()
        } else if (!this.spinAfterTransition()) {
            this.debouncedActivateTopProperty();
        } else {
            this.spinTo(this.getSpinTarget(selectedItems), selectedItems.group);
        }
    };

    setMultiplePropertyStyles(node, isMobile) {
        const scrollViewport = node.querySelector('.scrollViewport');
        const scrollWindow = node.querySelector('.scrollWindow');
        const scrollArea = node.querySelector('.scrollInner');
        const cardGroup = node.querySelector('.cardGroup');

        // Reset styles if not on mobile.
        if (!isMobile || !this.props.renderAsCarousel) {
            scrollViewport.style.height = 'auto';
            cardGroup.style.marginTop = 'auto';
            return;
        }

        // Get map height from map ref in store.
        const { stores } = this.context;
        const mapState = stores.SearchStateStore.getItem('mapState');

        let mapNode = null;
        let mapHeight;
        if (mapState && mapState.ref && mapState.ref.props && mapState.ref.props.map) {
            mapNode = mapState.ref.props.map.getDiv();
            // Add a fallback of 500 for tesing in isolation.
            mapHeight = mapNode ? mapNode.clientHeight : 500;
        }

        // Set scrollbar height.
        scrollWindow.style.height = `${mapHeight}px`;

        // Set offset to raise carousel item.
        const propertyListingsHeight = 87;
        const initialOffsetTop = mapHeight - (propertyListingsHeight + 50);
        cardGroup.style.marginTop = `${initialOffsetTop}px`;

        // Set scroll viewport height to height of visible properties.
        // This is neeed so that map is clickable.
        const scrollWindowHeight =
            propertyListingsHeight +
            50 +
            scrollArea.scrollTop +
            this.scrollWindowHeightModifier;
        scrollViewport.style.height = `${scrollWindowHeight}px`;
    }

    handleMultiplePropertyEvents = (card, key) => {
        const node = findDOMNode(card);
        // Add/Remove scroll listener.
        // Callback apply dynamic styles to carousel items.
        if (node) {
            const { isMobile } = this.props.breakpoints;
            this.cardGroups[`cardGroup_${key}`] = node;

            const hasTouchEvents =
                'ontouchstart' in window && 'ontouchend' in window;
            const boundSetMultiplePropertyStyles = this.setMultiplePropertyStyles.bind(
                null,
                node
            );

            const onTouchStartUpdateWindowHeightModifier = () => {
                clearTimeout(this.onTouchEndUpdateWindowHeightModifierTimeout);
                this.scrollWindowHeightModifier = 1000;
                this.setMultiplePropertyStyles(node, isMobile);
            };

            const onTouchEndUpdateWindowHeightModifier = () => {
                clearTimeout(this.onTouchEndUpdateWindowHeightModifierTimeout);
                this.onTouchEndUpdateWindowHeightModifierTimeout = setTimeout(
                    () => {
                        this.scrollWindowHeightModifier = 0;
                        this.setMultiplePropertyStyles(node, isMobile);
                        this.onTouchEndUpdateWindowHeightModifierTimeout = undefined;
                    },
                    100
                );
            };

            const delayTouchEnd = () => {
                if (this.onTouchEndUpdateWindowHeightModifierTimeout) {
                    clearTimeout(
                        this.onTouchEndUpdateWindowHeightModifierTimeout
                    );
                    onTouchEndUpdateWindowHeightModifier();
                }
            };

            const scrollArea = node.querySelector('.scrollInner');

            if (!this.fullScreenSticky) {
                if (isMobile) {
                    if (hasTouchEvents) {
                        scrollArea.addEventListener(
                            'touchstart',
                            onTouchStartUpdateWindowHeightModifier
                        );
                        scrollArea.addEventListener(
                            'touchend',
                            onTouchEndUpdateWindowHeightModifier
                        );
                        scrollArea.addEventListener('scroll', delayTouchEnd);
                    } else {
                        scrollArea.addEventListener(
                            'scroll',
                            boundSetMultiplePropertyStyles
                        );
                    }
                } else {
                    if (hasTouchEvents) {
                        scrollArea.removeEventListener(
                            'touchstart',
                            onTouchStartUpdateWindowHeightModifier
                        );
                        scrollArea.removeEventListener(
                            'touchend',
                            onTouchEndUpdateWindowHeightModifier
                        );
                        scrollArea.removeEventListener('scroll', delayTouchEnd);
                    } else {
                        scrollArea.removeEventListener(
                            'scroll',
                            boundSetMultiplePropertyStyles
                        );
                    }
                }
            }
            // Set styles on initial load.
            this.setMultiplePropertyStyles(node, isMobile);
        }
    };

    createCardReference(card, key, group) {
        let node = findDOMNode(card);
        if (node) {
            node.isInGroup = group;
            this.cards[`propertyCard_${key}`] = node;
        }
    }

    renderProperties() {
        const {
            isListCollapsed,
            language,
            renderAsCarousel,
            groupedProperties,
            properties,
            selectedItems: { group }
        } = this.props;

        const { isMobile, isTabletAndDown } = this.props.breakpoints;

        const enhanced = this.features.enhancedMapList ? !isMobile : false;

        let propertySource = (groupedProperties && groupedProperties.length) ? groupedProperties : [];

        if (this.features && this.features.sortPropertiesByRelevancy && properties.length) {

            const sharedProperties = groupedProperties.filter(property =>
                property.hasOwnProperty("items")
            );

            const duplicateIds = sharedProperties
                .map(group => group.items)
                .flat()
                .map(item => item.PropertyId);

            const filteredProperties = properties.filter(
                p => !duplicateIds.includes(p.PropertyId)
            );

            let _1 = filteredProperties.filter(
                p => p.PropertyId.split("-")[2] === "1"
            );
            let _2 = filteredProperties.filter(
                p => p.PropertyId.split("-")[2] === "2"
            );
            let _3 = filteredProperties.filter(
                p => p.PropertyId.split("-")[2] === "3"
            );

            for (const p of sharedProperties) {
                const suffix = p.items[0].PropertyId.split("-")[2];

                if (suffix === "1") _1.push(p);
                if (suffix === "2") _2.push(p);
                if (suffix === "3") _3.push(p);
            }

            propertySource = [..._1, ..._2, ..._3];
        }



        const propertiesOutput = propertySource.map((property, propertyIndex) => {
            if (property.hasOwnProperty('items')) {
                let propertyCount = 1;
                if (property.items) {
                    propertyCount = property.items.length
                }
                const groupProperties = property.items.map((property, index) => {
                    return this.renderProperty(property, (this.features.disableGroupedProperties ? false : true), isMobile, propertyCount, index);
                });


                const isSelected =
                    group === property.key ? 'is_selected' : null;
                const classes = [
                    'cardGroup',
                    'cardItem',
                    isSelected,
                    isListCollapsed
                        ? 'cardGroup__withSpacing'
                        : 'cardGroup__withSpacingLarge'
                ];

                let mouseEvents = {};
                if (!renderAsCarousel && !this.fullScreenSticky) {
                    mouseEvents = {
                        onMouseEnter: () => {
                            if (enhanced && this.scrolling) {
                                return;
                            }
                            if (this.activateTopTimeout) {
                                clearTimeout(this.activateTopTimeout);
                            }
                            this.setLiveMarkerId(property, true);
                        },
                        onMouseLeave: () => {
                            if (enhanced && this.scrolling) {
                                return;
                            }
                            this.activateTopTimeout = setTimeout(
                                this.debouncedActivateTopProperty,
                                150
                            );
                        }
                    };
                }

                if (window.cbreSiteTheme === 'commercialr4' && isTabletAndDown && !isMobile) {
                    return (groupProperties);
                } else {
                    return (
                        <div
                            ref={ref =>
                                this.handleMultiplePropertyEvents(
                                    ref,
                                    property.key
                                )
                            }
                            key={property.key}
                            {...mouseEvents}
                            className={groupProperties[0].key + ' pCardgroup'}
                        >
                            <div className="scrollViewport">
                                <div className="scrollWindow">
                                    <div className="scrollInner">
                                        <CardGroup
                                            tokenisedStatus={
                                                language.TokenReplaceStrings
                                                    .PropertyGroupTeaserText
                                            }
                                            tokenisedStatusStatic={
                                                language.TokenReplaceStrings
                                                    .PropertyGroupMobileTeaserText
                                            }
                                            viewMoreText={{
                                                more: (
                                                    <TranslateString string="PropertyGroupExpand" />
                                                ),
                                                less: (
                                                    <TranslateString string="PropertyGroupCollapse" />
                                                )
                                            }}
                                            teaserCount={
                                                isMobile && renderAsCarousel
                                                    ? groupProperties.length
                                                    : 2
                                            }
                                            scrollToTopOf=".propertyResults_content"
                                            features={this.features}
                                            className={classNames(classes)}
                                        >
                                            {groupProperties}
                                        </CardGroup>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
            } else {
                return this.renderProperty(property, false, isMobile, 1, propertyIndex);
            }
        });

        return (
            <ListWrapper>
                {propertiesOutput}
            </ListWrapper>
        );
    }

    renderSlickCarousel() {
        const settings = {
            autoplay: false,
            mobileFirst: true,
            infinite: true,
            speed: 300,
            swipeToSlide: true,
            variableWidth: false,
            afterChange: this.onCarouselChange,
            beforeChange: this.onCarouselAboutToChange
        };

        return (
            <Slider ref="slickCarousel" {...settings}>
                {this.renderProperties()}
            </Slider>
        );
    }

    onCarouselAboutToChange(current, next) {
        const { groupedProperties } = this.props;
        const property = groupedProperties[next];

        if (this.props.onSliderChanged) {
            this.props.onSliderChanged(next, !property.hasOwnProperty('PropertyId'));
        }
    }

    onCarouselChange(slide) {
        if (slide < 0) {
            return;
        }

        const { groupedProperties } = this.props;

        const property = groupedProperties[slide];
        this.setLiveMarkerId(property);

        // reset height of scrolling property cards to default
        const scrollViewports = document.querySelectorAll('.scrollViewport');

        scrollViewports.forEach(scrollViewport => {
            scrollViewport.style.height = '137px';
        });
    }

    setLiveMarkerId = (property, disableScroll, scrollToProperty) => {
        const { setSelectedItems } = this.props;

        let markerId;
        let _property;
        let _group;
        if (property.hasOwnProperty('PropertyId')) {
            _property = property;
            markerId = `${property.PropertyId}_marker`;
        } else {
            _group = property.key;
            markerId = `${property.key}_cluster`;
        }

        setSelectedItems({
            marker: markerId,
            property: _property || {},
            group: _group,
            scrollToProperty,
            disableScroll
        });
    };

    renderProperty(property, isGroup, isMobile, propertyCount, propertyIndex) {
        const {
            renderAsCarousel,
            modal,
            spaPath,
            propertyLinkClickHandler,
            selectedItems: { property: selectedProperty },
            siteType
        } = this.props;

        const { PropertyId: propertyId } = property;

        const enhanced = this.features.enhancedMapList ? !isMobile : false;
        const isMobileCarousel = isMobile && renderAsCarousel;

        let mouseEvents = {};
        if (!isGroup && !renderAsCarousel && !this.fullScreenSticky) {
            mouseEvents = {
                onMouseEnter: () => {
                    if (enhanced && this.scrolling) {
                        return;
                    }
                    if (this.activateTopTimeout) {
                        clearTimeout(this.activateTopTimeout);
                    }
                    if (
                        !selectedProperty.PropertyId ||
                        selectedProperty.PropertyId !== property.PropertyId
                    ) {
                        this.setLiveMarkerId(property, true);
                    }
                    if (this.props.propertyOverHandler) {
                        this.props.propertyOverHandler(property);
                    }
                },
                onMouseLeave: () => {
                    if (enhanced && this.scrolling) {
                        return;
                    }
                    this.activateTopTimeout = setTimeout(
                        this.debouncedActivateTopProperty,
                        250
                    );
                    if (this.props.propertyOverHandler) {
                        this.props.propertyOverHandler(undefined);
                    }
                }
            };
        }

        const isSelected =
            selectedProperty.PropertyId === propertyId ? 'is_selected' : null;
        const classes = ['cardItem', isSelected];

        return (
            (isGroup || isMobileCarousel || isPrerender || (window.cbreSiteTheme === 'commercialr4')) ?
                <PropertyCard_R4
                    ref={ref =>
                        this.createCardReference(ref, propertyId, isGroup)
                    }
                    key={propertyId}
                    property={property}
                    contactClickHandler={(property, contact, event) => {
                        modal.getModal('contact').show(property, contact, event, 'PLP', 'Property Enquiry');
                    }}
                    spaPath={spaPath}
                    isFullScreen={this.fullScreenSticky}
                    siteType={siteType}
                    propertyLinkClickHandler={propertyLinkClickHandler}
                    className={classNames(classes)}
                    mouseEvents={mouseEvents}
                    dynamicImageSizeKey={'plpPropertyCard'}
                />
                :
                <LazyLoad
                    key={`${propertyId}_propertycard`}
                    offset={300}
                    height={300}
                    scroll={this.fullScreenSticky ? true : false}
                    overflow={this.fullScreenSticky ? false : true}
                    once={true}
                    placeholder={
                        <div className={'lazyload-placeholder ' + propertyId}
                            style={{ height: '300px' }}>
                        </div>
                    }
                    children={
                        <PropertyCard_R4
                            ref={ref =>
                                this.createCardReference(ref, propertyId, isGroup)
                            }
                            key={propertyId}
                            property={property}
                            contactClickHandler={(property, contact, event) => {
                                modal.getModal('contact').show(property, contact, event, 'PLP', 'Property Enquiry');
                            }}
                            spaPath={spaPath}
                            isFullScreen={this.fullScreenSticky}
                            siteType={siteType}
                            propertyLinkClickHandler={propertyLinkClickHandler}
                            className={classNames(classes)}
                            mouseEvents={mouseEvents}
                            dynamicImageSizeKey={'plpPropertyCard'}
                        />
                    }
                />
        );
    }

    getClearButtonRef = ref => {
        this.clearFavouritesButton = findDOMNode(ref);
    };

    render() {
        const { renderAsCarousel, modal } = this.props;

        const propertiesRender = renderAsCarousel
            ? this.renderSlickCarousel()
            : this.renderProperties();

        const container = this.refs.propertyCardList;
        const list = this.refs.cardList;
        const card = list ? list.querySelector('.card') : undefined;
        const styleObj = {};

        if (this.props.breakpoints.isTabletAndUp && container && card && !this.fullScreenSticky) {
            styleObj.paddingBottom = `${container.offsetHeight -
                card.offsetHeight}px`;
        }

        const { isTabletAndDown } = this.props.breakpoints;

        return (
            <div className="propertyResults_content" ref="propertyCardList">
                <div className="card_list" ref="cardList" style={styleObj}>
                    <ListControlBar
                        context={context}
                        language={this.props.language}
                        listMapVariables={this.props.listMapVariables}
                        share={true}
                        sort={true}
                        view={true}
                        modal={this.props.modal}
                        sortChangeCallback={this.props.sortChangeCallback}
                        includePagingControls={false}
                        r4={this.props.r4}
                    />
                    {isTabletAndDown && this.props.propertyCount && this.props.propertyCount > 0 &&
                        <MobilePropertyCount>
                            {generateControlBarMessage(this.context, this.props.language, this.props.propertyCount, '', this.props.propertiesContext)}
                        </MobilePropertyCount>
                    }
                    {!this.props.loading && this.props.viewableMarkerCount === 0 ?
                        <NoPropertiesFound>
                            <NoPropertiesFoundHeader>
                                {context.language['NoPropertiesFoundHeader'] || 'No matching results'}
                            </NoPropertiesFoundHeader>
                            <NoPropertiesFoundParagraph>
                                {context.language['NoPropertiesFoundParagraph'] || 'There are no results which match your criteria. Try changing your filters.'}
                            </NoPropertiesFoundParagraph>
                            <ResetFilters onClick={() => { window.location = location.protocol + '//' + location.host + location.pathname }}>
                                {context.language['NoPropertiesFoundResetFilters'] || 'Reset Filters'}
                            </ResetFilters>
                            {this.features && this.features.searchAllLink &&
                                <SearchAll onClick={() => { window.location = features.searchAllLink }}>
                                    {context.language['NoPropertiesFoundSearchAll'] || 'Search All Properties'}
                                </SearchAll>
                            }
                        </NoPropertiesFound>
                        :
                        <PropertyCardPadding>{propertiesRender}</PropertyCardPadding>
                    }
                    {!this.props.loading && this.props.breakpoints.isTabletAndDown && <ListPageBar context={this.context} r4={true} includeRecordsPerPage={true} />}
                </div>

                <ContactFormWrapper
                    className={'listmap-modal'}
                    modal={modal.getModal('contact')}
                />
            </div>
        );
    }
}

const ResetFilters = styled.button`
    color: #003F2D !important;
    font-size: 18px !important;
    margin-top: 5px !important;
    border: none;
    font-family: 'Calibre Semibold' !important;
    background: transparent;
    margin-left: 5px !important;
    padding: 5px 20px !important;
`;

const SearchAll = styled.button`
    color: #003F2D !important;
    font-size: 18px !important;
    margin-top: 5px !important;
    border: 2px #003F2D solid !important;
    font-family: 'Calibre Semibold' !important;
    background: transparent;
    margin-left: 30px !important;
    padding: 5px 20px !important;
`;

const NoPropertiesFound = styled.div`
    padding-left:20px;
`;

const NoPropertiesFoundHeader = styled.h5`
    font-family: "Financier Medium" !important;
    font-size: 40px !important;
    line-height: 40px !important;
    color: #003F2D !important;
    margin-top: 30px !important;
`;

const NoPropertiesFoundParagraph = styled.p`
    font-family: "Calibre Medium" !important;
    font-size: 20px !important;
    line-height: 24px !important;
    letter-spacing: -0.015em !important;
    color: #262626 !important;
    max-width: 450px;
    margin-top: 25px !important;
`;

const ListWrapper = styled.div`
    .card_list {
        @media screen and (max-width: 1440px){
            padding: none !important;
        }
    }
`;

const PropertyCardPadding = styled.div`
    @media screen and (max-width: 520px){
        padding: 0 20px 20px 20px;
    }
    @media screen and (min-width: 520px) and (max-width: 1440px){
        padding: 0;
    }
`;

const MobilePropertyCount = styled.div`
    font-family: Financier Display !important;
    font-size: 24px;
    color: #003F2D;
    height: 30px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 5px;
    margin-left: 10px;

`;

ListView_R4.contextTypes = {
    stores: PropTypes.object,
    actions: PropTypes.object,
    spaPath: PropTypes.object
};

ListView_R4.propTypes = {
    properties: PropTypes.array.isRequired,
    groupedProperties: PropTypes.array.isRequired,
    searchType: PropTypes.string.isRequired,
    spaPath: PropTypes.object.isRequired,
    recaptchaKey: PropTypes.string.isRequired,
    apiUrl: PropTypes.string.isRequired,
    siteId: PropTypes.string.isRequired,
    propertyLinkClickHandler: PropTypes.func.isRequired,
    siteType: PropTypes.string.isRequired,
    selectedItems: PropTypes.object.isRequired,
    setSelectedItems: PropTypes.func.isRequired,
    onSliderChanged: PropTypes.func,
    modal: PropTypes.object.isRequired,
    imageOrientation: PropTypes.string,
    renderAsCarousel: PropTypes.bool.isRequired,
    favouritesIsActive: PropTypes.bool.isRequired,
    fullScreenSticky: PropTypes.bool,
    loading: PropTypes.bool,
    propertyCount: PropTypes.number,
    propertiesContext: PropTypes.string
};

export default responsiveContainer(ListView_R4);
// export const ListViewTest = ListView;
