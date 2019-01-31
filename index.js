
class Acl {    
    constructor(roles, contexts) {
        if (!roles) throw new Error('roles for init acl empty');
        this.roles = roles;

        if (contexts) {
            if (!Array.isArray(contexts)) throw new Error('contexts must be array');
            this.contexts = contexts;
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
        if (!this.roles)
            throw new Error('no acl.roles');

        if(!this.roles[role])
            throw new Error('not exist role: ' + role);

        if(this.contexts && !this._checkContextInContexts(context))
            throw new Error('not available context: ' + context);
        
        if(this.contexts && !this._checkActionInContext(action, context))
            throw new Error('not available action: ' + action + ' in context: ' + context);

        if(!this.roles[role][context]) {
            return false
        } else {
            return this.roles[role][context].includes(action);
        }
    }
}

module.exports = Acl;