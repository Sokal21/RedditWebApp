import React from 'react';
import { shallow } from 'enzyme';
import { configure } from 'enzyme';
import SubredditItem from './index';
import moment from 'moment';
import Adapter from 'enzyme-adapter-react-16';
import nsfwImage from '../../assets/images/nsfw-reddit.png';
import selfImage from '../../assets/images/self-post.png';
import linkImage from '../../assets/images/link-post.png';
import spoilerImage from '../../assets/images/spoiler-post.png';
import { List } from 'semantic-ui-react';

configure({ adapter: new Adapter() });

const post = {
    thumbnail: 'default',
    is_self: true,
    url: 'test url',
    title: 'test title',
    created_utc: moment.unix(),
    subreddit_name_prefixed: '/r/test_subreddit',
    author: 'test author',
    num_comments: 5,
    permalink: '/r/test_link',
}

const createPost = (properties = {}) => ({
    data: {
        ...post,
        ...properties,
    }
})

it('Should render proper thumbnail when post is_self property is true and thumbnail type is default', () => {
    const post = createPost()
    const subredditItem = shallow(<SubredditItem post={post} subredditId="all" />);

    expect(subredditItem.find('.subreddit-item__image').prop('src')).toEqual(post.data.url);   
});

it('Should render proper thumbnail when post is_self property is false and thumbnail type is default', () => {
    const post = createPost({
        is_self: false,
    })
    const subredditItem = shallow(<SubredditItem post={post} subredditId="all" />);

    expect(subredditItem.find('.subreddit-item__image').prop('src')).toEqual(linkImage);   
});

it('Should render proper thumbnail when post thumbnail type is nsfw', () => {
    const post = createPost({
        thumbnail: 'nsfw',
    })
    const subredditItem = shallow(<SubredditItem post={post} subredditId="all" />);

    expect(subredditItem.find('.subreddit-item__image').prop('src')).toEqual(nsfwImage);   
});

it('Should render proper thumbnail when post thumbnail type is self', () => {
    const post = createPost({
        thumbnail: 'self',
    })
    const subredditItem = shallow(<SubredditItem post={post} subredditId="all" />);

    expect(subredditItem.find('.subreddit-item__image').prop('src')).toEqual(selfImage);   
});

it('Should render proper thumbnail when post thumbnail type is image', () => {
    const post = createPost({
        thumbnail: 'image',
    })
    const subredditItem = shallow(<SubredditItem post={post} subredditId="all" />);

    expect(subredditItem.find('.subreddit-item__image').prop('src')).toEqual(post.data.url);   
});

it('Should render proper thumbnail when post thumbnail type is spoiler', () => {
    const post = createPost({
        thumbnail: 'spoiler',
    })
    const subredditItem = shallow(<SubredditItem post={post} subredditId="all" />);

    expect(subredditItem.find('.subreddit-item__image').prop('src')).toEqual(spoilerImage);   
});

it('Should render proper thumbnail when post thumbnail type is empty', () => {
    const post = createPost({
        thumbnail: '',
    })
    const subredditItem = shallow(<SubredditItem post={post} subredditId="all" />);

    expect(subredditItem.find('.subreddit-item__image').prop('src')).toEqual(selfImage);   
});

it('Should render proper thumbnail when now case is reached', () => {
    const post = createPost({
        thumbnail: 'this is test',
    })
    const subredditItem = shallow(<SubredditItem post={post} subredditId="all" />);

    expect(subredditItem.find('.subreddit-item__image').prop('src')).toEqual(post.data.thumbnail);   
});

it('Should render List.Header as first child of List.Content with proper content', () => {
    const post = createPost()
    const subredditItem = shallow(<SubredditItem post={post} subredditId="all" />);

    expect(subredditItem.find(List.Content).childAt(0).equals((
        <List.Header href={post.data.url} as='a'>
            {post.data.title}
        </List.Header>
    ))).toBeTruthy(); 
});

it('Should render List.Description as second child of List.Content with proper content', () => {
    const post = createPost()
    const subredditItem = shallow(<SubredditItem post={post} subredditId="all" />);

    expect(subredditItem.find(List.Content).childAt(1).equals((
        <List.Description>
            {moment.unix(post.data.created_utc).fromNow()}
        </List.Description>
    ))).toBeTruthy(); 
});

it('Should render subreddit link if subredditId is all', () => {
    const post = createPost()
    const subredditItem = shallow(<SubredditItem post={post} subredditId="all" />);

    expect(subredditItem.find(List.Content).childAt(2).childAt(0).equals((
        <div>
            at:&nbsp;
            <List.Header
                className="subreddit-item__info--subreddit"
                as='a' href={`https://www.reddit.com/${post.data.subreddit_name_prefixed}`}
            >
                <strong>{post.data.subreddit_name_prefixed}</strong>
            </List.Header>
        </div>
    ))).toBeTruthy(); 
});

it('Should not render subreddit link if subredditId is all', () => {
    const post = createPost()
    const subredditItem = shallow(<SubredditItem post={post} subredditId="test_subreddit" />);

    expect(subredditItem.find('.subreddit-item__info--subreddit')).toHaveLength(0); 
});

it('Should render proper content inside .subreddit-item__info--author List.Header', () => {
    const post = createPost()
    const subredditItem = shallow(<SubredditItem post={post} subredditId="all" />);

    expect(subredditItem.find('.subreddit-item__info--author').equals((
        <List.Header
            as='a'
            href={`https://www.reddit.com/u/${post.data.author}`}
            className="subreddit-item__info--author"
        >
            <strong>u/{post.data.author}</strong>
        </List.Header>
    ))).toBeTruthy(); 
});

it('Should render proper content inside .subreddit-item__info--comments List.Header', () => {
    const post = createPost()
    const subredditItem = shallow(<SubredditItem post={post} subredditId="all" />);

    expect(subredditItem.find('.subreddit-item__info--comments').equals((
        <List.Header
            as='a'
            href={`https://www.reddit.com${post.data.permalink}`}
            className="subreddit-item__info--comments"
         >
            <strong>({post.data.num_comments}) Comments</strong>
        </List.Header>
    ))).toBeTruthy(); 
});