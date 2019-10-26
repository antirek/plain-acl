// role -> context -> action

const roles = [
  {
    role: 'user',
    description: 'Простой пользователь',
  },
  {
    role: 'manager',
    description: 'Менеджер',
  },
  {
    role: 'manager2',
    description: 'менеджер 2-го типа',
  },
];

const contexts = [
  {
    context: 'phone',
    description: '',
    actions: [
      {
        action: 'delete',
        description: 'Удалить',
      },
      {
        action: 'edit_title',
        description: 'Изменить название',
      },
      {
        action: 'edit',
        description: 'Изменить',
      },
    ],
  },
  {
    context: 'data',
    description: '',
    actions: [
      {
        action: 'print',
        description: 'Print all',
      },
    ],
  },
  {
    context: 'queue',
    description: '',
    actions: [],
  },
];

const rules = {
  user: {
    phone: ['edit', 'create_not_exist'], // user can edit &
    // create_not_exist with phone
  },
  manager: {
    phone: ['delete', 'edit'], // manager can delete & edit with phone
    not_exist_context: ['delete'],
    data: 'print', // can use string also instead array
    queue: 'all',
  },
};

const headers = [
  'context',
  'action',
  'Простой пользователь',
  'Менеджер',
  'менеджер 2-го типа'
];

const rows = [ 
  [ 'phone', 'delete', 'no', 'yes', 'no' ],
  [ 'phone', 'edit_title', 'no', 'no', 'no' ],
  [ 'phone', 'edit', 'yes', 'yes', 'no' ],
  [ 'phone', 'all', 'no', 'no', 'no' ],
  [ 'data', 'print', 'no', 'yes', 'no' ],
  [ 'data', 'all', 'no', 'no', 'no' ],
  [ 'queue', 'all', 'no', 'yes', 'no' ] 
];

const Acl = require('../index');

describe('manager edit phone', () => {
  it('standard situation', () => {
    const acl = new Acl(rules, contexts, roles);

    const table = acl.getTableData();
    // console.log(table.headers);
    expect(table.headers).toEqual(headers);

    // console.log(table.rows);
    expect(table.rows).toEqual(rows);
  });
});