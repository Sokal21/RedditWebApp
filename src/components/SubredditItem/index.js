import React from 'react';
import { List } from 'semantic-ui-react';
import moment from 'moment';
import nsfwImage from '../../assets/images/nsfw-reddit.png';
import selfImage from '../../assets/images/self-post.png';
import linkImage from '../../assets/images/link-post.png';
import spoilerImage from '../../assets/images/spoiler-post.png';
import './SubredditItem.css';

function detectThumbnail(post) {
    const imageComponent = (url) => <a href={post.data.url}><img className="subreddit-item__image" src={url} /></a>;
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

function SubredditItem(props) {
    const {
        post,
        subredditId,
    } = props;
    return (
        <List.Item className="subreddit-list__item">
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
                                    className="subreddit-item__info--subreddit"
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
                            className="subreddit-item__info--author"
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
    )
};  


export default SubredditItem;
