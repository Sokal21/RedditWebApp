import {
    SUBREDDIT_SET_SUBREDDIT,
    SUBREDDIT_STARTED_FETCHING_POSTS,
    SUBREDDIT_SUCCESS_FETCHING_POSTS,
    SUBREDDIT_FAIL_FETCHING_POSTS,
    SUBREDDIT_RESET_POSTS,
    SUBREDDIT_NEW_POSTS,
    SUBREDDIT_VIEW_NEW_POSTS,
} from '../constants';

const initialState = {
    isFetching: false,
    subredditId: '',
    posts: [],
    newPosts: [],
    error: null,
    hasMore: true,
};

export default function subredditReducer(state = initialState, action) {
    switch (action.type) {
        case SUBREDDIT_STARTED_FETCHING_POSTS:
            return Object.assign({}, state, {
                isFetching: true,
            });
        case SUBREDDIT_SET_SUBREDDIT:
            return Object.assign({}, state, {
                subredditId: action.subredditId,
            });
        case SUBREDDIT_SUCCESS_FETCHING_POSTS:
            return Object.assign({}, state, {
                posts: state.posts.concat(action.posts),
                isFetching: false,
                hasMore: action.posts.length === 5,
            });
        case SUBREDDIT_FAIL_FETCHING_POSTS:
            return Object.assign({}, state, {
                isFetching: false,
                error: action.error,
            });
        case SUBREDDIT_RESET_POSTS:
            return Object.assign({}, state, {
                posts: [],
                newPosts: [],
                hasMore: true,
            });
        case SUBREDDIT_NEW_POSTS:
            return Object.assign({}, state, {
                newPosts: state.newPosts.concat(action.posts),
            });
        case SUBREDDIT_VIEW_NEW_POSTS:
            return Object.assign({}, state, {
                posts: state.newPosts.concat(state.posts),
                newPosts: [],
            });
        default:
            return state
    }
  }