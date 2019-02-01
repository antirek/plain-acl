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

const rules_with_unexist_role = {
  user: {
    phone: ['edit', 'create_not_exist'], // user can edit & create_not_exist with phone
  },
  manager: {
    phone: ['delete', 'edit'], // manager can delete & edit with phone
    not_exist_context: 'delete',
  },
  manager3: {
    phone: 'edit',
  },
};

const Acl = require('../index');

describe('manager edit phone', () => {
  it('standard situation', () => {
    const acl = new Acl(rules, contexts, roles);
    expect(acl.can('manager', 'phone', 'edit')).toBe(true);
  });
});

describe('manager', () => {
  it('context with one action', () => {
    const acl = new Acl(rules, contexts, roles);
    expect(acl.can('manager', 'data', 'print')).toBe(true);
  });
});

describe('user', () => {
  it('not assigned in rules action', () => {
    const acl = new Acl(rules, contexts, roles);
    expect(acl.can('user', 'data', 'print')).toBe(false);
  });
});

describe('manager', () => {
  it('context with action == all', () => {
    const acl = new Acl(rules, contexts, roles);
    expect(acl.can('manager', 'queue', 'translate')).toBe(true);
  });
});

describe('manager 3', () => {
  it('throw error on init Acl', () => {
    expect(() => {
      const acl = new Acl(rules_with_unexist_role, contexts, roles);
    }).toThrowError();
  });
});

describe('manager 3', () => {
  it('throw error on init Acl because manager not in roles', () => {
    expect(() => {
      const acl = new Acl(rules, contexts, roles);
      acl.can('manager3', 'phone', 'edit');
    }).toThrowError();
  });
});

