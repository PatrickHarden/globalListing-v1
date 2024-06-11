module.exports = function(style) {
    switch (style) {
        case 'light':
            return [
                {
                    featureType: 'all',
                    elementType: 'labels.text.fill',
                    stylers: [
                        {
                            color: '#7c93a3'
                        },
                        {
                            lightness: '-10'
                        }
                    ]
                },
                {
                    featureType: 'all',
                    elementType: 'labels.text.fill',
                    stylers: [
                        {
                            color: '#7c93a3'
                        },
                        {
                            lightness: '-10'
                        }
                    ]
                },
                {
                    featureType: 'administrative.country',
                    elementType: 'geometry',
                    stylers: [
                        {
                            visibility: 'on'
                        }
                    ]
                },
                {
                    featureType: 'administrative.country',
                    elementType: 'geometry.stroke',
                    stylers: [
                        {
                            color: '#a0a4a5'
                        }
                    ]
                },
                {
                    featureType: 'administrative.province',
                    elementType: 'geometry.stroke',
                    stylers: [
                        {
                            color: '#62838e'
                        }
                    ]
                },
                {
                    featureType: 'landscape',
                    elementType: 'geometry.fill',
                    stylers: [
                        {
                            color: '#f5f5f5'
                        }
                    ]
                },
                {
                    featureType: 'landscape.man_made',
                    elementType: 'geometry.stroke',
                    stylers: [
                        {
                            color: '#3f4a51'
                        },
                        {
                            weight: '0.30'
                        }
                    ]
                },
                {
                    featureType: 'poi',
                    elementType: 'all',
                    stylers: [
                        {
                            visibility: 'simplified'
                        }
                    ]
                },
                {
                    featureType: 'poi.attraction',
                    elementType: 'all',
                    stylers: [
                        {
                            visibility: 'on'
                        }
                    ]
                },
                {
                    featureType: 'poi.business',
                    elementType: 'all',
                    stylers: [
                        {
                            visibility: 'off'
                        }
                    ]
                },
                {
                    featureType: 'poi.government',
                    elementType: 'all',
                    stylers: [
                        {
                            visibility: 'off'
                        }
                    ]
                },
                {
                    featureType: 'poi.park',
                    elementType: 'all',
                    stylers: [
                        {
                            visibility: 'on'
                        }
                    ]
                },
                {
                    featureType: 'poi.place_of_worship',
                    elementType: 'all',
                    stylers: [
                        {
                            visibility: 'off'
                        }
                    ]
                },
                {
                    featureType: 'poi.school',
                    elementType: 'all',
                    stylers: [
                        {
                            visibility: 'off'
                        }
                    ]
                },
                {
                    featureType: 'poi.sports_complex',
                    elementType: 'all',
                    stylers: [
                        {
                            visibility: 'off'
                        }
                    ]
                },
                {
                    featureType: 'road',
                    elementType: 'all',
                    stylers: [
                        {
                            visibility: 'on'
                        },
                        {
                            saturation: '-100'
                        }
                    ]
                },
                {
                    featureType: 'road',
                    elementType: 'geometry.stroke',
                    stylers: [
                        {
                            visibility: 'on'
                        }
                    ]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'geometry.fill',
                    stylers: [
                        {
                            color: '#e5e5e5'
                        }
                    ]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'geometry.stroke',
                    stylers: [
                        {
                            color: '#bbcacf'
                        },
                        {
                            weight: '0.50'
                        },
                        {
                            lightness: '0'
                        }
                    ]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'labels',
                    stylers: [
                        {
                            visibility: 'on'
                        }
                    ]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'labels.text',
                    stylers: [
                        {
                            visibility: 'on'
                        }
                    ]
                },
                {
                    featureType: 'road.highway.controlled_access',
                    elementType: 'geometry.fill',
                    stylers: [
                        {
                            color: '#ffffff'
                        }
                    ]
                },
                {
                    featureType: 'road.highway.controlled_access',
                    elementType: 'geometry.stroke',
                    stylers: [
                        {
                            color: '#a9b4b8'
                        }
                    ]
                },
                {
                    featureType: 'road.arterial',
                    elementType: 'labels.icon',
                    stylers: [
                        {
                            invert_lightness: true
                        },
                        {
                            weight: '0.01'
                        },
                        {
                            saturation: '-7'
                        },
                        {
                            lightness: '3'
                        },
                        {
                            gamma: '1.80'
                        }
                    ]
                },
                {
                    featureType: 'transit',
                    elementType: 'all',
                    stylers: [
                        {
                            visibility: 'off'
                        }
                    ]
                },
                {
                    featureType: 'water',
                    elementType: 'geometry.fill',
                    stylers: [
                        {
                            color: '#a3c7df'
                        }
                    ]
                }
            ];
        case 'blue':
            return [
                {
                    featureType: 'all',
                    elementType: 'all',
                    stylers: [
                        {
                            hue: '#007fff'
                        },
                        {
                            saturation: 89
                        }
                    ]
                },
                {
                    featureType: 'water',
                    elementType: 'all',
                    stylers: [
                        {
                            color: '#ffffff'
                        }
                    ]
                },
                {
                    featureType: 'administrative.country',
                    elementType: 'labels',
                    stylers: [
                        {
                            visibility: 'off'
                        }
                    ]
                }
            ];
        case 'simple':
            return [
                {
                    featureType: 'administrative',
                    elementType: 'labels.text.fill',
                    stylers: [
                        {
                            color: '#444444'
                        }
                    ]
                },
                {
                    featureType: 'landscape.man_made',
                    elementType: 'all',
                    stylers: [
                        {
                            visibility: 'on'
                        }
                    ]
                },
                {
                    featureType: 'poi',
                    elementType: 'all',
                    stylers: [
                        {
                            visibility: 'off'
                        }
                    ]
                },
                {
                    featureType: 'poi.park',
                    elementType: 'geometry.fill',
                    stylers: [
                        {
                            visibility: 'on'
                        },
                        {
                            color: '#d2e3a1'
                        }
                    ]
                },
                {
                    featureType: 'poi.place_of_worship',
                    elementType: 'all',
                    stylers: [
                        {
                            visibility: 'on'
                        }
                    ]
                },
                {
                    featureType: 'poi.place_of_worship',
                    elementType: 'geometry.fill',
                    stylers: [
                        {
                            visibility: 'on'
                        }
                    ]
                },
                {
                    featureType: 'road',
                    elementType: 'all',
                    stylers: [
                        {
                            saturation: '0'
                        },
                        {
                            lightness: 45
                        }
                    ]
                },
                {
                    featureType: 'road',
                    elementType: 'geometry.fill',
                    stylers: [
                        {
                            visibility: 'on'
                        }
                    ]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'all',
                    stylers: [
                        {
                            visibility: 'on'
                        }
                    ]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'geometry.fill',
                    stylers: [
                        {
                            saturation: '-100'
                        }
                    ]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'geometry.stroke',
                    stylers: [
                        {
                            color: '#d6d9e6'
                        }
                    ]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'labels.icon',
                    stylers: [
                        {
                            visibility: 'simplified'
                        }
                    ]
                },
                {
                    featureType: 'road.arterial',
                    elementType: 'all',
                    stylers: [
                        {
                            visibility: 'on'
                        }
                    ]
                },
                {
                    featureType: 'road.arterial',
                    elementType: 'geometry.stroke',
                    stylers: [
                        {
                            color: '#d6d9e6'
                        },
                        {
                            weight: '1.50'
                        }
                    ]
                },
                {
                    featureType: 'road.arterial',
                    elementType: 'labels.icon',
                    stylers: [
                        {
                            visibility: 'on'
                        }
                    ]
                },
                {
                    featureType: 'road.local',
                    elementType: 'all',
                    stylers: [
                        {
                            visibility: 'on'
                        }
                    ]
                },
                {
                    featureType: 'road.local',
                    elementType: 'geometry.stroke',
                    stylers: [
                        {
                            color: '#d6d9e6'
                        }
                    ]
                },
                {
                    featureType: 'road.local',
                    elementType: 'labels.icon',
                    stylers: [
                        {
                            visibility: 'on'
                        }
                    ]
                },
                {
                    featureType: 'transit',
                    elementType: 'all',
                    stylers: [
                        {
                            visibility: 'off'
                        }
                    ]
                },
                {
                    featureType: 'transit.line',
                    elementType: 'all',
                    stylers: [
                        {
                            visibility: 'on'
                        }
                    ]
                },
                {
                    featureType: 'transit.station',
                    elementType: 'all',
                    stylers: [
                        {
                            visibility: 'on'
                        }
                    ]
                },
                {
                    featureType: 'transit.station.bus',
                    elementType: 'all',
                    stylers: [
                        {
                            visibility: 'off'
                        }
                    ]
                },
                {
                    featureType: 'water',
                    elementType: 'all',
                    stylers: [
                        {
                            color: '#dfeff1'
                        },
                        {
                            visibility: 'on'
                        }
                    ]
                }
            ];
    }

    // Slugify
    return { styles: [] };
};
