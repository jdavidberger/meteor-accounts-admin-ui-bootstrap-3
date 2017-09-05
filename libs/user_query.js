filteredUserQuery = function(userId, filter) {
	// if not an admin user don't show any other user
	if (!Roles.userIsInRole(userId, ['admin'])) {
return Meteor.users.find(userId)
}

	if (!!filter) {
		// TODO: passing to regex directly could be dangerous
		users = Meteor.users.find({
			$or: [
				{username: {$regex: filter, $options: 'i'}},
				{'emails.address': {$regex: filter, $options: 'i'}},
			],
		}, {sort: {emails: 1}})
	} else {
		users = Meteor.users.find({}, {sort: {emails: 1}})
	}
	return users
}
