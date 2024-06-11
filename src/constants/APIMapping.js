module.exports = {
    _resultProperties: {
        TotalProperties: 'DocumentCount',
        PropertyResults: 'Documents',
        PropertyResult: 'Document'
    },
    PropertyStatus: 'Common.Status',
    PropertyId: 'Common.PrimaryKey',
    ListingCount: 'Common.ListingCount',
    IsParent: 'Common.IsParent',
    Aspect: {
        _key: 'Common.Aspects',
        _expectedType: 'array'
    },
    LeaseType: 'Common.LeaseType',
    LeaseRateType: 'Common.LeaseRateType',
    LeaseInfo: {
        _expectedType: 'object',
        _key: 'Common.LeaseInfo',
        leaseStart: 'Common.LeaseContractStartDate',
        leaseEnd: 'Common.LeaseContractEndDate',
        nextRentReview: 'Common.LeaseRentNextReviewDate',
        rentReviewCycle: 'Common.LeaseRentReviewCycle',
        nextLeaseBreak: 'Common.LeaseContractBreakDate'
    },
    LeaseTypes: {
        _expectedType: 'array',
        _key: 'Common.LeaseTypes'
    },
    AvailableFrom: 'Common.AvailableFrom',
    Availability: {
        _expectedType: 'object',
        _key: 'Common.Availability',
        kind: 'Common.AvailabilityKind',
        date: 'Common.AvailabilityDate',
        months: 'Common.MonthsAfterLeaseOrSale',
        description: 'Common.AvailableOnDescription',
        availabilityDescription:{
            _expectedType: 'array',
            _key:'Common.AvailabilityDescription',
            cultureCode:'Common.CultureCode',
            text:'Common.Text'
        }
    },
    Walkthrough: 'Common.Walkthrough',
    Website: 'Common.Website',
    InternalParkingSpaces: 'Common.InternalParkingSpaces',
    ExternalParkingSpaces: 'Common.ExternalParkingSpaces',
    Photos: {
        _expectedType: 'array',
        _key: 'Common.Photos',
        caption: 'Common.ImageCaption',
        resources: {
            _expectedType: 'array',
            _key: 'Common.ImageResources',
            height: 'Common.Image.Height',
            width: 'Common.Image.Width',
            uri: 'Common.Resource.Uri',
            breakpoint: 'Common.Breakpoint'
        }
    },
    BusinessRatesInfo: {
        _expectedType: 'object',
        _key: 'UnitedKingdom.BusinessRatesInfo',
        rateInThePound: 'UnitedKingdom.RateInThePound',
        rateableValuePounds: 'UnitedKingdom.RateableValuePounds'
    },
    ActualAddress: {
        _expectedType: 'object',
        _key: 'Common.ActualAddress',
        line1: 'Common.Line1',
        line2: 'Common.Line2',
        line3: 'Common.Line3',
        line4: 'Common.Line4',
        locality: 'Common.Locallity',
        region: 'Common.Region',
        country: 'Common.Country',
        postcode: 'Common.PostCode',
        zone: 'Common.Zoning',
        addressType: 'Common.AddressType',
        postalAddresses: {
            _expectedType: 'array',
            _key: 'Common.PostalAddresses',
            language: 'Common.Language',
            line1: 'Common.Line1',
            line2: 'Common.Line2',
            line3: 'Common.Line3',
            line4: 'Common.Line4',
            locality: 'Common.Locallity',
            region: 'Common.Region',
            zone: 'Common.Zoning',
            addressType: 'Common.AddressType',
        }
    },
    Charges: {
        _expectedType: 'array',
        _key: 'Common.Charges',
        currencyCode: 'Common.CurrencyCode',
        chargeType: 'Common.ChargeKind',
        interval: 'Common.Interval',
        amount: 'Common.Amount',
        unit: 'Common.PerUnit',
        year: 'Common.Year',
        taxModifier: 'Common.TaxModifer',
        chargeModifier: 'Common.ChargeModifer',
        exact: 'Common.Exact',
        paidBy: 'Common.PaidBy',
        amountKind: 'Common.AmountKind',
        dependentCharge: 'Common.DependentCharge',
        OnApplication: 'Common.OnApplication'
    },
    NumberOfBedrooms: 'Common.NumberOfBedrooms',
    LoadingDocks: 'Industrial.LoadingDocks',
    LoadingDocksUnit: 'Industrial.LoadingDocksUnit',
    LoadingDoors: 'Industrial.LoadingDoors',
    DriveInDoors: 'Industrial.DriveInDoors',
    Operator: 'Common.BuildingOperator',      
    StrapLine: {
        _expectedType: 'array',
        _key: 'Common.Strapline',
        content: 'Common.Text',
        culture: 'Common.CultureCode',
        _collapseArray: true,
        defaultToPrevious: false
    },
    LocationDescription: {
        _expectedType: 'array',
        _key: 'Common.LocationDescription',
        content: 'Common.Text',
        culture: 'Common.CultureCode',
        _collapseArray: true,
        defaultToPrevious: false
    },
    Comments: {
        _expectedType: 'object',
        _key: 'Common.Comments',
        content: 'Common.Text',
        culture: 'Common.CultureCode',
        _collapseArray: true
    },
    LongDescription: {
        _expectedType: 'array',
        _key: 'Common.LongDescription',
        content: 'Common.Text',
        culture: 'Common.CultureCode',
        _collapseArray: true,
        defaultToPrevious: false
    },
    VATPayable: 'UnitedKingdom.VATPayable',
    UseClass: 'Canada.UseClass',
    SaleAuthority: {
        _expectedType: 'string',
        _key: 'Common.SaleAuthority',
        type: 'Common.SaleAuthority'
    },
    Highlights: {
        _expectedType: 'array',
        _key: 'Common.Highlights',
        highlight: {
            _expectedType: 'object',
            _key: 'Common.Highlight',
            content: 'Common.Text',
            culture: 'Common.CultureCode',
            _collapseArray: true,
            defaultToPrevious: false
        }
    },
    ContactGroup: {
        _expectedType: 'object',
        _key: 'Common.ContactGroup',
        avatar: 'Common.Avatar',
        name: {
            _key: 'Common.GroupName',
            culture: 'Common.CultureCode',
            content: 'Common.Text',
            _collapseArray: true
        },
        address: {
            _expectedType: 'object',
            _key: 'Common.Address',
            line1: 'Common.Line1',
            line2: 'Common.Line2',
            line3: 'Common.Line3',
            line4: 'Common.Line4',
            locality: 'Common.Locallity',
            region: 'Common.Region',
            country: 'Common.Country',
            postcode: 'Common.PostCode',
            postalAddresses: {
                _expectedType: 'array',
                _key: 'Common.PostalAddresses',
                language: 'Common.Language',
                line1: 'Common.Line1',
                line2: 'Common.Line2',
                line3: 'Common.Line3',
                line4: 'Common.Line4',
                locality: 'Common.Locallity',
                region: 'Common.Region'         
            }
        },
        website: 'Common.Website',
        contacts: {
            _expectedType: 'array',
            _key: 'Common.Contacts',
            avatar: 'Common.Avatar',
            email: 'Common.EmailAddress',
            name: 'Common.AgentName',
            telephone: 'Common.TelephoneNumber',
            agenttitle: {
                _expectedType: 'object',
                _key: 'Common.AgentTitle',
                content: 'Common.Text',
                culture: 'Common.CultureCode',
                _collapseArray: true
            },
            license: "Common.LicenseNumber"
        },
        arrangeViewingContacts: {
            _expectedType: 'array',
            _key: 'Common.ArrangeViewingContacts',
            email: 'Common.EmailAddress',
            name: 'Common.AgentName',
            telephone: 'Common.TelephoneNumber'
        }
    },
    Agency: {
        _expectedType: 'object',
        _key: 'Common.Agency',
        address: {
            _expectedType: 'object',
            _key: 'Common.AgentAddress',
            line1: 'Common.Line1',
            line2: 'Common.Line2',
            line3: 'Common.Line3',
            line4: 'Common.Line3',
            locality: 'Common.Locallity',
            region: 'Common.Region',
            country: 'Common.Country',
            postcode: 'Common.PostCode'
        },
        telephone: 'Common.TelephoneNumber',
        email: 'Common.EmailAddress',
        name: 'Common.AgencyName'
    },
    Agents: {
        _expectedType: 'array',
        _key: 'Common.Agents',
        email: 'Common.EmailAddress',
        name: 'Common.AgentName',
        website: 'Common.Website',
        telephone: 'Common.TelephoneNumber',
        office: 'Common.AgentOffice'
    },
    Brochures: {
        _expectedType: 'array',
        _key: 'Common.Brochures',
        uri: 'Common.Uri',
        brochureName: 'Common.BrochureName',
        culture: 'Common.CultureCode',
        _sliceArray: true
    },
    VideoLinks: {
        _expectedType: 'array',
        _key: 'Common.VideoLinks',
        uri: 'Common.Link',
        videoName: 'Common.VideoDescription',
        culture: 'Common.CultureCode',
        _sliceArray: true
    },
    //legacy
    EPC: {
        _expectedType: 'array',
        _key: 'Common.EnergyPerformanceInformation',
        uri: 'Common.Uri',
        culture: 'Common.CultureCode',
        _collapseArray: true
    },
    //newer version
    EnergyPerformanceData: {
        _expectedType: 'object',
        _key: 'Common.EnergyPerformanceData',
        ukuri: 'UnitedKingdom.EnergyPerformanceCertificateUri',
        uri: 'Germany.EnergyPerformanceCertificateUri',
        type: 'Germany.EnergyPerformanceCertificateType',
        expires: 'Germany.EnergyPerformanceCertificateExpires',
        year: 'Germany.ConstructionYear',
        MajorEnergySources: 'Germany.MajorEnergySources',
        CertificateType: 'Common.CertificateType',
        ExternalRatings: {
            _expectedType: 'array',
            _key: 'Common.ExternalRatings',
            ratingType: 'Common.RatingType',
            ratingLevel: 'Common.RatingLevel',
        },
        heatEnergy: {
            _expectedType: 'object',
            _key: 'Germany.HeatEnergy',
            energyUnits: 'Common.EnergyUnits',
            amount: 'Common.Amount',
            interval: 'Common.Interval',
            perUnit: 'Common.PerUnit',
            _collapseArray: true,
            _allowFallback: true
        },
        electricalEnergy: {
            _expectedType: 'object',
            _key: 'Germany.ElectricalEnergy',
            energyUnits: 'Common.EnergyUnits',
            amount: 'Common.Amount',
            interval: 'Common.Interval',
            perUnit: 'Common.PerUnit',
            _collapseArray: true,
            _allowFallback: true
        },
        totalEnergy: {
            _expectedType: 'object',
            _key: 'Germany.TotalEnergy',
            energyUnits: 'Common.EnergyUnits',
            amount: 'Common.Amount',
            interval: 'Common.Interval',
            perUnit: 'Common.PerUnit',
            _collapseArray: true,
            _allowFallback: true
        }
    },
    FlooredURL: 'Common.FlooredURL',
    FloorPlans: {
        _expectedType: 'array',
        _key: 'Common.FloorPlans',
        caption: 'Common.ImageCaption',
        resources: {
            _expectedType: 'array',
            _key: 'Common.ImageResources',
            height: 'Common.Image.Height',
            width: 'Common.Image.Width',
            uri: 'Common.Resource.Uri'
        }
    },
    RelatedListingOffice: 'Common.RelatedListingOffice',
    Sizes: {
        _expectedType: 'array',
        _key: 'Common.Sizes',
        sizeKind: 'Common.SizeKind',
        dimensions: {
            _expectedType: 'object',
            _key: 'Common.Dimensions',
            area: 'Common.Amount',
            units: 'Common.DimensionsUnits',
            _collapseArray: true
        }
    },
    YearBuilt: {
        _key: 'Common.YearBuilt'
    },
    NumberOfStoreys: { _key: 'Common.NumberOfStoreys' },
    NumberOfLots: { _key: 'Common.NumberOfLots' },
    // These are not set properly! These are set for Legacy V1.
    // To see how properties are presently set (Sept. 2019) Visit
    // ../utils/buildPropertyObject/postprocessors/Sizes.js
    MinimumSize: {
        _expectedType: 'object',
        _key: 'Common.MinimumSize',
        area: 'Common.Area',
        units: 'Common.Units',
        _collapseArray: true
    },
    MaximumSize: {
        _expectedType: 'object',
        _key: 'Common.MaximumSize',
        area: 'Common.Area',
        units: 'Common.Units',
        _collapseArray: true
    },
    TotalSize: {
        _expectedType: 'object',
        _key: 'Common.TotalSize',
        area: 'Common.Area',
        units: 'Common.Units',
        _collapseArray: true
    },
    LandSize: {
        _expectedType: 'object',
        _key: 'Common.LandSize',
        area: 'Common.Area',
        units: 'Common.Units',
        _collapseArray: true
    },
    LotDepthSize: {
        _expectedType: 'object',
        _key: 'Common.LotDepthSize',
        area: 'Common.Area',
        units: 'Common.Units',
        _collapseArray: true
    },
    LotFrontSize: {
        _expectedType: 'object',
        _key: 'Common.LotFrontSize',
        area: 'Common.Area',
        units: 'Common.Units',
        _collapseArray: true
    },
    OfficeSize: {
        _expectedType: 'object',
        _key: 'Common.OfficeSize',
        area: 'Common.Area',
        units: 'Common.Units',
        _collapseArray: true
    },
    Other: {
        _expectedType: 'object',
        _key: 'Common.Other',
        area: 'Common.Area',
        units: 'Common.Units',
        _collapseArray: true
    },
    RetailSize: {
        _expectedType: 'object',
        _key: 'Common.RetailSize',
        area: 'Common.Area',
        units: 'Common.Units',
        _collapseArray: true
    },
    TotalBuildingSize: {
        _expectedType: 'object',
        _key: 'Common.TotalBuildingSize',
        area: 'Common.Area',
        units: 'Common.Units',
        _collapseArray: true
    },
    UnitSize: {
        _expectedType: 'object',
        _key: 'Common.UnitSize',
        area: 'Common.Area',
        units: 'Common.Units',
        _collapseArray: true
    },
    WarehouseSize: {
        _expectedType: 'object',
        _key: 'Common.WarehouseSize',
        area: 'Common.Area',
        units: 'Common.Units',
        _collapseArray: true
    }, 
    FloorsAndUnits: {
        _expectedType: 'array',
        _key: 'Common.FloorsAndUnits',
        subdivisionName: {
            _expectedType: 'object',
            _key: 'Common.SubdivisionName',
            content: 'Common.Text',
            culture: 'Common.CultureCode',
            displayName: 'Common.UnitDisplayName',
            _collapseArray: true
        },
        floorPlans:{
            _expectedType: 'array',
            _key:'Common.UnitFloorPlans',
            imageCaption:'Common.ImageCaption',
            addWatermark:'Common.AddWatermark',
            imageResources:{
                _expectedType: 'array',
                _key:'Common.ImageResources',
                height:'Common.Image.Height',
                width:'Common.Image.Width',
                uri:'Common.Resource.Uri',
            },
        },
        brochure:{
            _expectedType: 'object',
            _key: 'Common.UnitBrochures',
            content: 'Common.Uri',
            brochureName: 'Common.BrochureName',
            culture: 'Common.CultureCode',
            _collapseArray: true
        },
        spaceDescription: {
            _expectedType: 'object',
            _key: 'Common.SpaceDescription',
            content: 'Common.Text',
            culture: 'Common.CultureCode',
            _collapseArray: true
        },
        unitSize: {
            _expectedType: 'object',
            _key: 'Common.Areas',
            units: 'Common.Units',
            area: 'Common.Area',
            minArea: 'Common.MinArea',
            maxArea: 'Common.MaxArea',
            _collapseArray: true,
            _allowFallback: true
        },
        unitCharges: {
            _expectedType: 'array',
            _key: 'Common.Charges',
            currencyCode: 'Common.CurrencyCode',
            chargeType: 'Common.ChargeKind',
            interval: 'Common.Interval',
            amount: 'Common.Amount',
            unit: 'Common.PerUnit',
            year: 'Common.Year',
            taxModifier: 'Common.TaxModifer',
            chargeModifier: 'Common.ChargeModifer',
            exact: 'Common.Exact',
            paidBy: 'Common.PaidBy',
            amountKind: 'Common.AmountKind',
            dependentCharge: 'Common.DependentCharge'
        },
        unitPhotos: {
            _expectedType: 'array',
            _key: 'Common.UnitPhotos',
            caption: 'Common.ImageCaption',
            resources: {
                _expectedType: 'array',
                _key: 'Common.ImageResources',
                height: 'Common.Image.Height',
                width: 'Common.Image.Width',
                uri: 'Common.Resource.Uri',
                sourceUri:'Source.Uri',
                breakpoint: 'Common.Breakpoint'
            }
        },
        videoLinks: {
            _expectedType: 'array',
            _key: 'Common.VideoLinks',
            uri: 'Common.Link',
            videoName: 'Common.VideoDescription',
            culture: 'Common.CultureCode',
        },
        sizes: {
            _expectedType: 'array',
            _key: 'Common.Sizes',
            sizeKind: 'Common.SizeKind',
            dimensions: {
                _expectedType: 'object',
                _key: 'Common.Dimensions',
                area: 'Common.Amount',
                units: 'Common.DimensionsUnits',
                _collapseArray: true
            }
        },
        unitWalkthrough:'Common.UnitWalkthrough',
        availableFrom: 'Common.AvailableFrom',
        availability: {
            _expectedType: 'object',
            _key: 'Common.Availability',
            kind: 'Common.AvailabilityKind',
            date: 'Common.AvailabilityDate',
            months: 'Common.MonthsAfterLeaseOrSale'
        },
        status: 'Common.Unit.Status',
        use: 'Common.Unit.Use',
        leaseType:'Common.LeaseTypes',
        vacancy: 'Common.Vacancy',
        approx: 'Common.ApproxArea'
    },
    Coordinates: {
        _expectedType: 'object',
        _key: 'Common.Coordinate',
        lat: 'lat',
        lon: 'lon'
    },
    GeoLocation: {
        _expectedType: 'object',
        _key: 'Common.GeoLocation',
        location: {
            _expectedType: 'object',
            _key: 'Common.Location',
            type: 'type',
            coordinates: 'coordinates'
        },
        exact: {
            _expectedType: 'boolean',
            _backfillValue: true,
            _key: 'Common.Exact'
        }
    },
    TransportationsType: {
        _expectedType: 'array',
        _key: 'Common.TransportationTypes',
        type: 'Common.Type',
        places: {
            _expectedType: 'array',
            _key: 'Common.Places',
            name: {
                _expectedType: 'array',
                _key: 'Common.Name',
                text: 'Common.Text',
                cultureCode: 'Common.CultureCode'
            },
            distances: {
                _expectedType: 'array',
                _key: 'Common.Distances',
                units: 'Common.DistanceUnits',
                distanceAmount: 'Common.Amount',
                _backfillValue: true
            },
            duration: {
                _expectedType: 'array',
                _key: 'Common.Duration',
                unitTime: 'Common.DistanceUnits',
                amount: 'Common.Amount',
                travelMode: 'Common.TravelMode',
                _backfillValue: true
            }
        }
    },
    PointsOfInterests: {
        _expectedType: 'array',
        _key: 'Common.PointsOfInterests',
        interestKind: 'Common.InterestKind',
        places: {
            _expectedType: 'array',
            _key: 'Common.Places',
            name: {
                _expectedType: 'array',
                _key: 'Common.Name',
                text: 'Common.Text',
                cultureCode: 'Common.CultureCode'
            },
            type: {
                _expectedType: 'array',
                _key: 'Common.Type',
                text: 'Common.Text',
                cultureCode: 'Common.CultureCode'
            },
            distances: {
                _expectedType: 'array',
                _key: 'Common.Distances',
                units: 'Common.DistanceUnits',
                distanceAmount: 'Common.Amount',
                _backfillValue: true
            },
            duration: {
                _expectedType: 'array',
                _key: 'Common.Duration',
                unitTime: 'Common.DistanceUnits',
                amount: 'Common.Amount',
                travelMode: 'Common.TravelMode',
                _backfillValue: true
            }
        }
    },
    PointsOfInterest: {
        _expectedType: 'array',
        _key: 'Common.PointsOfInterest',
        interestKind: 'Common.InterestKind',
        name: {
            _expectedType: 'object',
            _key: 'Common.NamesOfPlaces',
            _collapseArray: true,
            content: 'Common.Text',
            culture: 'Common.CultureCode'
        },
        distance: {
            _expectedType: 'array',
            _key: 'Common.Distances',
            units: 'Common.DistanceUnits',
            amount: 'Common.Amount'
        }
    },
    LastUpdated: 'Common.LastUpdated',
    PrimaryImage: {
        _expectedType: 'object',
        _key: 'Dynamic.PrimaryImage',
        caption: 'Common.ImageCaption',
        resources: {
            _expectedType: 'array',
            _key: 'Common.ImageResources',
            height: 'Common.Image.Height',
            width: 'Common.Image.Width',
            uri: 'Common.Resource.Uri',
            breakpoint: 'Common.Breakpoint'
        }
    },
    ParentPropertyId: 'Common.ParentProperty',
    UsageType: 'Common.UsageType',
    PropertySubType: 'Common.PropertySubType',
    Parking: {
        _expectedType: 'object',
        _key: 'Common.Parking',
        ratio: 'Common.Ratio',
        ratioPer: 'Common.RatioPer',
        ratioPerUnit: 'Common.RatioPerUnit',
        details: {
            _expectedType: 'array',
            _key: 'Common.ParkingDetails',
            parkingType: 'Common.ParkingType',
            parkingSpace: 'Common.ParkingSpace',
            parkingCharge: {
                _expectedType: 'object',
                _key: 'Common.ParkingCharge',
                amount: 'Common.Amount',
                interval: 'Common.Interval',
                currencyCode: 'Common.CurrencyCode'
            }
        }
    },
    ListingOrder: 'Common.ListingOrder',
    Links: {
        _expectedType: 'array',
        _key: 'Common.Links',
        url: 'Common.Url',
        urlType: 'Common.UrlType'
    },
    HomeSite: 'Common.HomeSite',
};
