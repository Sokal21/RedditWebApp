import React from 'react';
import { shallow } from 'enzyme';
import { configure } from 'enzyme';
import { SubredditSearch } from './index';
import Adapter from 'enzyme-adapter-react-16';
import { render, cleanup } from 'react-testing-library';
import { Input } from 'semantic-ui-react';

configure({ adapter: new Adapter() });

afterEach(cleanup);

const defaultProps = {
    subredditId: 'test_subreddit_id',
    isFetching: false,
    setSubreddit: jest.fn(),
    startedFetching: jest.fn(),    
    resetPosts: jest.fn(),
    match: {
        params: {
            subredditId: 'test_subreddit_id_2'
        }
    },
    history: {
        push: jest.fn(),
    },
}

const renderSubredditSearch = (props = {}, fullMount = false) => {
    const finalProps = {
        ...defaultProps,
        ...props,
    }
    if (fullMount) {
        const { rerender } = render(<SubredditSearch {...finalProps} />);
        return rerender(<SubredditSearch {...finalProps} />);
    } else {
        return shallow(<SubredditSearch {...finalProps} />);
    }
}

it('Should set an interval on componet mount', () => {
    const setSubreddit = jest.fn()
    const startedFetching = jest.fn();
    const match = {
        params: {
            subredditId: 'test_id'
        }
    }
    renderSubredditSearch({ setSubreddit, startedFetching, match }, true);

    expect(setSubreddit).toHaveBeenCalledWith(match.params.subredditId);
    expect(startedFetching).toHaveBeenCalledTimes(1);
});

it('Should render a form with correct props', () => {
    const history = {
        push: jest.fn(),
    }
    const subredditId = 'test_id'
    const resetPosts = jest.fn();
    const startedFetching = jest.fn();
    const event = {
        preventDefault: jest.fn()
    }
    const subredditSearch = renderSubredditSearch({ resetPosts, startedFetching, history, subredditId });
    const form = subredditSearch.find('form');
    form.prop('onSubmit')(event);

    expect(history.push).toHaveBeenCalledWith(`/r/${subredditId}`);
    expect(resetPosts).toHaveBeenCalledTimes(1);
    expect(startedFetching).toHaveBeenCalledTimes(1);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
});

it('Should render an Input with correct props', () => {
    const subredditId = 'test_id'
    const setSubreddit = jest.fn();
    const isFetching = true;
    const event = {
        target: {
            value: 'test_value'
        }
    }
    const subredditSearch = renderSubredditSearch({ setSubreddit, isFetching, subredditId });
    const input = subredditSearch.find(Input);
    input.prop('onChange')(event);

    expect(setSubreddit).toHaveBeenCalledWith(event.target.value);
    expect(input.prop('loading')).toEqual(isFetching);
    expect(input.prop('icon')).toEqual('search');
    expect(input.prop('placeholder')).toEqual('Search...');
    expect(input.prop('value')).toEqual(subredditId);
});


