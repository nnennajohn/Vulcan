/*

HoC that provides access to flash messages stored in Redux state and actions to operate on them

*/

import { getActions, addAction, addReducer } from 'meteor/vulcan:lib';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/*

  Messages actions

*/

addAction({
  messages: {
    flash(content, flashType = 'error') {
      return {
        type: 'FLASH',
        content:
          typeof content === 'string'
            ? {
                message: content
              }
            : content,
        flashType
      };
    },
    clear(i) {
      return {
        type: 'CLEAR',
        i
      };
    },
    markAsSeen(i) {
      return {
        type: 'MARK_AS_SEEN',
        i
      };
    },
    clearSeen() {
      return {
        type: 'CLEAR_SEEN'
      };
    }
  }
});

/*

  Messages reducers

*/

addReducer({
  messages: (state = [], action) => {
    // default values
    const flashType =
      action.content && typeof action.content.type !== 'undefined' ? action.content.type : action.flashType;
    const currentMsg = typeof action.i === 'undefined' ? {} : state[action.i];

    switch (action.type) {
      case 'FLASH':
        return [
          ...state,
          {
            _id: state.length,
            ...action.content,
            type: flashType,
            seen: false,
            show: true
          }
        ];
      case 'MARK_AS_SEEN':
        return [...state.slice(0, action.i), { ...currentMsg, seen: true }, ...state.slice(action.i + 1)];
      case 'CLEAR':
        return [...state.slice(0, action.i), { ...currentMsg, show: false }, ...state.slice(action.i + 1)];
      case 'CLEAR_SEEN':
        return state.map(message => (message.seen ? { ...message, show: false } : message));
      default:
        return state;
    }
  }
});

/*

  withMessages HOC

*/

const mapStateToProps = state => ({ messages: state.messages });
const mapDispatchToProps = dispatch => bindActionCreators(getActions().messages, dispatch);

const withMessages = component =>
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(component);

export default withMessages;
