import React from 'react';
import { shallow } from 'enzyme';
import { configure } from 'enzyme';
import { SubredditList } from './index';
import { List } from 'semantic-ui-react';
import Adapter from 'enzyme-adapter-react-16';
import { render, cleanup } from 'react-testing-library';
import SubredditItem from '../SubredditItem';
import moment from 'moment';

configure({ adapter: new Adapter() });

afterEach(cleanup);

jest.useFakeTimers();

const posts = [
    {
        data: {
            thumbnail: 'default',
            is_self: true,
            url: 'test url1',
            title: 'test title1',
            name: '1',
            created_utc: moment.unix(),
            subreddit_name_prefixed: '/r/test_subreddit1',
            author: 'test author1',
            num_comments: 5,
            permalink: '/r/test_link1',
        }
    },
    {
        data: {
            thumbnail: 'default',
            is_self: true,
            url: 'test url2',
            title: 'test title2',
            name: '2',
            created_utc: moment.unix(),
            subreddit_name_prefixed: '/r/test_subreddit2',
            author: 'test author2',
            num_comments: 5,
            permalink: '/r/test_link2',
        }
    },
    {
        data: {
            thumbnail: 'default',
            is_self: true,
            url: 'test url3',
            title: 'test title3',
            name: '3',
            created_utc: moment.unix(),
            subreddit_name_prefixed: '/r/test_subreddit3',
            author: 'test author3',
            num_comments: 5,
            permalink: '/r/test_link3',
        }
    }
]

const defaultProps = {
    posts: [],
    startedFetching: jest.fn(),
    lookForNewPosts: jest.fn(),
    hasMore: true,
    newPosts: [],
    viewNewPosts: jest.fn(),
    subredditId: 'test_subreddit_id',
}

const renderSubredditList = (props = {}, fullMount = false) => {
    const finalProps = {
        ...defaultProps,
        ...props,
    }
    if (fullMount) {
        const { rerender } = render(<SubredditList {...finalProps} />);
        return rerender(<SubredditList {...finalProps} />);
    } else {
        return shallow(<SubredditList {...finalProps} />);
    }
}

it('Should set an interval on componet mount', () => {
    const lookForNewPosts = jest.fn()
    renderSubredditList({ post: [], lookForNewPosts }, true);

    expect(setInterval).toHaveBeenCalledWith(lookForNewPosts, 60000);
});

it('Should render .subreddit-list__view-more-button with .not-visible class if newPosts is empty', () => {
    const subredditList = renderSubredditList({ posts, newPosts: [] });

    expect(subredditList.find('.subreddit-list__view-more-button').hasClass('not-visible')).toBeTruthy();
});

it('Should render .subreddit-list__view-more-button without .not-visible class if newPosts has something', () => {
    const subredditList = renderSubredditList({ posts, newPosts: posts });
    const viewMoreButton = subredditList.find('.subreddit-list__view-more-button');

    expect(viewMoreButton.hasClass('not-visible')).toBeFalsy();
    expect(viewMoreButton.children().equals(
        <h3>
            See new posts ({posts.length})
        </h3>
    )).toBeTruthy();
});

it('Should call viewNewPosts when clicking .subreddit-list__view-more-button if newPosts length is bigger than 0', () => {
    const viewNewPosts = jest.fn()
    const subredditList = renderSubredditList({ newPosts: posts, viewNewPosts });
    const viewMoreButton = subredditList.find('.subreddit-list__view-more-button');
    viewMoreButton.simulate('click');
    expect(viewNewPosts).toHaveBeenCalledTimes(1);
});

it('Should not call viewNewPosts when clicking .subreddit-list__view-more-button if newPosts length is 0', () => {
    const viewNewPosts = jest.fn()
    const subredditList = renderSubredditList({ newPosts: [], viewNewPosts });
    const viewMoreButton = subredditList.find('.subreddit-list__view-more-button');

    viewMoreButton.simulate('click');
    expect(viewNewPosts).toHaveBeenCalledTimes(0);
});

it('Should render .subreddit-list__load-more-button without .disabled class if hasMore is true', () => {
    const subredditList = renderSubredditList({ posts, hasMore: true });
    const loadMoreButton = subredditList.find('.subreddit-list__load-more-button');

    expect(loadMoreButton.hasClass('disabled')).toBeFalsy();
    expect(loadMoreButton.children().equals(
        <h3>
            Load More
        </h3>
    )).toBeTruthy();
});

it('Should render .subreddit-list__load-more-button with .disabled class if hasMore is false', () => {
    const subredditList = renderSubredditList({ posts, hasMore: false });
    const loadMoreButton = subredditList.find('.subreddit-list__load-more-button');

    expect(loadMoreButton.hasClass('disabled')).toBeTruthy();
    expect(loadMoreButton.children().equals(
        <h3>
            The end...
        </h3>
    )).toBeTruthy();
});

it('Should call startedFetching when clicking .subreddit-list__load-more-button if hasMore is true', () => {
    const startedFetching = jest.fn()
    const subredditList = renderSubredditList({ posts, hasMore: true, startedFetching });
    const loadMoreButton = subredditList.find('.subreddit-list__load-more-button');
    loadMoreButton.simulate('click');
    expect(startedFetching).toHaveBeenCalledTimes(1);
});

it('Should not call startedFetching when clicking .subreddit-list__load-more-button if hasMore is false', () => {
    const startedFetching = jest.fn()
    const subredditList = renderSubredditList({ posts, hasMore: false, startedFetching });
    const loadMoreButton = subredditList.find('.subreddit-list__load-more-button');
    loadMoreButton.simulate('click');
    expect(startedFetching).toHaveBeenCalledTimes(0);
});

it('Should render a SubredditItem for each item in posts prop', () => {
    const subredditId = 'test id'
    const subredditList = renderSubredditList({ posts, subredditId }).find(List).children();

    expect(subredditList).toHaveLength(posts.length);
    subredditList.forEach((subredditItem, index) => {
        expect(subredditItem.equals(<SubredditItem post={posts[index]} subredditId={subredditId} key={posts[index].data.name} />));
    })
});

