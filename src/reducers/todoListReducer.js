const intialState = ""

export default function (state = intialState, action) {
    switch (action.type) {
        case 'user_email':
            state = action.payload
            return state;
        default:
            return state;
    }
}
