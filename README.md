This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# First Steps

first run:

### `npm install -g yarn`

after installing yarn, download all dependencies:

### `yarn install`

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

# Design decisions

## Why Redux Saga?

Since the use of Redux was mandatory for the assignment, Redux Saga was my first option for handling asynchronous call to the reddit API. The tool gave me the ability to detach the logic of the HTTP request from React components and also has direct access to the Redux store and dispatcher.

## Why `create-react-app`?

I chose this boilerplate becasue is simple, fast and reliable.     

## Why semantic-ui?

I did not want to deal with CSS design and I wanted to have a cool and consistent design all over the app. For solving this problem, I selected this very popular framework that provides me a lot of 'out of the box' components with a very nice and minimalistic styles.

## Why Enzyme and Jest?

I'm very familiar with Enzyme API for testing React components so I decided to go with it for this kind of tasks.

Jest is the default tool that `create-react-app` provides.

## Why hooks?

I was really looking foward to this recent release bacuase of this new feature. So I took this oportunity to test it. I'm a fan of functional programming and having the chance of getting rid off classes was a very cool experience. I decided to use the hooks for controlling the cycles of React components in a very fancy way. The only problem that I found was that the testing libraries for the shallow renders were not prepared for this feature so I had to look for some work arounds.

In some components in which I used the 'effect hook', the functions that were taken from props and used inside the hook, seemed to have not been called when shallow or mount rendering of Enzyme was made. How did I solve this? I used the re-render function of `react-testing-library` and I could test it. This is an example:

### SubredditList.test.js
```javascript
jest.useFakeTimers();


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
```

### SubredditList index.js
```javascript
export function SubredditList(props) {
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
        </div>
    )
};  
```