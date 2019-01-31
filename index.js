
class Acl {    
    constructor(rules, contexts, roles) {
        if (!rules) throw new Error('rules for init acl empty');
        this.rules = this._prepareRules(rules);

        if (contexts) {
            if (!Array.isArray(contexts)) throw new Error('contexts must be array');
            this.contexts = contexts;
        }

        if (roles) {
            if (!Array.isArray(contexts)) throw new Error('roles must be array');
            this.roles = roles;
            this._checkRolesInRules();
        }
    }

    _prepareRules (rules) {
        for (let role in rules) {
            for (let context in rules[role]) {
                //console.log('context', context);
                if (typeof(rules[role][context]) === 'string') {
                    let c = [];
                    c[0] = rules[role][context];
                    rules[role][context] = c;
                }
            }
        }
        //console.log('rules', rules);
        return rules;
    }

    _checkRolesInRules () {
        let rules = this.rules;
        let roles = this.roles;
        for (let prop in rules) {
            let result = roles.find(item => {
                return item.role === prop;
            })
            if (!result) throw new Error('no role: ' + prop + ' in roles list');
        }
    }

    _checkContextInContexts (context) {
        let val = this.contexts.filter((item) => {
            return item['context'] === context;
        })
        return val.length > 0 ? true : false;
    }

    _getContextFromContexts (context) {
        let val = this.contexts.filter((item) => {
            return item['context'] === context;
        })
        return val[0];
    }

    _checkActionInContext (action, context) {
        let contextR = this._getContextFromContexts(context);
        let val = contextR.actions.filter((item) => {
            return (item['action'] === action) || 
                   (item['action'] === 'all');
        })
        return val.length > 0 ? true : false;
    }

    _checkRoleInRoles (role) {
        let val = this.roles.filter((item) => {
            return item['role'] === role;
        })
        return val.length > 0 ? true : false;
    }

    _checkAllActionInRules (role, context) {
        return this.rules[role][context].includes('all');
    }

    can(role, context, action) {
        if(this.roles && !this._checkRoleInRoles(role))
            throw new Error('not exist role: ' + role + ' in acl.roles');
        
        if(!this.rules[role]) return false;

        if(this.contexts && !this._checkContextInContexts(context))
            throw new Error('not available context: ' + context);

        if(this.contexts && this._checkAllActionInRules(role, context))
            return true;
        
        if(this.contexts && !this._checkActionInContext(action, context))
            throw new Error('not available action: ' + action + ' in context: ' + context);

        if(!this.rules[role][context]) {
            return false
        } else {
            return this.rules[role][context].includes(action);
        }
    }
}

module.exports = Acl;