Template.accountsAdmin.helpers({
    niceDisplay: function(roles) {
      if (roles === undefined || roles instanceof Array)
        {return roles;}

      let rtn = [];
        Object.keys(roles).forEach(function(k) {
          roles[k].forEach(function(r) {
            let label = r;
            if (k !== Roles.GLOBAL_GROUP) {
              label = label + ' (' + k + ')'
            }
            rtn.push(label);
          });
        });
        return rtn;
    },
  currentItems: function() {
    // Get number of current page
    let currentPage = Template.instance().pagination.currentPage();
    // Get number of per page
    let perPage = Template.instance().pagination.perPage();
    // Get number of total items
    let totalItems = Template.instance().pagination.totalItems();
    // Compute right side of border for current items order
    let rightSide = currentPage * perPage > totalItems ? totalItems : currentPage * perPage;
    // Compute left side of border for current items order. It can be zero if no search result is.
    let leftSide = rightSide > 0 ? 1 + perPage * (currentPage - 1) : 0;
    return leftSide + ' - ' + rightSide;
  },
  totalItems: function() {
    // Return number of all items
    return Template.instance().pagination.totalItems();
  },
  email: function() {
    if (this.emails && this.emails.length)
      {return this.emails[0].address;}

    if (this.services) {
      // Iterate through services
      for (let serviceName in this.services) {
        let serviceObject = this.services[serviceName];
        // If an 'id' isset then assume valid service
        if (serviceObject.id) {
          if (serviceObject.email) {
            return serviceObject.email;
          }
        }
      }
    }
    return '';
  },
  searchFilter: function() {
    return Session.get('userFilter');
  },
  myself: function(userId) {
    return Meteor.userId() === userId;
  },
  templatePagination: function() {
    // Get reference of pagination
    return Template.instance().pagination;
  },
  users: function() {
    // Get reference of pagination
    let pagination = Template.instance().pagination;
    // Get
    let userFilter = Session.get('userFilter');
    // Set empty filter on default
    let filter = {};
    // If user try to find something, edit filter
    if (!!userFilter) {
      filter = {
        $or: [
          {username: {$regex: userFilter, $options: 'i'}},
          {'emails.address': {$regex: userFilter, $options: 'i'}},
        ],
      };
    }
    // Apply filter for selection
    pagination.filters(filter);
    // Return the values for the current page
    return pagination.getPage();
  },
});

Template.accountsAdmin.onCreated(function() {
  // Set initial settings of pagination
  this.pagination = new Meteor.Pagination(Meteor.users, {
    // TODO: configurable limit
    // Count of records in table
    perPage: 25,
    // Set sort
    sort: {emails: 1},
  });
});

// search no more than 2 times per second
let setUserFilter = _.throttle(function(template) {
  let search = template.find('.search-input-filter').value;
  Session.set('userFilter', search);
}, 500);

Template.accountsAdmin.events({
  'keyup .search-input-filter': function(event, template) {
    setUserFilter(template);
    return false;
  },

  'click .glyphicon-trash': function(event, template) {
    Session.set('userInScope', this);
  },

  'click .glyphicon-info-sign': function(event, template) {
    Session.set('userInScope', this);
  },

  'click .glyphicon-pencil': function(event, template) {
    Session.set('userInScope', this);
  },
});

Template.accountsAdmin.onRendered(function() {
  let searchElement = document.getElementsByClassName('search-input-filter');
  if (!searchElement)
    {return;}
  let filterValue = Session.get('userFilter');

  let pos = 0;
  if (filterValue)
    {pos = filterValue.length;}

  searchElement[0].focus();
  searchElement[0].setSelectionRange(pos, pos);
});
