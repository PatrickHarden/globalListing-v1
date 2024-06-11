import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select_R3 from '../../../r3/external/agency365-components/Select/Select.r3';
import Select_R4 from '../../../r4/external/agency365-components/Select/Select.r4';
import classNames from 'classnames';
import { changeTakeAndLoadProperties } from '../../../redux/actions/properties/change-paging';
import styled from 'styled-components';
import { markersLoadingSelector } from '../../../redux/selectors/map/markers/markers-loading-selector';

const RecordsPerPage = (props) => {

    const { context, r4 } = props;

    const dispatch = useDispatch();
    const markersLoading = useSelector(markersLoadingSelector);

    const r3 = !r4;

    const takeOptions = [{'label': '25', 'value': 25}, {'label': '50', 'value': 50}, {'label': '100', 'value': 100}, {'label': '500', 'value': 500}];
    const [take, setTake] = useState(takeOptions[0]);
    let viewLabel = r4 ? '' : 'VIEW';       // todo internationalize

    const selectClasses = ['Select', 'Select-Small', 'Select--single', 'Select__small'];

    const changeTakeHandler = (val) => {
        dispatch(changeTakeAndLoadProperties(context, val.value));
        setTake(val);
    };

    const SelectComponent = r4 ? Select_R4 : Select_R3;
    
    return (
        <Container>
            {!markersLoading &&
                <SelectWrapper className={r4 ? 'r4-select-wrapper' : 'r3-select-wrapper'}>
                    { r4 && <SelectLabel>View</SelectLabel> }
                    { r3 && <span className="filter-label">{viewLabel}</span> }
                    <SelectComponent  
                        key="controlbartake"
                        name="view" 
                        value={take}
                        onChange={changeTakeHandler}
                        onMouseOverClass="is-focused"
                        optionsArray={takeOptions} 
                        className={classNames(selectClasses)}
                        optionClass="Select-value"
                        outerClass={r4 ? 'Select-menu-outer selectMenuOuterDropUp' : 'Select-menu-outer'}
                        extraPlaceholderClass="Select-value-label"
                        selectArrowZoneClass="Select-arrow-zone"
                        selectArrowClass="Select-arrow"
                        selectValueClass="Select-value-label"
                        selectMenuClass="Select-menu"
                        selectOptionClass="Select-option"
                        selectControlClass="Select-control r4-select"
                        selectInputClass="Select-input"
                        showLabel={false}
                        disabled={false} />
                </SelectWrapper>
            }
        </Container>    
    );
};

const Container = styled.div`
    .r3-select-wrapper{
        display: inline-block;
    }
    .r4-select-wrapper{
        display: block;  
        > .Select-menu-outer{
            margin-left: 9px !important;
        }
        width: 125px;
    }
`;

const SelectWrapper = styled.div``;

const SelectLabel = styled.div`
    font-size: 14px;
    font-family: Calibre;
    line-height: 16px;
    font-weight: 600;
    text-decoration: underline;
    color: #003F2D;
    margin-left: 20px;

    @media only screen and (min-device-width : 320px) and (max-device-width : 480px) {
        margin-left: 12px;
    }
`;

export default RecordsPerPage;