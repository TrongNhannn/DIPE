export default (state, action) => {
    switch( action.type ){
        case "setCurrentTable":
            return setCurrentTable(state, action);
            break;

        default:
            return state;
            break;
    }
}


const setCurrentTable = (state, action) => {
    return { ...state, currentTable: action.payload.table }
}
