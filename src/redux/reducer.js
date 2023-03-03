import auth from './branches/auth';
import db from './branches/db';

const initState = {
    unique_string: "dipev1",
    proxy: "http://192.168.15.205:3000",
    is_signed: false,
    credential: {
        account_role: "admin"
    },
    currentTable: { fields: [] },
    page: {},
    axis: {
        mouseState: "up",
        x: -72,  y: 0
    },

    editSection: false,

    blocks: [ "block", "flex" ],
    contents: ["text"],

    currentEditting: {},

    elements: {
        children: [
            {
                id: "-1",
                type: "block",
                style: {
                    width: "100%",
                    height: "100vh",
                    position: "relative",
                },
                children: [
                    {
                        id: "00",
                        type: "block",
                        style: {
                            width: "100%",
                            padding: "1em",
                            border: "1px solid #ccc"
                        },
                        children: [
                            {  id: "000", type: "text", content: "Ủa ngộ he", style: { display: "block", padding: "12px", fontSize: "24px" } },
                            {  id: "001", type: "text", content: "Cái dì dị", style: { display: "block", padding: "12px", marginTop: "8px", fontSize: "24px" } },
                        ],
                    },
                    {
                        id: "01",
                        type: "flexible",
                        style: {
                            display: "flex",
                            width: "100%",
                            padding: "1em",
                            marginTop: "16px"
                        },
                        children: [
                            {
                                id: "010",
                                type: "block",
                                style: {
                                    width: "50%",
                                    padding: "1em",
                                    border: "1px solid #ccc"
                                },
                                children: [
                                    { id: "0100", type: "text", content: "Ủa ngộ he", style: { display: "block", padding: "12px", fontSize: "24px" } },
                                    {
                                        id: "0101",
                                        type: "block",
                                        style: {
                                            width: "50%",
                                            padding: "1em",
                                            border: "1px solid #ccc"
                                        },
                                        children: [
                                            {  id: "01010", type: "text", content: "U là trời", style: { display: "block", padding: "12px", marginTop: "8px", fontSize: "24px" } },
                                        ],
                                    },
                                ],
                            },
                            {
                                id: "011",
                                type: "block",
                                style: {
                                    width: "50%",
                                    padding: "1em",
                                    border: "1px solid #ccc"
                                },
                                children: [
                                    {  id: "0110", type: "text", content: "Cái dì dị", style: { display: "block", padding: "12px", marginTop: "8px", fontSize: "24px" } },
                                ],
                            },
                        ]
                    }
                ]
            }
        ]
    }
}

export default ( state = initState, action ) => {
    switch (action.branch) {

        case "db":
            return db(state, action)
            break;

        default:
            return auth(state, action);
    }
}
