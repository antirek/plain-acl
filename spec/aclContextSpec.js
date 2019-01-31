// role -> context -> action

const roles = [
    {
        role: 'user',
        description: 'Простой пользователь'
    },
    {
        role: 'manager',
        description: 'Менеджер'
    },
    {
        role: 'manager2',
        description: 'менеджер 2-го типа'
    }
];

const contexts = [
    {
        context: 'phone',
        description: '',
        actions: [
            {
                action: 'delete',
                description: 'Удалить'
            },
            {
                action: 'edit_title',
                description: 'Изменить название'
            }
        ]
    }
];

const roles_contexts_actions = {
    user: {
        phone: ['edit', 'create_not_exist'],   // user can edit & create_not_exist with phone
    },
    manager: {
        phone: ['delete', 'edit'],             // manager can delete & edit with phone
        not_exist_context: ['delete'],
    },
};

const Acl = require('../index');
const acl = new Acl(roles_contexts_actions, contexts);

describe('manager', () => {
    it('can delete phone', () => {
        expect(acl.can('manager', 'phone', 'delete')).toBe(true);
    });
    it('can edit phone', () => {
        expect(() => {
            acl.can('manager', 'phone', 'edit')
        }).toThrowError();
    });
});

describe('manager2', () => {    
    it('can create phone', () => {
        //not exist role throw Error
        expect(() => {
            acl.can('manager2', 'phone', 'create');
        }).toThrowError('not exist role: manager2');
    });
});

describe('user', () => {
    it('can\'t delete phone', () => {
        expect(acl.can('user', 'phone', 'delete')).toBe(false);
    });
});
