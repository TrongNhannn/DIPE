var express = require('express');
var router = express.Router();
const mysqla = require('mysql2');
const { mysql } = require('../Connect/conect');
const { id } = require('../module/modulars');
const { TablesController } = require('../controller/tables-controller');
const e = require('express');
var connection = mysqla.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
function checkdata(input) {
    let valid = true;
    if (input.length === 0) {
        valid = false;
    }
    else {
        const specialChars = [" ", "*", "+"]
        for (let i = 0; i < input.length; i++) {
            const char = input[i];
            if (specialChars.indexOf(char) !== -1) {
                valid = false;
            }
        }
    }
    return valid;
}
const queryMultipleTime = (data, queries, index, callback) => {
    if (index === queries.length) {
        callback({ data });
    } else {
        const { name, query } = queries[index];
        mysql(query, (result) => {
            if (result != undefined && result.length > 0) {
                data[name] = result;
            } else {
                data[name] = []
            }
            queryMultipleTime(data, queries, index + 1, callback)
        })
    }
}

const getProjectDetailInfor = (projects, index, callback) => {
    if (index === projects.length) {
        callback({ projectDetails: projects })
    } else {
        const project = projects[index];
        const { project_id } = project;
        const queries = [
            {
                name: "partners",
                query: `
                SELECT * FROM ACCOUNT_DETAIL AS AD
                    INNER JOIN PROJECT_PARTNER AS PP ON PP.CREDENTIAL_STRING = AD.CREDENTIAL_STRING
                WHERE PROJECT_ID = ${project_id};
                `
            },
            {
                name: "recentTask",
                query: `
                SELECT * FROM TASKS AS T INNER JOIN ACCOUNT_DETAIL AS AD
                    ON AD.CREDENTIAL_STRING = T.TASK_OWNER
                WHERE PROJECT_ID = ${project_id}
                ORDER BY CHANGE_AT DESC;
                `
            },
        ]
        queryMultipleTime(project, queries, 0, ({ data }) => {
            projects[index] = data;
            getProjectDetailInfor(projects, index + 1, callback)
        })
    }
}
/// getall project
router.get('/getall', (req, res) => {
    const query = `
    SELECT * FROM PROJECTS AS P
        INNER JOIN PROJECT_STATUS AS PS ON PS.STATUS_ID = P.PROJECT_STATUS
            INNER JOIN ACCOUNT_DETAIL AS AD WHERE P.PROJECT_MASTER = AD.CREDENTIAL_STRING
    `;
    mysql(query, (result) => {
        const projects = result;
        getProjectDetailInfor(projects, 0, ({ projectDetails }) => {
            if (projectDetails.length !== 0) {
                res.status(200).send({ success: true, content: "Danh sách các dự án", projectDetails })
            }
            else {
                res.status(400).send({ success: false, content: "Lấy danh sách dự án thất bại" })
            }

        })
    })
})

