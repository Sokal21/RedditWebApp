import {
    SUBREDDIT_SET_SUBREDDIT,
    SUBREDDIT_STARTED_FETCHING_POSTS,
    SUBREDDIT_SUCCESS_FETCHING_POSTS,
    SUBREDDIT_FAIL_FETCHING_POSTS,
    SUBREDDIT_RESET_POSTS,
    SUBREDDIT_NEW_POSTS,
    SUBREDDIT_VIEW_NEW_POSTS,
    SUBREDDIT_LOOK_FOR_NEW_POSTS,
} from '../constants';

const setSubredditAction = (subredditId) => ({
    type: SUBREDDIT_SET_SUBREDDIT,
    subredditId,
});

const startedFetchingAction = () => ({
    type: SUBREDDIT_STARTED_FETCHING_POSTS,
});

const successFetchingAction = (posts) => ({
    type: SUBREDDIT_SUCCESS_FETCHING_POSTS,
    posts,
});

const failFetchingAction = (error) => ({
    type: SUBREDDIT_FAIL_FETCHING_POSTS,
    error,
});

const resetPostsAction = () => ({
    type: SUBREDDIT_RESET_POSTS,
});

const lookForNewPostsAction = () => ({
    type: SUBREDDIT_LOOK_FOR_NEW_POSTS,
});

const newPostsAction = (posts) => ({
    type: SUBREDDIT_NEW_POSTS,
    posts,
});

const viewNewPostsAction = () => ({
    type: SUBREDDIT_VIEW_NEW_POSTS,
});

export {
    setSubredditAction,
    lookForNewPostsAction,
    startedFetchingAction,
    successFetchingAction,
    failFetchingAction,
    resetPostsAction,
    newPostsAction,
    viewNewPostsAction,
};