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
            },
            {
                action: 'edit',
                description: 'Изменить'
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

describe('manager edit phone', () => {
    it('throw error on init Acl', () => {        
        const acl = new Acl(rules, contexts, roles);
        expect(acl.can('manager', 'phone', 'edit')).toBe(true);
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
    it('throw error on init Acl', () => {
        expect(() => {
            const acl = new Acl(rules, contexts, roles);
            acl.can('manager3', 'phone', 'edit');
        }).toThrowError();
    });
});