const getMultipleProjectTypeInfo = (queries, index, data, callback) => {
    if (index === queries.length) {
        callback({ context: data })
    } else {
        const { query, name } = queries[index];
        mysql(query, (result) => {
            const projects = result;
            getProjectDetailInfor(projects, 0, ({ projectDetails }) => {
                if (projectDetails != undefined && projectDetails.length > 0) {
                    data[name] = {
                        success: true,
                        projectDetails
                    }
                } else {
                    data[name] = {
                        success: false
                    }
                }
                getMultipleProjectTypeInfo(queries, index + 1, data, callback)
            })
        })
    }
}
// 
router.get('/projectofuser/:credential_string', (req, res) => {
    const { credential_string } = req.params;
    const context = {}
    const queries = [
        {
            name: "own",
            query: `
                SELECT * FROM PROJECTS AS P
                    INNER JOIN ACCOUNT_DETAIL AS AD
                        ON AD.CREDENTIAL_STRING = P.PROJECT_MASTER
                            INNER JOIN PROJECT_STATUS AS PS ON P.PROJECT_STATUS = PS.STATUS_ID
                WHERE PROJECT_MASTER = '${credential_string}';
            `
        },
        {
            name: "partner",
            query: `
                SELECT * FROM PROJECTS AS P INNER JOIN PROJECT_PARTNER AS PP
                    ON P.PROJECT_ID = PP.PROJECT_ID
                        INNER JOIN ACCOUNT_DETAIL AS AD ON AD.CREDENTIAL_STRING = P.PROJECT_MASTER
                            INNER JOIN PROJECT_STATUS AS PS ON P.PROJECT_STATUS = PS.STATUS_ID
                WHERE PP.CREDENTIAL_STRING = "${credential_string}";
            `
        },
        {
            name: "use",
            query: `
                SELECT * FROM PROJECTS AS P INNER JOIN PROJECT_USER AS PP
                    ON P.PROJECT_ID = PP.PROJECT_ID
                        INNER JOIN ACCOUNT_DETAIL AS AD ON AD.CREDENTIAL_STRING = P.PROJECT_MASTER
                            INNER JOIN PROJECT_STATUS AS PS ON P.PROJECT_STATUS = PS.STATUS_ID
                WHERE PP.CREDENTIAL_STRING = "${credential_string}";
            `
        },
    ]
    getMultipleProjectTypeInfo(queries, 0, {}, ({ context }) => {
        res.status(200).send({ projects: context })
    })
});
/// get project theo ID
router.get('/:project_id', (req, res) => {
    const { project_id } = req.params;
    const query = `
        SELECT *
        FROM PROJECTS AS P
            INNER JOIN PROJECT_STATUS AS PS ON P.PROJECT_STATUS = PS.STATUS_ID
        WHERE PROJECT_ID = ${project_id}
    `;
    mysql(query, result => {
        if (result != undefined && result.length > 0) {
            const project = result[0];
            const queries = [
                {
                    name: "owner",
                    query: `
                        SELECT *
                            FROM ACCOUNT_DETAIL
                        WHERE
                            CREDENTIAL_STRING IN (
                                SELECT PROJECT_MASTER
                                FROM PROJECTS
                                WHERE PROJECT_ID = ${project_id}
                            )
                    `
                },
                {
                    name: "partners",
                    query: `
                        SELECT *
                        FROM ACCOUNT_DETAIL
                        WHERE
                            CREDENTIAL_STRING IN (
                                SELECT CREDENTIAL_STRING
                                FROM PROJECT_PARTNER
                                WHERE PROJECT_ID = ${project_id}
                            )
                    `
                },
                {
                    name: "users",
                    query: `
                        SELECT *
                        FROM ACCOUNT_DETAIL
                        WHERE
                            CREDENTIAL_STRING IN (
                                SELECT CREDENTIAL_STRING
                                FROM PROJECT_USER
                                WHERE PROJECT_ID = ${project_id}
                            )
                    `
                },
                {
                    name: "versions",
                    query: `
                        SELECT *
                        FROM VERSIONS AS V
                            INNER JOIN ACCOUNT_DETAIL AS AD ON AD.CREDENTIAL_STRING = V.PUBLISHER
                        WHERE PROJECT_ID = ${project_id};
                    `
                },
                {
                    name: "tasks",
                    query: `
                        SELECT * FROM TASKS AS T
                            INNER JOIN ACCOUNT_DETAIL AS AD
                                ON T.TASK_OWNER = AD.CREDENTIAL_STRING
                                    INNER JOIN TASK_STATUS AS TS ON TS.STATUS_ID = T.TASK_STATE
                        WHERE PROJECT_ID = ${project_id} ORDER BY CHANGE_AT DESC;
                    `
                },
                {
                    name: "taskStates",
                    query: `
                        SELECT * FROM TASK_STATUS;
                    `
                },
                {
                    name: "task_modify",
                    query: `
                        SELECT * FROM TASK_MODIFY AS TM
                            INNER JOIN TASKS AS T ON T.TASK_ID = TM.TASK_ID
                            INNER JOIN ACCOUNT_DETAIL AS AD ON AD.CREDENTIAL_STRING = TM.MODIFIED_BY
                        WHERE PROJECT_ID = ${project_id}
                        ORDER BY MODIFIED_AT DESC
                    `
                },
            ]
            queryMultipleTime({}, queries, 0, ({ data }) => {
                res.status(200).send({ success: true, content: "Thành công", data: { ...data, project } })
            })

        } else {
            res.status(404).send("404 - PAGE NOT FOUND");
        }
    })
});

// xóa partner trên dự án bằng mã người dùng
router.delete(`/delete/user/:project_id/:credential_string`, (req, res) => {
    const { project_id, credential_string } = req.params;
    const query = `
        DELETE FROM PROJECT_PARTNER
        WHERE
            CREDENTIAL_STRING = '${credential_string}' AND
            PROJECT_ID = ${project_id}
    `;
    mysql(query, result => {
        const query = `
            DELETE FROM PROJECT_USER
            WHERE
                CREDENTIAL_STRING = '${credential_string}' AND
                PROJECT_ID = ${project_id}
        `;
        mysql(query, result => {
            if (result) {
                res.status(200).send({ success: true, content: "Xóa thành công" })
            } else {
                res.status(400).send({ success: false, content: "Xóa thất bại" })
            }

        })
    })
});

