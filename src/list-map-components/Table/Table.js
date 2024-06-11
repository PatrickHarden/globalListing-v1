import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

const classes = {
    table: 'cbre_table',
    stripedTable: 'cbre_table__striped',
    row: 'cbre_table__row row',
    header: 'cbre_table__header',
    cell: 'cbre_table__cell'
};

const Row = props => {
    const rowClasses = props.isHeader ? classes.header : classes.row;
    return (
        <div className={rowClasses}>
            {props.children}
        </div>
    );
};

const Cell = props => {
    const cellClasses = classNames(
        classes.cell,
        props.widthXs && `col-xs-${props.widthXs}`,
        props.widthSm && `col-sm-${props.widthSm}`,
        props.widthMd && `col-md-${props.widthMd}`,
        props.widthLg && `col-lg-${props.widthLg}`
    );
    return (
        <div className={cellClasses}>
            {props.children}
        </div>
    );
};

const Table = (props) => {
    const outerClasses = classNames(
        classes.table,
        props.className,
        props.striped && classes.stripedTable
    );

    return (
        <div className={outerClasses}>
            {props.children}
        </div>
    );
};

Table.propTypes = {
    striped: PropTypes.bool,
    className: PropTypes.string
};

Table.defaultProps = {
    striped: false
};

export {
    Table as default,
    Row,
    Cell
};