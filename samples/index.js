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
        description: 'Изменять',
      },
      {
        action: 'delete',
        description: 'Удалить',
      },
      {
        action: 'edit_title',
        description: 'Изменить название',
      },
    ],
  },
  {
    context: 'data',
    actions: [
      {
        action: 'print',
        description: 'Print all data anywhere',
      },
    ],
  },
];

const rules = {
  user: {
    phone: ['edit', 'create_not_exist'],
  },
  manager: {
    phone: ['delete', 'edit'], // manager can delete & edit with phone
    data: ['print'],
  },
  techsupport: {
    phone: 'all',
  },
};


const Acl = require('../index');
const acl = new Acl(rules, contexts, roles);

const user = {
  role: 'manager',
};

const Table = require('tty-table');

const table = acl.getTableData();

const headers = table.headers.map(h => {return {'value': h}});
const rows = table.rows;

console.log(headers, rows);

if (acl.can(user.role, 'data', 'print')) {
  // console.log('user can print data');
  /* eslint new-cap: ["error", { "capIsNew": false }]*/
  const t3 = Table(headers, rows);
  console.log(t3.render());
}
