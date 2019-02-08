import React from 'react';
import { connect } from 'react-redux';
import { Input } from 'semantic-ui-react';
import {
    setSubredditAction,
    startedFetchingAction,
    resetPostsAction,
} from '../../store/actions/subredditActions';
import './SubredditSearch.css';

function SubredditSearch(props) {
    const {
        subredditId,
        isFetching,
        setSubreddit,
        startedFetching,    
        resetPosts,
    } = props;
    return (
        <form
            className="subreddit-search__container"
            onSubmit={(event) => {
                event.preventDefault();
                resetPosts();
                startedFetching();
            }}>
            <Input
                loading={isFetching}
                icon="search"
                placeholder="Search..."
                value={subredditId} onChange={(event) => setSubreddit(event.target.value)}
            />
        </form>
    )
};

const mapStateToProps = state => ({
    subredditId: state.subredditId,
    isFetching: state.isFetching,
});

const mapDispatchToProps = dispatch => ({
    setSubreddit: subredditId => dispatch(setSubredditAction(subredditId)),
    startedFetching: () => dispatch(startedFetchingAction()),
    resetPosts: () => dispatch(resetPostsAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SubredditSearch);
