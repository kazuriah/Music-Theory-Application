import { KEY_CHANGE, QUALITY_CHANGE } from '../actions/keys';

export const reducer = (state = { currentKey: 'Cmaj', quality: 'major' }, action) => {
    switch(action.type) {
        case KEY_CHANGE: {
            return Object.assign({}, { currentKey: action.newKey}, ...state);
        }
        case QUALITY_CHANGE: {
            return Object.assign({}, { currentKey: `${state.currentKey.charAt(0)}${action.quality}` });
        }
        default:
            return state;
    }
};
