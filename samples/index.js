// role -> context -> action

const roles = [
    {
        role: 'user',
        description: 'Пользователь',
    },
    {
        role: 'manager',
        description: 'Менеджер',
    },
    {
        role: 'techsupport',
        description: 'Инженер техподдержки',
    },
];

const contexts = [
    {
        context: 'phone',
        description: '',
        actions: [
            {
                action: 'edit',
                description: 'Изменять'
            },
            {
                action: 'delete',
                description: 'Удалить',
            },
            {
                action: 'edit_title',
                description: 'Изменить название',
            }
        ]
    },
    {
        context: 'data',
        actions: [
            {
                action: 'print',
                description: 'Print all data anywhere',
            }
        ]
    }
];

const rules = {
    user: {
        phone: ['edit', 'create_not_exist'],   // user can edit & create_not_exist with phone
    },
    manager: {
        phone: ['delete', 'edit'],             // manager can delete & edit with phone
        data: ['print'],
    },
    techsupport: {
        phone: "all"
    }
};


const Acl = require('../index');
const acl = new Acl(rules, contexts, roles);

const user = {
    role: 'manager'
}

let Table = require('tty-table');

let headers = []
headers[0] = {value: 'context'};
headers[1] = {value: 'action'};
roles.map((role) => {
    headers.push({
        value: role.description
    });
});

let rows = [];
contexts.forEach((context) => {
    //console.log('context', context.context);
    context.actions.forEach((action) => {
        let row = [];
        row[0] = context.context;
        row[1] = action.action;
        console.log('action', action.action);
        roles.forEach((role) => {
            console.log('role', role.role);
            row.push(acl.can(role.role, context.context, action.action) ? 'yes' : 'no')
        })
        rows.push(row);
    })
})

if (acl.can(user.role, 'data', 'print')) {
    console.log('user can print data');
    let t3 = Table(headers, rows);
    console.log(t3.render())
}