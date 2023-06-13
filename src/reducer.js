
export const initialState = {
    user:{
        login:false
    },
}

function reducer(state,action){
    switch(action.type){
        case 'SET_USER_LOGIN':
            return {
                ...state,
                user : {
                    login : action.userLogin
                }
            }
        default:
            return state;
    }
}


export default reducer;