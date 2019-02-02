/**
 *
 */
class Acl {
  /**
   *
   * @param {*} rules
   * @param {*} contexts
   * @param {*} roles
   */
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

  /**
   *
   * @param {*} rules
   * @return {*}
   */
  _prepareRules(rules) {
    for (const role in rules) {
      if (Object.prototype.hasOwnProperty.call(rules, role)) {
        for (const context in rules[role]) {
          if (Object.prototype.hasOwnProperty.call(rules[role], context)) {
            if (typeof(rules[role][context]) === 'string') {
              const c = [];
              c[0] = rules[role][context];
              rules[role][context] = c;
            }
          }
        }
      }
    }
    return rules;
  }

  /**
   *
   */
  _fillContextsWithAllAction() {
    if (this.contexts && Array.isArray(this.contexts)) {
      const contexts = this.contexts;
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
      });
    }
  }

  /**
   *
   */
  _checkRolesInRules() {
    const rules = this.rules;
    const roles = this.roles;
    for (const prop in rules) {
      if ({}.hasOwnProperty.call(rules, prop)) {
        const result = roles.find((item) => {
          return item.role === prop;
        });
        if (!result) throw new Error('no role: ' + prop + ' in roles list');
      }
    }
  }

  /**
   *
   * @param {*} context
   * @return {boolean}
   */
  _checkContextInContexts(context) {
    const val = this.contexts.find((item) => {
      return item['context'] === context;
    });
    return val ? true : false;
  }

  /**
   *
   * @param {*} context
   * @return {boolean}
   */
  _getContextFromContexts(context) {
    const val = this.contexts.find((item) => {
      return item['context'] === context;
    });
    return val;
  }

  /**
   *
   * @param {*} action
   * @param {*} context
   * @return {boolean}
   */
  _checkActionInContext(action, context) {
    const contextR = this._getContextFromContexts(context);
    const val = contextR.actions.find((item) => {
      return item['action'] === action;
    });
    return val ? true : false;
  }

  /**
   *
   * @param {*} role
   * @return {boolean}
   */
  _checkRoleInRoles(role) {
    const val = this.roles.find((item) => {
      return item['role'] === role;
    });
    return val ? true : false;
  }

  /**
   *
   * @param {*} role
   * @param {*} context
   * @return {boolean}
   */
  _checkAllActionInRules(role, context) {
    if (this.rules[role] && this.rules[role][context]) {
      return this.rules[role][context].includes('all');
    }
    return false;
  }

  /**
   *
   * @param {*} role
   * @param {*} context
   * @param {*} action
   * @return {boolean}
   */
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
      throw new Error('not available action: ' + action +
        ' in context: ' + context);
    }

    if (!this.rules[role][context]) {
      return false;
    } else {
      return this.rules[role][context].includes(action);
    }
  }
}

module.exports = Acl;
