import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { List } from 'semantic-ui-react';
import SubredditItem from '../SubredditItem';
import { startedFetchingAction, lookForNewPostsAction, viewNewPostsAction } from '../../store/actions/subredditActions';
import './SubredditList.css';
import classNames from 'classnames';

function SubredditList(props) {
    const {
        posts,
        startedFetching,
        lookForNewPosts,
        hasMore,
        newPosts,
        viewNewPosts,
        subredditId,
    } = props;
    useEffect(() => {   
        const interval = setInterval(lookForNewPosts, 60000);
        return () => clearInterval(interval);
    }, [])
    return (
        <div className="subreddit-list__container">
            {
                posts.length ? (
                    <React.Fragment>
                        <div className={
                            classNames({
                                "subreddit-list__view-more-button": true,
                                "not-visible": !newPosts.length,
                            })
                        } onClick={() => { if(newPosts.length) viewNewPosts() }}>
                            <h3>
                                See new posts ({newPosts.length})
                            </h3>
                        </div>
                        <List divided relaxed className="subreddit-list__container">
                            {posts.map((post) => <SubredditItem post={post} subredditId={subredditId} key={post.data.name} />)}
                        </List>
                        <div
                            className={
                            classNames({
                                "subreddit-list__load-more-button": true,
                                "disabled": !hasMore,
                            })
                            }
                            onClick={() => { if(hasMore) startedFetching() }}
                        >
                            <h3>
                                { hasMore ? "Load More" : "The end..." }
                            </h3>
                        </div>
                    </React.Fragment>
                ) : null
            }
        </div>
    )
};  

const mapStateToProps = state => ({
    posts: state.posts,
    hasMore: state.hasMore,
    newPosts: state.newPosts,
    subredditId: state.subredditId,
});

const mapDispatchToProps = dispatch => ({
    startedFetching: () => dispatch(startedFetchingAction()),
    lookForNewPosts: () => dispatch(lookForNewPostsAction()),
    viewNewPosts: () => dispatch(viewNewPostsAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SubredditList);
