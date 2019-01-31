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

const rules = {
    user: {
        phone: ['edit', 'create_not_exist'],   // user can edit & create_not_exist with phone
    },
    manager: {
        phone: ['delete', 'edit'],             // manager can delete & edit with phone
        not_exist_context: ['delete'],
    },
};

const rules_with_unexist_role = {
    user: {
        phone: ['edit', 'create_not_exist'],   // user can edit & create_not_exist with phone
    },
    manager: {
        phone: ['delete', 'edit'],             // manager can delete & edit with phone
        not_exist_context: ['delete'],
    },
    manager3: {
        phone: ['edit']
    }
};

const Acl = require('../index');
const acl = new Acl(rules, contexts, roles);

describe('manager 3', () => {
    it('throw error on init Acl', () => {
        expect(() => {
            const acl = new Acl(rules_with_unexist_role, contexts, roles);
        }).toThrowError();
    });
});
