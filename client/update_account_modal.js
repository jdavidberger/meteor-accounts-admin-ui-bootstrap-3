'use strict'

Template.updateAccountModalInner.helpers({
	email: function() {
		if (this.emails && this.emails.length)
			{return this.emails[0].address}

		if (this.services) {
			// Iterate through services
			for (let serviceName in this.services) {
				let serviceObject = this.services[serviceName]
				// If an 'id' isset then assume valid service
				if (serviceObject.id) {
					if (serviceObject.email) {
						return serviceObject.email
					}
				}
			}
		}
		return ''
	},

	userInScope: function() {
		return Session.get('userInScope')
	},
    rolesList: function() {
		let roles = this.roles
        if (roles === undefined || roles instanceof Array)
            {return roles}

        let rtn = []
        Object.keys(roles).forEach(function(k) {
            roles[k].forEach(function(r) {
                let label = r
                if (k !== Roles.GLOBAL_GROUP) {
                    label = label + ' (' + k + ')'
                }
                rtn.push(label)
            })
        })
        return rtn
    },
	unsetRoles: function() {
		let allRoles = _.pluck(Roles.getAllRoles().fetch(), 'name')
		if (!this.roles)
			{return allRoles}
		return _.difference(allRoles, this.roles)
	},
})

Template.updateAccountModalInner.events({
	'click .add-role': function(event, template) {
		let role = this.toString()
		let userId = event.currentTarget.getAttribute('data-user-id')
		Meteor.call('addUserRole', userId, role, function(error) {
			if (error) {
				// optionally use a meteor errors package
				if (typeof Errors === 'undefined')
					{Log.error('Error: ' + error.reason)}
				else {
					Errors.throw(error.reason)
				}
			}

			// update the data in the session variable to update modal templates
			Session.set('userInScope', Meteor.users.findOne(userId))
		})
	},

	'click .remove-role': function(event, template) {
		let role = this.toString()
		let userId = event.currentTarget.getAttribute('data-user-id')

		Meteor.call('removeUserRole', userId, role, function(error) {
			if (error) {
				// optionally use a meteor errors package
				if (typeof Errors === 'undefined')
					{Log.error('Error: ' + error.reason)}
				else {
					Errors.throw(error.reason)
				}
			}

			// update the data in the session variable to update modal templates
			Session.set('userInScope', Meteor.users.findOne(userId))
		})
	},

	'change .admin-user-info': function(event, template) {
		let ele = event.currentTarget
		let userId = ele.getAttribute('data-user-id')

		Meteor.call('updateUserInfo', userId, ele.name, ele.value, function(error) {
			if (error) {
				if (typeof Errors === 'undefined') Log.error('Error: ' + error.reason)
				else Errors.throw(error.reason)
				return
			}
			Session.set('userInScope', Meteor.users.findOne(userId))
		})
	},
})
