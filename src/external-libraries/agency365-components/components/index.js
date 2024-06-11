import {
  configureComponent,
  themeInjector,
  responsiveContainer as _responsiveContainer
} from '../containers';

import {
  debounce as _debounce,
  evalTemplateString as _evalTemplateString,
  browser as _browser
} from '../utils';

import _ThemeWrapper from './ThemeWrapper/ThemeWrapper';
import _Avatar from './Avatar/Avatar';
import _Button from './Button/Button';
import _Card from './Card/Card';
import _CardBody from './CardBody/CardBody';
import _CardGroup from './CardGroup/CardGroup';

import _CardMedia from './CardMedia/CardMedia';
import _CollapsibleBlock from './CollapsibleBlock/CollapsibleBlock';

import _Contact from './Contact/Contact';
import _List from './List/List';
import _MediaWrapper from './MediaWrapper/MediaWrapper';
import _ResponsiveImage from './ResponsiveImage/ResponsiveImage';
import _Select from './Forms/Select/Select';
import _ThemeableComponent from './ThemeableComponent/ThemeableComponent';
import _FontIcon from './FontIcon/FontIcon';
import _ExpandableContent from './ExpandableContent/ExpandableContent';
// Forms
import _Checkbox from './Forms/Checkbox/Checkbox';
import _FormGroup from './Forms/FormGroup/FormGroup';
import _GmapsAutoComplete from './Forms/GmapsAutoComplete/GmapsAutoComplete';
import _InputRange from './Forms/InputRange/InputRange';
import _MultiSelect from './Forms/MultiSelect/Select';

export const ThemeWrapper = configureComponent(_ThemeWrapper, __dirname);

export const Avatar = configureComponent(_Avatar, __dirname);

export const Button = configureComponent(_Button, __dirname);

export const Card = configureComponent(_Card, __dirname);

export const CardBody = configureComponent(_CardBody, __dirname);

export const CardGroup = configureComponent(_CardGroup, __dirname);

export const CardMedia = configureComponent(_CardMedia, __dirname);

export const CollapsibleBlock = configureComponent(
  _CollapsibleBlock,
  __dirname
);

export const Contact = configureComponent(_Contact, __dirname);

export const List = configureComponent(_List, __dirname);

export const MediaWrapper = configureComponent(_MediaWrapper, __dirname);

export const ResponsiveImage = configureComponent(_ResponsiveImage, __dirname);

export const Select = configureComponent(_Select, __dirname);

export const ThemeableComponent = themeInjector(
  configureComponent(_ThemeableComponent, __dirname)
);

export const FontIcon = configureComponent(_FontIcon, __dirname);

export const ExpandableContent = configureComponent(
  _ExpandableContent,
  __dirname
);

// Forms
export const Checkbox = configureComponent(_Checkbox, __dirname);

export const FormGroup = configureComponent(_FormGroup, __dirname);

export const GmapsAutoComplete = configureComponent(
  _GmapsAutoComplete,
  __dirname
);

export const InputRange = configureComponent(_InputRange, __dirname);

export const MultiSelect = configureComponent(_MultiSelect, __dirname);

// Containers.
export const responsiveContainer = _responsiveContainer;

// Utils
export const debounce = _debounce;
export const evalTemplateString = _evalTemplateString;
export const browser = _browser;
