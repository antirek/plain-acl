// role -> context -> action

const roles = [
  {
    role: 'begin',
    description: 'Начальный',
  },
  {
    role: 'professional',
    description: 'Профессиональный',
  },
  {
    role: 'individual',
    description: 'Индивидуальный',
  },
];

const contexts = [
  {
    context: 'incoming',
    description: 'Номера',
  },
  {
    context: 'user',
    description: 'Пользователи',
  },
  {
    context: 'phone',
    description: 'Телефоны',
  },
  {
    context: 'ivr',
    description: 'Голосовые меню',
  },
  {
    context: 'queue',
    description: 'Очереди',
  },
  {
    context: 'group',
    description: 'Группы',
  },
];

const rules = {
  begin: {
    incoming: 'all',
    user: 'all',
    ivr: 'all',
  },
  professional: {
    incoming: 'all',
    user: 'all',
    ivr: 'all',
    queue: 'all',
    group: 'all',
  },
  individual: {
    incoming: 'all',
    user: 'all',
    ivr: 'all',
    queue: 'all',
    group: 'all',
  },
};


const Acl = require('../index');
const acl = new Acl(rules, contexts, roles);

const Table = require('tty-table');

const headers = [];
headers[0] = {value: 'context'};
headers[1] = {value: 'action'};
roles.map((role) => {
  headers.push({
    value: role.description,
  });
});

const rows = [];
contexts.forEach((context) => {
  // console.log('context', context.context);
  if (!context.actions) {
    context.actions = [{action: 'all'}];
  }
  context.actions.forEach((action) => {
    const row = [];
    row[0] = context.context;
    row[1] = action.action;
    console.log('action', action.action);
    roles.forEach((role) => {
      console.log('role', role.role);
      row.push(acl.can(role.role, context.context, action.action) ?
        'yes' : 'no');
    });
    rows.push(row);
  });
});

/* eslint new-cap: ["error", { "capIsNew": false }]*/
const t3 = Table(headers, rows);
console.log(t3.render());
