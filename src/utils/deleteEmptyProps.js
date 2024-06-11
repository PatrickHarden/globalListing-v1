import _ from 'lodash';
export default function deleteEmptyProps(object){
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            //Now, object[key] is the current value
            if (object[key] === null || object[key] === undefined || _.isEmpty(object[key])){
                delete object[key];
            }
               
        }
    }
}