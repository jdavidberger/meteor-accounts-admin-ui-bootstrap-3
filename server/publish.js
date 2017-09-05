'use strict'

Meteor.publish('roles', function() {
	return Meteor.roles.find({})
})

Meteor.publish('filteredUsers', function(filter) {
	return filteredUserQuery(this.userId, filter)
})

new Meteor.Pagination(Meteor.users)
