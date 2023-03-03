import {HeaderOnly} from '~/component/Layouts';
// Đăng nhập
import Login from '~/pages/Login';

//Người dùng
import Home from '~/pages/Home';
import User from '~/pages/Users/User';
import Adduser from '~/pages/Users/Adduser'
import Updateuser from '~/pages/Users/Update';
import Changeuser from '~/pages/Users/Change';

//Cơ sở dữ liệu
import Database from '~/pages/Database/DataTable';
import Addtable from '~/pages/Database/AddTable'
import InfoTable from '~/pages/Database/Info';
import AddFields from '~/pages/Database/AddFields';
import ChangeFields from '~/pages/Database/ChangeField';
import Updatetable from '~/pages/Database/UpdateTable';

import Upload from '~/pages/Upload';



const publicRoutes = [
    { path: '/login', component: Login, layout: null},
    { path: '/', component: Home },

    //Người dùng
    { path: '/user', component: User },
    { path: '/user/add/', component: Adduser },
    { path: '/user/update/:credential_string', component: Updateuser },
    { path: '/user/change/:credential_string', component: Changeuser },

    //Cơ sở dữ liệu
    { path: '/database', component: Database },
    { path: '/database/add/table', component: Addtable },
    { path: '/database/:table_id', component:InfoTable },
    { path: '/database/add/field/:table_id', component:AddFields },
    { path: '/database/update/table/:table_id', component:Updatetable }, 
    { path: '/database/change/field/:field_id/:table_id', component:ChangeFields }, 

    { path: '/upload', component: Upload, layout: HeaderOnly},
    
];

const privateRoutes = [

];
export {
    publicRoutes,
    privateRoutes
}