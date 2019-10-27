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
   * @return {*}
   */
  getData() {
    return {
      roles: this.roles,
      contexts: this.contexts,
      rules: this.rules,
    };
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

  /**
   *
   * @return {*}
   */
  getTableData() {
    const headers = [];
    headers[0] = 'context';
    headers[1] = 'action';

    this.roles.map((role) => {
      headers.push(role.description);
    });

    const rows = [];
    this.contexts.forEach((context) => {
      context.actions.forEach((action) => {
        const row = [];
        row[0] = context.context;
        row[1] = action.action;
        this.roles.forEach((role) => {
          row.push(this.can(role.role, context.context, action.action) ?
            'yes' : 'no');
        });
        rows.push(row);
      });
    });

    return {
      headers,
      rows,
    };
  }


  /**
   *
   * @param {*} role
   * @return {*}
   */
  getRulesByRole(role) {
    const rulesForRole = this.rules[role];
    if (!rulesForRole) return;

    const rules = [];

    const f = (key) => {
      const context = this.contexts.find((context) => context.context === key);
      if (!context || !context.actions) return;

      const rulesInContext = rulesForRole[key];
      const availableActions = context.actions.filter((action) => {
        return rulesInContext.includes(action.action);
      });

      const availableActions2 = availableActions.map((action) => {
        return Object.assign(action, {context: context.context});
      });

      availableActions2.map((action) => {
        rules.push(action);
      });
    };

    for (const key in rulesForRole) {
      if ({}.hasOwnProperty.call(rulesForRole, key)) {
        f(key);
      }
    }

    return rules;
  }

  /**
   *
   * @param {*} param0
   * @return {*}
   */
  middleware({debug}) {
    return (req, res, next) => {
      /**
       * @param {string} context
       * @param {string} action
       * @return {boolean}
       * @description check true or false
       */
      req.aclCheck = (context, action) => {
        if (!this.can(req.user.role, context, action)) {
          if (debug) {
            console.log('restriction access', req.originalUrl,
                req.user, context, action);
          }
          return false;
        }
        return true;
      };

      /**
       * @param {string} context
       * @param {string} action
       * @return {boolean}
       * @description reject with 403 http
       */
      req.aclReject = (context, action) => {
        if (!req.aclCheck(context, action)) {
          res.status(403).jsend.fail('no access');
          res.end();
          return false;
        }
        return true;
      };
      next();
    };
  }
}

module.exports = Acl;
