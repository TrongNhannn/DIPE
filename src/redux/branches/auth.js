export default (state, action) => {
    switch( action.type ){
        case "setUniqueString":

            const { unique_string } = action.payload;

            return {...state, unique_string}

            break;

        case "setSession":
            const { session } = action.payload;
            if( session ){

                return { ...state, is_signed: true, credential: session }
            }
            else{
                return { ...state, is_signed: false }
            }
            break;
            
        default:
            return state;
            break;
    }
}
