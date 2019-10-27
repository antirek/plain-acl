// role -> context -> action

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
const expressMiddlewareFunction = acl.middleware({debug: true});
const res = {};
const next = () => {};

describe('express middleware', () => {
  it('check manager can delete phone', () => {
    const req = {
      user: {
        role: 'manager',
      },
    };
    expressMiddlewareFunction(req, res, next);
    expect(req.aclCheck('phone', 'delete')).toBe(true);
  });

  it('check user cant delete phone', () => {
    const req = {
      user: {
        role: 'user',
      },
    };
    expressMiddlewareFunction(req, res, next);
    expect(req.aclCheck('phone', 'delete')).toBe(false);
  });
});

