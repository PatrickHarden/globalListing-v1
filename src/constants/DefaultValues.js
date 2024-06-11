var scriptPath = require('../utils/getScriptPath')();
var APIMapping = require('./APIMapping');

module.exports = {
    dateFormat: 'MMMM YYYY',
    pdfDateFormat: 'DD MMMM YYYY',
    defaultPropertiesMap: [
        APIMapping.PrimaryImage._key,
        APIMapping.ActualAddress._key,
        APIMapping.Charges._key,
        APIMapping.NumberOfBedrooms,
        APIMapping.PropertyId,
        APIMapping.UsageType,
        APIMapping.Coordinates._key,
        APIMapping.Aspect._key,
        APIMapping.ListingCount,
        APIMapping.IsParent,
        APIMapping.HomeSite,
        APIMapping.Agents._key
    ],
    uom: 'sqft',
    currency: 'GBP',
    culture: 'en-GB',
    searchType: 'isSale',
    cbreSiteType: 'residential',
    cbreSiteTheme: 'commercialv2',
    noRadius: '4000',
    backToSearchRadius: '10',
    searchBiasRadius: 0,
    page: 1,
    pageSize: 10,
    propertyListingPlaceholder: {
        src: scriptPath + '/images/propertyListingPlaceholder_small.png',
        alt: 'No image available'
    },
    propertyListingLoader: {
        src: scriptPath + '/images/transparent.png',
        alt: 'Loading Image'
    },
    slideCount: 1,
    radiusType: 'Miles',
    searchMode: 'pin',
    carouselAspectRatio: '1:1',
    unitsAliases: {
        sqft: ['ft', 'yd', 'acre'],
        sqm: ['m', 'hectare']
    },
    distanceConversions: {
        Miles: 1609.3,
        Kilometers: 1000
    },
    localPropertiesRadius: 1,
    mapClustering: {
        gridSize: 60,
        maxZoom: 50,
        minimumClusterSize: 2
    },
    mapZoom: {
        listMapMaxZoom: 18,
        detailsMapMaxZoom: 18,
        detailsMapInitialZoom: 15
    },
    pdf: {
        limitPropertyImages: 4,
        limitDisplayedProperties: 10,
        mapSize: '370x180',
        maptype: 'roadmap',
        markerColour: 'gray',
        staticMapApi: 'https://cbre-pdfgenerator.azurewebsites.net/staticmaps',
        renderMiddleware: '',
        pdfDownloadApi: '//cbre-pdfgenerator.azurewebsites.net/pdf/download'
    },
    staticMap: {
        mapZoom: 12,
        mapSize: '1300x425',
        maptype: 'roadmap',
        markerColour: 'gray',
        markerIconURL: scriptPath + '/images/map-pin-dark-green.png',
        staticMapApi: 'https://www-pdf-gen-cbre-eu-west.azurewebsites.net/staticmaps'        
    },
    limitListMapResults: 100,
    imageOrientation: 'fill',
    urlPropertyAddressFormat: '%(country)s-%(postcode)s',
    icons: {
        mapMarkerIcon: {
            textColor: '#00a657',
            textSize: 10,
            height: 37,
            width: 26,
            url: scriptPath + '/images/map-marker.png',
            svg:
                '<image id="map-marker" x="0" y="0" width="26" height="37" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAlCAYAAABcZvm2AAAB30lEQVRYw72Wv0vDQBTH+yf0T+if4J/QoS2OcTO1Q0F3Hbq5VJzEoVtxi3RpHGoHBXHQ4iCigkEQQahGJD/U5Rb3815qQpo2l3eXqw++hCTv3ifv3Y+XQgFhjX6lvGZWtur9WjsU3MPzQl5b7S+XdLPWqZtVwkQ5IuAH/sKQ4Kv5weeLjUMBmsNyUTerIynIn2A8xOFCmKOVBxKTlQpjLw1FkFDGDEQ/qmmYwRuDFbp72QquqDKyuMlsbN6Ag9t9+v3zSeMG9/A8A2ajs7l3rinPnr8euRlGWfHm5uzlmGIM/DLnKq1smycNKmLgzy1f2pf0HrpCoMFTLzUrLggGitjV23kqKNhTqkC8eQrOQVWlA/+s0lkLXgzWZB9NWsHCljfEj/oOb8PCJMsugmh+sAcqHDXvZDwFgHvEEWTMdFNEJxUVmdt1g38ChSCIl97C1fUkI7Od523l0XLG/DfkaOkW939BURnFIRIweYgALD8EAVMHsW276HmetnexPbWhW6fr1BrfNeF9LoDv+yUGGDLRUJ3RTgR5/RjT2Lsh+AtDIAMmEoeEOrzpJiGhwF8TBc2FIEREQVRWQiX8t4wcx1mSgBEYJ7XqXNc1MBDwk1p1yX3EgpRZsHZS8By7j34BavE6yvtSpUgAAAAASUVORK5CYII="></image>',
            anchorText: [-20, 0],
            offset: [0, -5],
            backgroundPosition: '0 -14px'
        },
        mapMarkerIconInactive: {
            textColor: '#00a657',
            textSize: 10,
            height: 37,
            width: 26,
            url: scriptPath + '/images/map-marker_inactive.png',
            svg:
                '<image id="map-marker_inactive" x="0" y="0" width="26" height="37" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAlCAYAAABcZvm2AAAB80lEQVRYw72WMUvDQBTHO3ft7Nq5s2ubbF0cKm3FgojgJkgnHRxE0CVb8Tbp0kaogwrioOigQx3qoINQ6mDa2sXFDxDvBe9o2tzL3eU08Cfk8t775e7evZdUSuJabuez1ZaVL7t2kQmeYTyV9Fo9y2fKbqFUbttOpV0gIsF7sAN7ZQh8MRZcCKV+UoCNi2K66lrbOhAm8Ic4KKTi2rtJIFw0jhBWde2aEQifmV2bg1ROrZyM83pniezf1oO7FJDGDW9+yzrAHI67R2Ty/Ul83+eCZxhHk4PGlZ7Nk/cQAszqdfKMz5DNCtubq7cOCmECu9i9Ei3b1vmKFIQJ7NHlE31Js9dQAnVemsJZoSBwVAHdD66FoOBMmQJh+xTUQVNLB/b40gnKjqlkgPi/lbpQ+sv0hvi872AHFjZZNwn4/sgWVCg171/9EACe40rQXGENumlMJ1VugjReZNeFfwCjbYLGEzY/Uz0pshfNw5K1cp7OMv8N2i0da+HGllEHogxLApGGmYDEwkxCRqNR2vO83OHNTuhA1y/XSK/fXYT3iQA0eGY8Hm/SQITJudvjkMFHn4+DHdjrQHI0gDMNYTp5bIQgU3LAT3W5IiESclRBRFdKS/hvMxoOhwsaMAf8dLOuJgMBO62sizhHWfq1xVnBuOw5+gETgUINCDL4xQAAAABJRU5ErkJggg=="></image>',
            anchorText: [-20, 0],
            offset: [0, -5],
            backgroundPosition: '0 -14px'
        },
        mapClusterIcons: [
            {
                textColor: '#00a657',
                textSize: 10,
                height: 49,
                width: 36,
                url: scriptPath + '/images/map-clusterIcon-density1.png',
                svg:
                    '<image id="map-clusterIcon-density1" x="0" y="0" width="36" height="49" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAxCAYAAACyGwuwAAAC4ElEQVRYw+2Xz2sTURDH8ycEmmqPPYjnevaSSv+ARdBdC0KkHtsSvNSKSNSL1Gpv/jgFFLsL/ijooQ1oQ2kKqaJBbIUe6mLND6qHVFAPXsaZTZNsk+57b3ff24o4MKe8vPfZme+bNxOLBbB4VosnTCOJnun0ntnTWu+jUwMx1dZnGv2JWT2dsPRSwtSB5z2mbqNnpcNRNGhjEQiG5ymioWF6TSOFEamHhGm7pc/QBwaCkRAVL6gSpd8XTCPECmDaUHVhbSmLzD5Q3PQ1rm4EMK70eQsYQyi6kfbqKliflmDrx1dw287vnzBffgNjxTs+wIxMYN0cez4Khe11EDGCPbs8LQTVJfJG1WX/aTB30YmAX5v68FikiGZ9RWdwIRhM00YFUtgSuPMkcBav1T9DWEsuTLCh8FlqV2PGwsvvHoAMI+1xbtycUN350nGTlEUJ6xJXP7SBTOMJ3LltrMdzrHhXKtAKL23UEbAW3Fx78h+ImbLxVbkpKwhGyFPUJ3KTkYraKY7UxXktwBoV2bWnHrxRh3BKYFFPS9LRyvZHbnvrbspsr4VHno5glL6FBtIWrzGB9nSQvMaMXvowdn9j3l+j5gx+nOlifPUefA/w4lv2Er/9QNl0N2g0BLJCigKnW7e+I/byE3yqcFtoZvPuqQWmUgI7V5iBXOUtHvqrC4SAr5QewtFn5521vEafORI5fbXgYEiHHbbOOAefXLwOQ7lL0GcNwyHLEO+nmz0Qd1qNYOLoalsPdBxCafgeqVWO0n/PfB8GRjqUDBhpUDJhQkOpgAkMpRLGN1QUMMJQUcJwoQ4CxrbteLVa1YZf3tjz7h1/cQGKm+/TtVqtPxIQOqhSqWQRBpo+kr/VgtnY2gTXb3lcn1QGUy6XB/CQuhum6VOvzU6YliNUSgkQffF+B4q4khQGhdkFSv77EdrVkB0AJqX0uuMty3iJu8Pn6CMiq0WkCzw0TYBup/pE4EH3/QNbfY6WwcNurwAAAABJRU5ErkJggg=="></image>',
                anchorText: [-20, 0],
                offset: [0, -5],
                backgroundPosition: '0 -14px'
            },
            {
                textColor: '#006a4d',
                textSize: 10,
                height: 61,
                width: 46,
                url: scriptPath + '/images/map-clusterIcon-density2.png',
                svg:
                    '<image id="map-clusterIcon-density2" x="0" y="0" width="46" height="61" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAA9CAYAAADS+1sCAAAC9ElEQVRo3u2ZP2gUQRTGr9cL12txvU1qG1MLd9nSNJLCIlkDnloIgpDGqNVpYREsTiRgYXEQsYwpLCI2J9pZuIj3B0FYC7Ed59vbPfY2uzszO39XfPCa42B/8+abb2beNBoK44zvrZ7d8dbysuFSRKDb3X5zu3Pc9LuEI4Omvz6g//eMw7Z6Xmvleqc3h+CCLcoQg2hteW3t0Ct+d3f+QSngnNQ0AEiCQo/UAy/PAGZSGXTT72xqBs5Wfwg5SkLThWQUep6Y3crwstAX926Yh48sTuAjl/t3ydO3h+TT968kL779/EFef3xPtl48Judvb+iBF9E0QAAlEr/+/CZ7b14KDGB9wPZoakk8dgcZFFVXZAAb+/f5Ks9yG54dEB/DR1UFJMZjlYWSwXmCRxo64uDkqLpkWNWGPFRWOhvQPQv+1O7KqjYWkugirBJwpzIOuJ2QZ6MaJgLFYWk9A17sJKi2TolkA+uoFD45ErNkcufVM2IyYLNccomPqoV/lPXrKnHh3rXS3TTR97BMJjYCs1xWTKYNYpXbCNamFNmiS/pO4t2Xz+U6x+XbBRv8D14LqZRdgl1dnLi819cO4+ZObTYg2PeiZ1KnLR87ffqQFdTlkBXpO9Nac/5YuzinpBuZdbhIoAMh3ABy4OoWFLaPWa0Ju5flnGovtM6wRmvticQCGT1wZjsZPott2VBDKOTqnce+HrrSghPqmYv2xHmantCxaNMTxxHhNrNox/af6pHLPKtIvQlFL2z6335OQS9t6zLwAu+YbkAblo16aAPw+qA1wuuH1gBvDlohvHloBfD2oCXg7UNXgHcHWgDePWgOeHehEePxePXSw5tLZ5tzt66QR4cHPedggyBoTSaT3el0GtAkyKv7DxbQR6MPJP49pP8bzGazthPQFGiUAKdz5/mTNHQ6Qwq/aRWcQhznQXNkiEHbBCdVk1Z9zSZ4IAHetuoimPYK4H3rCxSVE9A6ZshzyhbjAfRQzXggSQ5hl5gdld/7C2TRuTfY6zksAAAAAElFTkSuQmCC"></image>',
                anchorText: [-30, 0],
                offset: [0, -6],
                backgroundPosition: '0 -22px'
            },
            {
                textColor: '#004b35',
                textSize: 10,
                height: 73,
                width: 56,
                url: scriptPath + '/images/map-clusterIcon-density3.png',
                svg:
                    '<image id="map-clusterIcon-density3" x="0" y="0" width="56" height="73" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAABJCAYAAABo+OV6AAADuElEQVR42u2bPWhTURTHMyZx6ejY0bEIeekYcBBMggHBLh2CIOgiOhTqZIXi2A5O6tBB0DEojkKkiyCUh06KynPIB04Rcb/e/7MvJGnee+fedz8lBw60oS33d8+555x77mmppFHKnc31cmuzAa22gr1Ey+1aF5+du1LbKPkkWDAAKq1av9IKmICGlXbtsNoOOmudjTWnoGClGKoZRIJQaTqpNutHsLB9ML4QRVApWusbB4ULwZ30gi0B5Ruq32p8NxW6orDiKGiD+xc87IAtWlN5INJ/1oQ1VJJi4vMmHvJN6aQwZBHLXbhxlV3f32H7L56x1+/fseNPJ3P6+NVLtvP0gNXvbNuBlIE7v3UpXvTH71+YiPz4OYqBsSky7ip8JlFKiYLBUr/+/GZF5fnbNzKgPaEEDtNT//jl+7diC6gWbJgQZLN+lwQoElSwCJ2CswrvoJ7H3GJAxDXhSiYE51kAMttVqVWKKTgZyNTalWq9m4cPmQ2Bu1IrHWnrIWfZFGrgOXMW4yKa8IvYRdtCSiH8tiOc1G255rI8mZ8ygkjYPXXkOp1WnJZw+IKSzF0SlHXkuyMleppOC5TalRxNKe0Hl9wzEcItZEIqzeDvLgpuLXmGOQXkPUmPzp/IOYyrmrwfwk65KJTKhgSo+8awAlwB5gNmBhk0jjwHzE4TrkZRys2C3LF2UVD8kwpuvMnlAYq2AV0ouHFDmule+5ULseG554/X2DOdtKDnU7lGKdPmmsGUGwXa7y4ImsuEBlRvST80u9lrux8jEj2XdtYo0RQFru17YK71FtsV809l2VbEH7d5N0ROFgouMlaEq6p4ZNHTMkzpic5ZkdCAMt1hI3XSsrraMj1SQJqwJBXuTC9UxeMn3FXnmaTkuySwCD2CUl01CTyqoysqFZGnbalhIUq/dNGaRYsBeENuEa1ydkb0KTsp60Te6QGFc0ZJAYWerlPfDAuObWHhsArCfKLYAHwuOXQgP3zg0yDQ/zztNNE2SOsAZKh9StgiZGhsGtgCZGh81NkgZGhtjtsAZGh9SF0jZOjMBL4GyNC5fy9QCOkenEJId+EUQLoPVwDSHzgJSP/gBCD9hSNA+g8HGY/HjWsP7s01lC/e3mLHJx+6URT5CYiFD4fDvdFoNOHKoNuPdqdwn799ZcnnXHuDwcCff5TEYvmioxmAqe4+OViEmyq3dNcLQL7Y/jIAinLIdR8AWQHAxsqCjpzBiQRc17coekSE63vhmmmgHKCDlHEKDPft4XtYzIRL/gVNafw1HLToNwAAAABJRU5ErkJggg=="></image>',
                anchorText: [-38, 0],
                offset: [0, -7],
                backgroundPosition: '0 -30px'
            }
        ],
        mapGroupIcons: [
            {
                textColor: '#665938',
                textSize: 10,
                height: 49,
                width: 36,
                url: scriptPath + '/images/map-groupIcon-density1.png',
                svg:
                    '<image id="map-groupIcon-density1" x="0" y="0" width="36" height="49" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAxCAYAAACyGwuwAAACfklEQVRYw9WXvUoDQRSF8wg+go9gmaRKYy9WJops4U/AQkVBtFHQxkKjlSJCxEoFtRCxkmBjI7oKIqjoCuYHRNhCtB3nSNbsJtmdu5uZQS+cwrhkvtw5c/dMLBaxsj3x9qF0oiubSc41qC+eMoxUW0x1DWaSHcPpRG44k7C4GEHmDyCHVwFSIEL4KJmXAlbtCJMke6g3MRYJBB5AyyXCeLoVymM/W8R/jRqYmr9IUGo7UyfuS4pnClpgalA5/9nCjyj1i7bW59n1xRn7+vxg7np/K7Pzs2O2ND9ChsLcajroKL7BQliUUvd3V2xmtJvkp8at4s6ndCVsoYML0/3iLmXiRr2RbdkwIaFMl3fiRtDDaHurhW0eH+gM7pIzyfkfh0EPwgsy6mh/MxDod4oHvSxldMfdJcG2HTpAvg/tba8wmSXwkhnDDAgCwkyRWfiBQesJgWT5h+qj/weE14PWLdNtasE7znSATB3HHhNbFNxIMVXbYOS3GHdC9H0Qs0NGdwSvDjtUMGvVS6J8hCzmzUOC0wadnuxEgkFSEN1GmuZr0UsWWlueakiJfvX68kDMQnXdCZsa4QVsIRZsVphdhK74p0Vvrg7ORn6mh0eIcdUjHCjxzYMQZ2XIE1vFUKrvZtUh+Feu0n/ofh8RRg1UizByoSTByIGSDNMalCKYaFCKYcJBaYKhQWmGQVUqlfbbm8ux2cm0B2Z1ccIul8tdlmW16QJJ8QULXAx6fnpkDtRaboY5n0OlUikPcJUwhntBN9TB7gZr9j8uu1gsdkiHwRb4LEiRpWqrogIxVR2yIwIVtHpIIDUech93nB4KCFdO2/HHQvAVh5urFz6P+r3fAMhF2cP1xbUAAAAASUVORK5CYII="></image>',
                svgColor: '#22A65A',
                offset: [0, -5],
                anchorText: [19, 19]
            },
            {
                textColor: '#665938',
                textSize: 10,
                height: 61,
                width: 46,
                url: scriptPath + '/images/map-groupIcon-density2.png',
                svg:
                    '<image id="map-groupIcon-density2" x="0" y="0" width="46" height="61" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAA9CAYAAADS+1sCAAACzElEQVRo3tWZz2saQRTH/RP8E/In9Kh78tK75BRNKB5aFXqoPSaXCOk1WHoKpWAJFEogCClNT0W89BKIOQXSyxaKCqXgobSHqEznmVVW3Z03s/NzHzyQVXc+8/a978y8zWQUWn0nt1XfyxWivFIpZDOuGIBWd/ONWinfrZXzY+oEcfhNp17OVeC/5oHpwAEskfQOPA3twNVSvkgH8xUArzoNgpYJQH5CdJQDb06gpawWnpW9R5z5q8r7MKZ8LpsDXinixPCy0AcvtuduFB4KRRTy0/k7cnd7TaLs398/8+/OTl+LToYfHvSVN6ePj57HwrLsW++zyAR8roKF4sBu9vLpY/L1y0cia/CUePWerdOwCiI3ebX/hPz88Z2oMrgXBAIbN1bnA60eY9CQr6qNE96PURGviaWHykivG9QKGnWqdFG5zYz2zVWP6DaOnPeFNBvUw5RharMij9g+JInkJTWQSmw/EwZnFqRpQwq1z7VKqtBrUXt/csSM+nxBwrRbp5LEGQgBqumYDNqw37+GTHAINrMwocJZNpvNtMGz9dxrZlhnR0wGJ5P7dILrNClwLFWsgqe2OFXI4XQ6NS+HwSk+fQsQtjN0dsl/APfaadlkzfN7remTim3tRrMUa2K6cZDw2sK9FCeObnGtaSzqdg/LEdHmzfXFaqoy8hBpjhP+GG0KYSupjYbQipLIdrMMtuA62nriGpuevnCjP3htQiy6vR65jEPgpN5KQB/DNHRkq811eGXQJtNGObQJeG3QOuG1Q+uANwatEt44tAp4a9Ay8Nahk8A7Ay0C7xw0D7yz0GC+72ffvjncaHXANfjOOeDhcFik3qdOwC8vPiyh4fPiOvXOaDQqOAE9GAzaITAShl+DDnvLdqQbMWA8XrQJ3k0KTp9U0yZ4Kyk4zfWKVRUJF6WA952QQIHIj62mCGMCRQALcn/pwTWlxfgfBBiQhx+PhrYAAAAASUVORK5CYII="></image>',
                svgColor: '#22A65A',
                offset: [0, -6],
                anchorText: [19, 19]
            },
            {
                textColor: '#665938',
                textSize: 10,
                height: 73,
                width: 56,
                url: scriptPath + '/images/map-groupIcon-density3.png',
                svg:
                    '<image id="map-groupIcon-density3" x="0" y="0" width="56" height="73" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAABJCAYAAABo+OV6AAADrklEQVR42u2av4sTQRTH8yf4J9yfcGWSKo39YWWiyBZ6CVioKIjXeHA2FnpndRZCDhtFkBQiVhKusVAwh4WgoiuYHyDCFqLtON91N2zuksyb3Z2ZN5AHr8jeZTOfeW/evHlvKhWD0jlbXeucrzY2m7WNTqu+nWr8WT6/1KqvV3wSDBgA7Wat327VhIYO5Hd2Ac4OClbC4OQgQ02oRRq1W/Wuc+vGYHIgJUHNV+kJcGWrYEHQOGUcbB6onFDjcFgj/13IIlzGdTfP1a4ag0vWmWCgPXhRyS5Z6zGBm0bdUiATuAEzuFTDQpG2KNzWlTPi4OGOePH8kfj08f0JxXP8/c6tC24smSdSXrt4Wjx7vCd+fP8sdOTXz7F4/eppPClWIBGtdMFgkb9/foui8ubwZQ7Qelcr3dJ5+f79m6WAZQXvgyfojIOc5umsO7iVSYE14R3UfVLpqjquiR+3IVjPdMglrppEzYgTXB7IhSldfMwhvADBxIVgUgtZkXLcubdzWbgUauA5YcUkiVZ+EfuVS0F0pbgqvFF7U0fWwUGIrhoed8+Iu/WyQkkEpm6KEzNlM+ckCHTKjT89O1Kip+1tgZK7kqMp5axXdipmyU0H6Ul9aYkPxxmOgqCnMkxqQa/Wn846jHNTrpmLSo7eHaojKUqOvgKiKrACXAEyBsRhmxZkFNuE6xNEkShKSrSxoXIUTLyqn5GkatXAp0Q7FeWxSbYaMm0wt8UlE3vgTJVNVUnjlq4R0rRIu5qGsMxBkPhr12UoFTUu0ZRSl5nblKGULeD7LgXlQ0o3eEnPXd2DcHk2pHSilvb0KV1cV65KOf8ttJ5uddt2hY1a9CU1RKk1UluQlJxzbi1U0WEi9eThrqbWJN5Lcss8TVCdRgwCT9nRFXuuThM0V6+eUi89bs2iyQC2AdSAtBqfRe7O6Lay09MH1g21T5/25/NdRtBoXZd5GSHrvrBsetsiVWQjeK7RvV1c9yzllpPtu2m2LgIxvRBULhyzK11m4Ji4q3k4h5D24BxA2oezCOkOzgKkeziDkHzgDEDygysRki9cCZD84QpA+gOXA9I/OA1If+EIkP7DQSaTSePB3esz9Z3bN5riw+BtEIahn4AY+Gg06o7H40iqgO7vbk3hvn39ItLn+D85CWvewA2Hw/UsWFafHOzNwGU0kpCBF4BysOE8OIJGXrhsTrhYsV5XFuS8BhXWC7wJNIiKSRSlwPUxKd5uFxJgQ8JuJ8B9qT18hsVsbA//AC11eX38GkhwAAAAAElFTkSuQmCC"></image>',
                svgColor: '#22A65A',
                offset: [0, -7],
                anchorText: [19, 19]
            }
        ]
    }
};
