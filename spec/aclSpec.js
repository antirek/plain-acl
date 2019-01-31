// role -> context -> action

const roles_description = [
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
        phone: ['edit', 'create_not_exist'],
    },
    manager: {
        phone: ['delete', 'edit'],
        not_exist_context: ['delete'],
    },
};

const Acl = require('../index');
const acl = new Acl(rules);

describe('manager', () => {
    it('can delete phone', () => {
        expect(acl.can('manager', 'phone', 'delete')).toBe(true);
    });
    it('can edit phone', () => {
        expect(acl.can('manager', 'phone', 'edit')).toBe(true);
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
