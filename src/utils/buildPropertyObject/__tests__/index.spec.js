var buildPropertyObject = require('../');

describe('buildPropertyObject', function() {
    describe('When multiple language options are provided', function() {
        describe('and we want multiple elements', function() {
            var property = {
                'Common.Brochures': [
                    {
                        'Common.Uri': 'Brochure1.pdf',
                        'Common.CultureCode': 'en-GB'
                    },
                    {
                        'Common.Uri': 'Brochure2.pdf',
                        'Common.CultureCode': 'es-SP'
                    },
                    {
                        'Common.Uri': 'Brochure3.pdf',
                        'Common.BrochureName': 'Brochure 3',
                        'Common.CultureCode': 'en-GB'
                    }
                ]
            };
            describe('and there are complete matches on the culture code', function() {
                it('should extract the matching items', function() {
                    var output = buildPropertyObject(
                        property,
                        'en-GB',
                        'sqft',
                        'GBP',
                        '%(line1)s-%(line2)s'
                    );
                    expect(output.Brochures.length).toBe(2);
                    expect(output.Brochures[1].uri).toBe('Brochure3.pdf');
                    expect(output.Brochures[1].brochureName).toBe('Brochure 3');
                });
            });

            describe('and there are partial matches on the culture code', function() {
                it('should extract the matching items', function() {
                    property = {
                        'Common.Brochures': [
                            {
                                'Common.Uri': 'Brochure1.pdf',
                                'Common.CultureCode': 'en'
                            },
                            {
                                'Common.Uri': 'Brochure2.pdf',
                                'Common.CultureCode': 'es-SP'
                            },
                            {
                                'Common.Uri': 'Brochure3.pdf',
                                'Common.CultureCode': 'en'
                            }
                        ]
                    };
                    var output = buildPropertyObject(
                        property,
                        'en-GB',
                        'sqft',
                        'GBP',
                        '%(line1)s-%(line2)s'
                    );
                    expect(output.Brochures.length).toBe(2);
                    expect(output.Brochures[1].uri).toBe('Brochure3.pdf');
                });
            });
            describe('and there is partial and complete matches on the culture code', function() {
                it('should extract the exact matching items only', function() {
                    property = {
                        'Common.Brochures': [
                            {
                                'Common.Uri': 'Brochure1.pdf',
                                'Common.CultureCode': 'en-GB'
                            },
                            {
                                'Common.Uri': 'Brochure2.pdf',
                                'Common.CultureCode': 'es-SP'
                            },
                            {
                                'Common.Uri': 'Brochure3.pdf',
                                'Common.CultureCode': 'en'
                            }
                        ]
                    };
                    var output = buildPropertyObject(
                        property,
                        'en-GB',
                        'sqft',
                        'GBP',
                        '%(line1)s-%(line2)s'
                    );
                    expect(output.Brochures.length).toBe(1);
                    expect(output.Brochures[0].uri).toBe('Brochure1.pdf');
                });
            });
        });
        describe('and we only want a single element', function() {
            var property = {
                'Common.ContactGroup': {
                    'Common.GroupName': [
                        {
                            'Common.CultureCode': 'en-GB',
                            'Common.Text': 'English Text'
                        },
                        {
                            'Common.CultureCode': 'fr-FR',
                            'Common.Text': 'Texte Francaise'
                        }
                    ]
                }
            };
            describe('and there is a complete match on the culture code', function() {
                describe('should choose the desired language, and return the first element', function() {
                    var output = buildPropertyObject(
                        property,
                        'en-GB',
                        'sqft',
                        'GBP',
                        '%(line1)s-%(line2)s'
                    );

                    it('should extract the english translation text', function() {
                        expect(output.ContactGroup.name).toBe('English Text');
                    });
                });
            });
            describe('and there is a partial match on the culture code', function() {
                describe('should choose the desired language, and return the first element', function() {
                    var output = buildPropertyObject(
                        property,
                        'fr',
                        'sqft',
                        'GBP',
                        '%(line1)s-%(line2)s'
                    );

                    it('should extract the english translation text', function() {
                        expect(output.ContactGroup.name).toBe(
                            'Texte Francaise'
                        );
                    });
                });
            });
            describe('and there is a no match on the culture code but the array is populated', function() {
                describe('should choose the first item in the array', function() {
                    var output = buildPropertyObject(
                        property,
                        'pt-PT',
                        'sqft',
                        'GBP',
                        '%(line1)s-%(line2)s'
                    );

                    it('should extract the english translation text', function() {
                        expect(output.ContactGroup.name).toBe('English Text');
                    });
                });
            });
            describe('and there is a no matching comparitor, and the array is populated, and the _allowFallback flag is set', function() {
                property = {
                    'Common.EnergyPerformanceData': {
                        'Germany.HeatEnergy': [
                            {
                                'Common.EnergyUnits': 'kwh',
                                'Common.Amount': 102,
                                'Common.Interval': 'Annually',
                                'Common.PerUnit': 'sqm'
                            },
                            {
                                'Common.EnergyUnits': 'kj',
                                'Common.Amount': 102,
                                'Common.Interval': 'Annually',
                                'Common.PerUnit': 'sqm'
                            }
                        ]
                    }
                };
                describe('should choose the first item in the array', function() {
                    var output = buildPropertyObject(
                        property,
                        'en-GB',
                        'sqft',
                        'GBP',
                        '%(line1)s-%(line2)s'
                    );

                    it('should extract the kwh item', function() {
                        expect(
                            output.EnergyPerformanceData.heatEnergy.energyUnits
                        ).toBe('kwh');
                    });
                });
            });
            describe('and the array is empty', function() {
                describe('should return null', function() {
                    property = {
                        'Common.ContactGroup': {
                            'Common.GroupName': []
                        }
                    };
                    var output = buildPropertyObject(
                        property,
                        'pt-PT',
                        'sqft',
                        'GBP',
                        '%(line1)s-%(line2)s'
                    );

                    it('should extract the english translation text', function() {
                        expect(output.ContactGroup.name).toBe('');
                    });
                });
            });
        });
    });

    describe('When fields are missing from the source data', function() {
        var property = {
            'Common.GeoLocation': {
                'Common.Exact': false
            }
        };

        var output = buildPropertyObject(
            property,
            'en-GB',
            'sqft',
            'GBP',
            '%(line1)s-%(line2)s'
        );

        it('should populate all fields in the mapping', function() {
            expect(output.ContactGroup).not.toBe(null);
            expect(output.ContactGroup.contacts).not.toBe(null);
            expect(Array.isArray(output.ContactGroup.contacts)).toBe(true);
            expect(output.ContactGroup.contacts.length).toBe(0);
            expect(output.ContactGroup.website).toBe('');
        });
        it('should create an empty string for missing fields', function() {
            expect(output.StrapLine).toBe('');
        });

        it('should create an empty string for missing booleans', function() {
            expect(typeof output.GeoLocation.exact).toBe('boolean');
            expect(output.GeoLocation.exact).toBe(false);
        });
    });

    describe('When deprecated fields have valid alternative', function() {
        var property = {
            'Common.MaximumSize': [
                {
                    'Common.Units': 'sqft',
                    'Common.Area': 10
                }
            ],
            'Common.MinimumSize': [
                {
                    'Common.Units': 'sqft',
                    'Common.Area': 20
                }
            ],
            'Common.TotalSize': [
                {
                    'Common.Units': 'sqft',
                    'Common.Area': 30
                }
            ],
            'Common.Sizes': [
                {
                    'Common.SizeKind': 'MaximumSize',
                    'Common.Dimensions': [
                        {
                            'Common.DimensionsUnits': 'sqft',
                            'Common.Amount': 40
                        }
                    ]
                },
                {
                    'Common.SizeKind': 'MinimumSize',
                    'Common.Dimensions': [
                        {
                            'Common.DimensionsUnits': 'sqft',
                            'Common.Amount': 50
                        }
                    ]
                },
                {
                    'Common.SizeKind': 'TotalSize',
                    'Common.Dimensions': [
                        {
                            'Common.DimensionsUnits': 'sqft',
                            'Common.Amount': 60
                        }
                    ]
                }
            ],
            'Common.Coordinate': {
                lat: 1,
                lon: 0
            },
            'Common.GeoLocation': {
                'Common.Location': {
                    type: 'Point',
                    coordinates: [2, 1]
                }
            }
        };

        var output = buildPropertyObject(
            property,
            'en-GB',
            'sqft',
            'GBP',
            '%(line1)s-%(line2)s'
        );

        it('should backfill those values to support legacy code', function() {
            expect(output.Coordinates.lat).toBe(2);
            expect(output.Coordinates.lon).toBe(1);
            expect(output.MaximumSize.area).toBe(40);
            expect(output.MinimumSize.area).toBe(50);
            expect(output.TotalSize.area).toBe(60);
        });
    });
});
