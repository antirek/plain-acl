
class Acl {    
    constructor(rules, contexts, roles) {
        if (!rules) throw new Error('roles for init acl empty');
        this.rules = rules;

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
            return item['action'] === action;
        })
        return val.length > 0 ? true : false;
    }

    can(role, context, action) {
        if(this.roles && !this.roles[role])
            throw new Error('not exist role: ' + role + ' in acl.roles');
        
        if(!this.rules[role]) return false;

        if(this.contexts && !this._checkContextInContexts(context))
            throw new Error('not available context: ' + context);

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