/// thêm người dùng vào project
router.post('/project/addpartners/user/:project_id', async (req, res) => {
    const { project_id } = req.params;
    const { partners, users } = req.body;
    const queries = [];
    const partnerRawQueryString = [...partners, ...users].map(partner => {
        return `'${partner.credential_string}'`
    });
    const partnerQueryString = partnerRawQueryString.join(',');
    // console.log(partnerQueryString)
    const [existingUser] = await connection.promise().query(
        `SELECT * FROM accounts WHERE credential_string in (${partnerQueryString})`
    );
    if (existingUser != undefined && existingUser.length > 0) {
        const validAdmins = existingUser.filter(u => u.account_role == 'admin');
        const partnersCredentialString = validAdmins.map(partner => {
            return `(${project_id}, '${partner.credential_string}')`
        });
        const partnerTail = partnersCredentialString.join(", ");
        queries.push(
            {
                name: "partners",
                query: `INSERT INTO PROJECT_PARTNER( PROJECT_ID, CREDENTIAL_STRING) VALUES ${partnerTail}`
            }
        );
    }
    if (existingUser != undefined && existingUser.length > 0) {
        const validUsers = existingUser.filter(u => u.account_role == 'user');
        const usersCredentialString = validUsers.map(user => {
            return `(${project_id}, '${user.credential_string}')`
        });
        const userTail = usersCredentialString.join(", ");
        queries.push(
            {
                name: "users",
                query: `INSERT INTO PROJECT_USER( PROJECT_ID, CREDENTIAL_STRING) VALUES ${userTail}`
            }
        );
        queryMultipleTime({}, queries, 0, ({ success, data }) => {
            if (success) {
                res.status(400).send({ success: false })
            }
            else {
                res.status(200).send({ success: true, content: "Thêm thành công" })
            }
        })
    }
});

