import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Input } from 'semantic-ui-react';
import { withRouter } from "react-router";
import {
    setSubredditAction,
    startedFetchingAction,
    resetPostsAction,
} from '../../store/actions/subredditActions';
import './SubredditSearch.css';

export function SubredditSearch(props) {
    const {
        subredditId,
        isFetching,
        setSubreddit,
        startedFetching,    
        resetPosts,
        match,
        history,
    } = props;

    useEffect(() => {
        setSubreddit(match.params.subredditId);
        startedFetching();
    }, []);

    return (
        <form
            className="subreddit-search__container"
            onSubmit={(event) => {
                history.push(`/r/${subredditId}`)
                resetPosts();
                startedFetching();
                event.preventDefault();
            }}>
            <Input
                loading={isFetching}
                icon="search"
                placeholder="Search..."
                value={subredditId}
                onChange={(event) => setSubreddit(event.target.value)}
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SubredditSearch));
