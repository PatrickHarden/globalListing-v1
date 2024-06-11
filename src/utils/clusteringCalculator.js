module.exports = function(markers, numStyles){
    //create an index for icon styles
    var index = 0,
    //Count the total number of markers in this cluster
        count = markers.length;

    // If this is a group icon make sure the cluster count accounts for all properties in the group rather than just
    // the group marker
    for (var i = 0; i < markers.length; i++) {
        if(markers[i].label){
            count += (parseInt(markers[i].label.text) -1);
        }
    }

    //Set total to loop through (starts at total number)
    var total = count;

    /**
     * While we still have markers, divide by a set number and
     * increase the index. Cluster moves up to a new style.
     *
     * The bigger the index, the more markers the cluster contains,
     * so the bigger the cluster.
     */
    while (total !== 0) {
        //Create a new total by dividing by a set number
        total = parseInt(total / 10, 10);
        //Increase the index and move up to the next style
        index++;
    }

    /**
     * Make sure we always return a valid index. E.g. If we only have
     * 5 styles, but the index is 8, this will make sure we return
     * 5. Returning an index of 8 wouldn't have a marker style.
     */
    index = Math.min(index, numStyles);

    //Tell MarkerCluster this clusters details (and how to style it)
    return {
        text: count,
        index: index
    };
};
