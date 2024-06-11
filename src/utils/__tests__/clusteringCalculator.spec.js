var clusteringCalculator = require('../clusteringCalculator');

describe('ClusteringCalculator', function () {
    var markers = [
            { marker: 1 },
            { marker: 2 },
            { marker: 3 },
            { marker: 4, label: {
                text: '3'
            } }
        ],
        numstyles = 3,
        expectedReturn = {
            text: 6,
            index: 1
        };

    describe('When calculating marker count', function () {

        it('should return an object containing a property relating to the number of properties rather than pins', function () {
            expect(clusteringCalculator(markers, numstyles).text).toBe(expectedReturn.text);
        });

        it('should return an object containing a property relating to the icon style to display', function () {
            expect(clusteringCalculator(markers, numstyles).index).toBe(expectedReturn.index);
            markers[3].label.text = '10';
            expect(clusteringCalculator(markers, numstyles).index).toBe(2);
            markers[3].label.text = '100';
            expect(clusteringCalculator(markers, numstyles).index).toBe(3);
        });

    });
});