router.post('/create/template', (req, res) => {
    const { template, current } = req.body;
    const today = new Date();
    const date = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const number = 111;
    let result = template;
    result = result.replace("[DD]", date);
    result = result.replace("[MM]", month);
    result = result.replace("[YYYY]", year);
    const numberPlaces = [];
    for (let i = 0; i < result.length; i++) {
        if (result[i] === '[') {
            var temp = ""
            for (let j = i + 1; j < result.length; j++) {
                if (result[j] === 'N' && result[j] !== ']') {
                    temp += result[j];
                } else {
                    if (result[j] === ']') {
                        numberPlaces.push(temp);
                        i = j;
                        temp = ""
                    }
                }
            }
        }
    }
    const places = numberPlaces.map(place => {
        const placeLength = place.length;
        numberLength = number.toString().length;
        let header = "";
        for (let i = 0; i < placeLength; i++) {
            header += "0";
        }
        console.log(placeLength)
        const result = header.slice(0, placeLength - numberLength) + number.toString();
        return { place, value: result };
    })
    for (let i = 0; i < places.length; i++) {
        const { place, value } = places[i];
        console.log({ place, value })
        result = result.replace(`[${place}]`, value)
    }
    res.send(200, { result });
})
//// Tạo mới Project
router.post('/create', (req, res) => {

    const { project } = req.body;
    const { project_name, project_master, description } = project;
    const query = `CALL CREATE_PROJECT('${project_name}', 'PJ${id().toUpperCase()}', '${project_master.credential_string}', '${description}')`;
    mysql(query, result => {
        const { success, content, project_id } = result[0][0];
        if (success) {
            const query = `
            SELECT * FROM PROJECTS AS P
                INNER JOIN PROJECT_STATUS AS PS ON PS.STATUS_ID = P.PROJECT_STATUS
                    INNER JOIN ACCOUNT_DETAIL AS AD
                WHERE P.PROJECT_MASTER = AD.CREDENTIAL_STRING
                    AND PROJECT_ID = ${project_id}
            `;
            mysql(query, (result) => {
                console.log(result);
                const projects = result;
                getProjectDetailInfor(projects, 0, ({ projectDetails }) => {
                    if (projectDetails.length !== 0) {
                        res.status(200).send({ success: true, content: "Tạo project thành công", project: projectDetails[0] })
                    }
                    else {
                        res.status(400).send({ success: false, content: "Tạo project thất bại" })
                    }
                })
            })
        } else {
            res.status(400).send({ success: false, content: "Tạo project thất bại" })
        }
    })
});
/// tạo mới công việc cho dự án
router.post('/tasks/create', (req, res) => {
    const { credential_string, project_id } = req.body;
    const query = `
        INSERT INTO TASKS( project_id, task_owner, task_state, task_label, task_description )
        VALUES( ${project_id}, '${credential_string}', 1, 'Yêu cầu mới', 'Mô tả yêu cầu' );
    `;
    mysql(query, result => {
        const task_id = result.insertId;
        const query = `
            SELECT * FROM TASKS AS T
                INNER JOIN ACCOUNT_DETAIL AS AD
                    ON T.TASK_OWNER = AD.CREDENTIAL_STRING
                        INNER JOIN TASK_STATUS AS TS ON TS.STATUS_ID = T.TASK_STATE
            WHERE PROJECT_ID = ${project_id} AND TASK_ID = ${task_id};
        `;
        mysql(query, result => {
            const task = result[0];
            res.send({ success: true, content: "Tạo thành công", task })
        })
    })
});
///Chỉnh sửa công việc của dự án
router.put('/tasks/modify', (req, res) => {
    const { changes, credential_string, task_id } = req.body;
    const queries = changes.map(change => {
        return {
            name: change.name,
            query: `
                UPDATE TASKS SET ${change.name} = '${change.value}' WHERE TASK_ID = ${task_id}
            `
        }
    });
    const histories = changes.map(change => {
        return {
            name: `history_${change.name}`,
            query: `
                INSERT INTO TASK_MODIFY( task_id, modified_by, modified_what, from_value, to_value )
                VALUES ( ${task_id}, '${credential_string}', '${change.modified_what}', '${change.modified.old}', '${change.modified.new}' )
            `
        }
    })
    queryMultipleTime({}, [...queries, ...histories], 0, ({ data }) => {
        res.status(200).send({ success: true, content: "Cập nhật thành công" })
    })
});
const getTableFields = (tables, index, callback) => {
    if (index === tables.length) {
        callback({ tablesDetail: tables })
    } else {
        tables[index].getFields(({ success, fields }) => {
            if (success) {
                tables[index]["fields"] = fields.map(field => field.get());
                tables[index].getConstraints(({ constraints, success }) => {
                    if (success) {
                        tables[index]["constraint"] = constraints.map(constr => constr.get())
                    }
                    getTableFields(tables, index + 1, callback)
                })
            } else {
                getTableFields(tables, index + 1, callback)
            }
        })
    }
}
////xem version theo dự án
router.get('/project/:project_id/version/:version_id', (req, res) => {
    const { project_id, version_id } = req.params;
    const queries = [
        {
            name: "project",
            query: `
                SELECT * FROM PROJECTS WHERE PROJECT_ID = ${project_id}
            `
        },
        {
            name: "version",
            query: `
                SELECT * FROM VERSIONs WHERE PROJECT_ID = ${project_id} AND VERSION_ID = ${version_id}
            `
        },
    ]
    queryMultipleTime({}, queries, 0, ({ data }) => {
        const tablesController = new TablesController()
        tablesController.getall_based_on_version_id(version_id, ({ success, tables }) => {
            if (success) {
                getTableFields(tables, 0, ({ tablesDetail }) => {
                    if (tablesDetail.length > 0) {
                        res.send({ success: true, tablesDetail, data })
                    } else {
                        res.send({ success: false })
                    }
                })
            } else {
                res.send({ success: true, tablesDetail: [], data })
            }
        })
    })
});

router.post('/project/version/create', (req, res) => {
    const { publisher, project_id, version_name, descriptions } = req.body;
    const query = `
        INSERT INTO VERSIONS( project_id, version_name, publisher,descriptions )
        VALUES( ${project_id}, '${version_name}', '${publisher}','${descriptions}');
    `;
    mysql(query, result => {
        if (result) {
            res.send({ success: true, content: "Tạo thành công", data: result })
        }
        else {
            res.send({ success: false, content: "Thêm version thất bại" })
        }
    })
});
//
router.put('/project/version/modify', (req, res) => {
    const { version_id, version_name, descriptions } = req.body;
    const query = `
    UPDATE versions SET version_name = '${version_name}',descriptions='${descriptions}' WHERE version_id = ${version_id}
    `;
    mysql(query, result => {
        if (result) {
            res.send({ success: true, content: "Cập nhật thành công", data: result })
        }
        else {
            res.send({ success: false, content: "Cập nhật version thất bại" })
        }
    })
});
module.exports = router;