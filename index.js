
class Acl {
  constructor(rules, contexts, roles) {
    if (!rules) throw new Error('rules for init acl empty');
    this.rules = this._prepareRules(rules);

    if (contexts) {
      if (!Array.isArray(contexts)) throw new Error('contexts must be array');
      this.contexts = contexts;
      this._fillContextsWithAllAction();
    }

    if (roles) {
      if (!Array.isArray(contexts)) throw new Error('roles must be array');
      this.roles = roles;
      this._checkRolesInRules();
    }
  }

  _prepareRules(rules) {
    for (const role in rules) {
      for (const context in rules[role]) {
        // console.log('context', context);
        if (typeof(rules[role][context]) === 'string') {
          const c = [];
          c[0] = rules[role][context];
          rules[role][context] = c;
        }
      }
    }
    // console.log('rules', rules);
    return rules;
  }

  _fillContextsWithAllAction () {
    if (this.contexts && Array.isArray(this.contexts)){ 
      let contexts = this.contexts;
      this.contexts = contexts.map((context) => {
        let actions = context.actions;
        if (!actions) {
          actions = [{action: 'all'}];
          context.actions = actions;
          return context;
        }
        if (actions && Array.isArray(actions)) {
          if (!actions.find((action) => {
            return action.action == 'all';
          })) {
            actions.push({action: 'all'});
          }
          return context;
        }
      })
    }
  }

  _checkRolesInRules() {
    const rules = this.rules;
    const roles = this.roles;
    for (const prop in rules) {
      const result = roles.find((item) => {
        return item.role === prop;
      });
      if (!result) throw new Error('no role: ' + prop + ' in roles list');
    }
  }

  _checkContextInContexts(context) {
    //console.log('context', context);
    const val = this.contexts.filter((item) => {
      return item['context'] === context;
    });
    return val.length > 0 ? true : false;
  }

  _getContextFromContexts(context) {
    const val = this.contexts.filter((item) => {
      return item['context'] === context;
    });
    return val[0];
  }

  _checkActionInContext(action, context) {
    const contextR = this._getContextFromContexts(context);
    const val = contextR.actions.filter((item) => {
      return item['action'] === action;
    });
    return val.length > 0 ? true : false;
  }

  _checkRoleInRoles(role) {
    const val = this.roles.filter((item) => {
      return item['role'] === role;
    });
    return val.length > 0 ? true : false;
  }

  _checkAllActionInRules(role, context) {
    if (this.rules[role] && this.rules[role][context]) {
      return this.rules[role][context].includes('all');
    }
    return false;
  }

  can(role, context, action = 'all') {
    if (this.roles && !this._checkRoleInRoles(role)) {
      throw new Error('not exist role: ' + role + ' in acl.roles');
    }

    if (!this.rules[role]) return false;

    if (this.contexts && !this._checkContextInContexts(context)) {
      throw new Error('not available context: ' + context);
    }

    if (this.contexts && this._checkAllActionInRules(role, context)) {
      return true;
    }

    if (this.contexts && !this._checkActionInContext(action, context)) {
      throw new Error('not available action: ' + action + ' in context: ' + context);
    }

    if (!this.rules[role][context]) {
      return false;
    } else {
      return this.rules[role][context].includes(action);
    }
  }
}

module.exports = Acl;
