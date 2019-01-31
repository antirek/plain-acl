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
    ],
  },
];

const rules = {
  user: {
    phone: ['edit', 'create_not_exist'], // user can edit & create_not_exist with phone
  },
  manager: {
    phone: ['delete', 'edit'], // manager can delete & edit with phone
    not_exist_context: ['delete'],
  },
};

const Acl = require('../index');
const acl = new Acl(rules, contexts);

describe('manager', () => {
  it('can delete phone', () => {
    expect(acl.can('manager', 'phone', 'delete')).toBe(true);
  });
  it('can edit phone', () => {
    expect(() => {
      acl.can('manager', 'phone', 'edit');
    }).toThrowError();
  });
});

describe('manager2', () => {
  it('can create phone', () => {
    expect(acl.can('manager2', 'phone', 'create')).toBe(false);
  });
});

describe('user', () => {
  it('can\'t delete phone', () => {
    expect(acl.can('user', 'phone', 'delete')).toBe(false);
  });
});
