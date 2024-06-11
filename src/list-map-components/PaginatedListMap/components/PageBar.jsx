import React from 'react';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { changePageAndLoadProperties } from '../../../redux/actions/properties/change-paging';
import { currentPageSelector } from '../../../redux/selectors/properties/current-page-selector';
import { currentMapMarkersSelector } from '../../../redux/selectors/map/markers/current-map-markers-selector';
import { markersLoadingSelector } from '../../../redux/selectors/map/markers/markers-loading-selector';
import { viewableMarkerCountSelector } from '../../../redux/selectors/map/markers/viewable-marker-count-selector';
import { currentTakeSelector } from '../../../redux/selectors/properties/current-take-selector';
import { PageBarContainer, PageBarRight, PageBarLeft} from '../../../r4/shared-styles/list-map.jsx';
import RecordsPerPage from './RecordsPerPage.jsx';

const ListPageBar = (props) => {

    const { context, r4, includeRecordsPerPage } = props;

    const dispatch = useDispatch();
    const take = useSelector(currentTakeSelector);
    const viewableMarkerCount = useSelector(viewableMarkerCountSelector);

    const markersLoading = useSelector(markersLoadingSelector);
    const page = useSelector(currentPageSelector);
    const pageCount = viewableMarkerCount && viewableMarkerCount > 0 && take > 0 ? Math.ceil(viewableMarkerCount / take) : 1;

    const isMobile = !!window.matchMedia('(max-width: 767px)').matches;

    const pageRangeDisplayed = isMobile ? 2 : 5;
    const marginPagesDisplayed = isMobile ? 0 : 1;
    const breakLabel = isMobile ? '' : '...';

    const handlePageClick = (data) => {
        dispatch(changePageAndLoadProperties(context, data.selected + 1));
    };

    return (
        <PageBarContainer>
            { includeRecordsPerPage && 
                <PageBarLeft>
                    <RecordsPerPage context={context} r4={r4} />
                </PageBarLeft>
            }
            <PageBarRight>
                { !markersLoading && 
                    <ReactPaginate
                        forcePage={page-1}
                        previousLabel={r4 ? '<' : '<<'}
                        nextLabel={r4 ? '>' : '>>'}
                        breakLabel={breakLabel}
                        breakClassName={'break-me'}
                        pageCount={pageCount}
                        marginPagesDisplayed={marginPagesDisplayed}
                        pageRangeDisplayed={pageRangeDisplayed}
                        onPageChange={handlePageClick}
                        containerClassName={'lm-pagination'}
                        activeClassName={'active'}
                        />
                }   
            </PageBarRight>
        </PageBarContainer>
    ); 
};

export default ListPageBar;