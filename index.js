
class Acl {    
    constructor(roles) {
        if (!roles) throw new Error('roles for init acl empty');
        this.roles = roles;
    }

    can(role, context, action) {        
        if (!this.roles) throw new Error('no acl.roles');

        if(!this.roles[role]) throw new Error('not exist role: ' + role);

        if(!this.roles[role][context]) {
            return false
        } else {
            return this.roles[role][context].includes(action);
        }
    }
}

module.exports = Acl;