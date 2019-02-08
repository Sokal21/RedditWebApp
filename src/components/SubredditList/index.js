import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Transition, animated } from 'react-spring/renderprops';
import { List } from 'semantic-ui-react';
import moment from 'moment';
import { startedFetchingAction, lookForNewPostsAction, viewNewPostsAction } from '../../store/actions/subredditActions';
import nsfwImage from '../../assets/images/nsfw-reddit.png';
import selfImage from '../../assets/images/self-post.png';
import linkImage from '../../assets/images/link-post.png';
import spoilerImage from '../../assets/images/spoiler-post.png';
import './SubredditList.css';
import classNames from 'classnames';

function detectThumbnail(post) {
    const imageComponent = (url) => <a href={post.data.url}><img className="subreddit-list__image" src={url} /></a>;
    switch (post.data.thumbnail) {
        case 'default':
            return imageComponent(post.data.is_self ? post.data.url : linkImage);
        case 'nsfw':
            return imageComponent(nsfwImage);
        case 'self': 
            return imageComponent(selfImage);
        case 'image':
            return imageComponent(post.data.url);
        case 'spoiler':
            return imageComponent(spoilerImage);
        case '':
            return imageComponent(selfImage);
        default:
            return imageComponent(post.data.thumbnail);
    }
}

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
                        } onClick={newPosts.length &&viewNewPosts}>
                            <h3>
                                See new posts ({newPosts.length})
                            </h3>
                        </div>
                        <List divided relaxed>
                            <Transition
                                native
                                keys={posts.map((post) => post.data.id)}
                                items={posts.map((post) => (
                                    <List.Item>
                                        {detectThumbnail(post)}
                                        <List.Content>
                                            <List.Header href={post.data.url} as='a'>{post.data.title}</List.Header>
                                            <List.Description>{moment.unix(post.data.created_utc).fromNow()}</List.Description>
                                            <div className="margin-top">
                                                {
                                                    subredditId.toLowerCase() === "all" && (
                                                        <div>
                                                            at:&nbsp;
                                                            <List.Header
                                                                className="subreddit-list__info--subreddit"
                                                                as='a' href={`https://www.reddit.com/${post.data.subreddit_name_prefixed}`}
                                                            >
                                                                <strong>{post.data.subreddit_name_prefixed}</strong>
                                                            </List.Header>
                                                        </div>
                                                    )
                                                }
                                                <div>
                                                    by:&nbsp;
                                                    <List.Header
                                                        as='a'
                                                        href={`https://www.reddit.com/u/${post.data.author}`}
                                                        className="subreddit-list__info--author"
                                                    >
                                                        <strong>u/{post.data.author}</strong>
                                                    </List.Header>
                                                </div>
                                                <List.Header
                                                        as='a'
                                                        href={`https://www.reddit.com${post.data.permalink}`}
            
                                                >
                                                    <strong>({post.data.num_comments}) Comments</strong>
                                                </List.Header>
                                            </div>
                                        </List.Content>
                                    </List.Item>
                                ))}
                                from={{ opacity: 0, height: 0 }}
                                enter={{ opacity: 1, height: 'auto' }}
                                leave={{ opacity: 0, height: 0 }}
                                trail={100}
                            >
                                {post => props => <animated.div style={props} className="item">{post}</animated.div>}
                            </Transition>
                        </List>
                        <div
                            className={
                            classNames({
                                "subreddit-list__load-more-button": true,
                                "disabled": !hasMore,
                            })
                            }
                            onClick={hasMore && startedFetching}
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
