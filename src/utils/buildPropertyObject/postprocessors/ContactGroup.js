import _ from 'lodash';
import getActualAddress from './ActualAddress';

module.exports = (
  item,
  _comparators,
  _urlslug,
  _returnProperty,
  configStore
) => {
  var _tmp = _.clone(item);
  if (
    item.hasOwnProperty('name') &&
    _.isPlainObject(item.name) &&
    item.name.hasOwnProperty('content')
  ) {
    _tmp.name = item.name.content;
  }

  if (
    (!_tmp.hasOwnProperty('name') || _tmp.name === '') &&
    item.contacts.length
  ) {
    _tmp.name = item.contacts[0].name;
  }
  if (item.contacts.length) {
    _tmp.contacts.map(contact => {
      if (
        !contact.avatar &&
        configStore &&
        configStore.getFeatures() &&
        configStore.getFeatures().useDefaultFallbackImageForContact
      ) {
        contact.avatar = configStore.getItem('defaultAvatar');
      }
    });
  }

  // Run address through ActualAddress postprocessor
  if (item.address) {
    _tmp.address = getActualAddress(
      item.address,
      _comparators,
      _urlslug
    )[0].val;
  }

  return [
    {
      prop: 'ContactGroup',
      val: _tmp
    }
  ];
};
