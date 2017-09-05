'use strict'

Meteor.startup(function() {
	// Create Admin role if it doesn't exist
	Meteor.call('createRoleIfUndefined', 'admin')
})
