import { call, put, select, takeLatest } from 'redux-saga/effects'
import axios from 'axios';
import {
    successFetchingAction,
    failFetchingAction,
    newPostsAction,
} from '../store/actions/subredditActions';
import {
    SUBREDDIT_STARTED_FETCHING_POSTS,
    SUBREDDIT_LOOK_FOR_NEW_POSTS,
} from '../store/constants';

function* fetchPosts() {
   try {
        const subredditId = yield select((state) => state.subredditId);
        const posts = yield select((state) => state.posts);
        const lastPost = posts.length ? posts[posts.length-1].data.name : null
        const response = yield call(axios.get, `http://www.reddit.com/r/${subredditId}/new.json`, {
            params: {
            limit: 5,
            sort: 'new',
            after: lastPost,
            },
        });
        yield put(successFetchingAction(response.data.data.children));
   } catch (error) {
        yield put(failFetchingAction(error));
   }
}

function* fetchNewPosts() {
    try {
         const subredditId = yield select((state) => state.subredditId);
         const posts = yield select((state) => state.posts);
         const lastPost = posts.length ? posts[0].data.name : null
         const response = yield call(axios.get, `http://www.reddit.com/r/${subredditId}/new.json`, {
             params: {
             limit: 100,
             sort: 'new',
             before: lastPost,
             },
         });
         yield put(newPostsAction(response.data.data.children));
    } catch (error) {
         yield put(failFetchingAction(error));
    }
 }

function* mySaga() {
  yield takeLatest(SUBREDDIT_STARTED_FETCHING_POSTS, fetchPosts);
  yield takeLatest(SUBREDDIT_LOOK_FOR_NEW_POSTS, fetchNewPosts);
}

export default mySaga;