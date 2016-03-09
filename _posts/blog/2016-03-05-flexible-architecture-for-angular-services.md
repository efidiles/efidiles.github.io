---
layout: post

title: Flexible architecture for Angular services

excerpt: "A robust architecture for Angular services that behave like singletons during the application's life cycle."

---

Moving logic to the services is always good practice and making the services easy to use and pass around is what makes the Angular development an enjoyable experience.


The following article describes a robust architecture for Angular services that need to behave like singletons during the application's life cycle. An example of such service is the  'currently logged in user' service (`CurrentUser` from now long).


In short, the architecture can be described as: **a promise which gets decorated with the data after it's resolved**.


This architecture offers the following benefits:

- trivial to use in resolve phases - just needs to be injected and returned from the resolve function
- since it's a promise, it can be used as a then-able in controllers. With the exception of route's controller where it makes more sense and it's more elegant to inject it through the route's resolve phase
- can be easily injected and used in other services in the same way we work with any other promise (as .then-able)
- templates can bind directly on the 'promised' properties. Even if the primitives are not yet available on the service until the promise is resolved (more about this below).  


{% highlight javascript %}
(function () {
  'use strict';

  angular
    .module('app.shared')
    .factory('CurrentUser', CurrentUser);

  /* @ngInject */
  function CurrentUser($rootScope, _, $q, Authentication, Restangular, RestAPI,
    AccountService) {

    var path = 'current-user';
    var rolePath = 'role';
    var invalidCache = true;
    var isUserLoggedIn = Authentication.check();
    var instanceDefaults = {
      permissions: {},
      account: {},
      accessAdvertisers: false,
      accessAgencies: false,
      accessHoldings: false
    };
    var cachedInstance;
    var thisService;

    $rootScope.$on('auth:login', _checkCache);
    $rootScope.$on('auth:logout', _invalidateCache);

    thisService = Restangular.withConfig(_configureService).service(path);

    // If the user is authenticated (has token)
    if (invalidCache && isUserLoggedIn) {
      invalidCache = false;
      var currentUserPromise = thisService.fetchCurrentUserData();
      cachedInstance = _.assign(currentUserPromise,
        _.cloneDeep(instanceDefaults));
    } else {
      // Return empty promise if not authenticated
      var emptyPromise = $q.resolve();
      cachedInstance = _.assign(emptyPromise, _.cloneDeep(instanceDefaults));
    }

    return cachedInstance;

    // Private declarations

    /**
     * Configure the service with custom REST methods
     * @param RestangularConfigurer
     */
    function _configureService(RestangularConfigurer) {
      RestangularConfigurer.addElementTransformer(path, _addElementMethods);
    }

    /**
     * Add element specific custom methods
     * @param currentUser
     * @returns {*}
     */
    function _addElementMethods(userService) {
      userService.addRestangularMethod('getRole', 'get', rolePath);

      userService.fetchCurrentUserData =
        _fetchCurrentUserData.bind(userService);

      return userService;
    }

    function _fetchCurrentUserData() {
      /*jshint validthis: true */

      var self = this;
      var currentUser;

      return self.get()
        .then(_getAccountAndRole)
        .then(_populateWithData)
        .catch(_reportError.bind(null, 'Could not fetch user data'));

      function _getAccountAndRole(user) {
        if (!user.id) {
          return $q.reject();
        }

        currentUser = user.plain();

        var fetchRoleTask = self.getRole();
        var fetchAccountTask = AccountService.one(user.account_id).get();

        return $q.all([fetchRoleTask, fetchAccountTask]);
      }

      function _populateWithData(data) {
        var role = data[0].plain();
        var account = data[1].plain();
        var permissions;

        _setPermissions();

        // Make sure we keep references of the cachedInstance and its nested
        // objects. Don't override them with new objects. Eg: permissions
        // property - we can not simply assign a new object to
        // cachedInstance.permissions because it will allocate a new memory
        // address and will break bindings in templates. Instead we need to
        // clear the contents of permissions object and add new props. This way
        // all the existing bindings still work because they target the same
        // memory location not the memory location of newly created objects.

        // We need to clear existing properties and then assign them in order
        // to prevent accumulating permissions from previous sessions.
        _.map(cachedInstance.permissions, _removeProperty);

        currentUser.permissions =
          _.assign(cachedInstance.permissions, permissions);
        currentUser.account = _.assign(cachedInstance.account, account);

        _.assign(cachedInstance, currentUser);

        // Just decorating the service with the data is not enough because when
        // the service is used in route's resolve methods the data we return
        // here will be what's injected and available in the controller.
        // Don't return the cachedInstance (the promise itself) because of
        // circular referencing. Instead extend currentUser with the same
        // properties and return it.
        return currentUser;

        function _removeProperty(val, prop, object) {
          delete object[prop];
        }

        function _setPermissions() {
          permissions = _.reduce(role.permissions, function (result, value) {
            var key = _.camelCase(value);
            result[key] = true;
            return result;
          }, {});
        }
      }
    }

    /**
     * This method refreshes the cached instance.
     * It is intended to run when the user logs in.
     * @method _checkCache
     */
    function _checkCache() {
      if (invalidCache) {
        var currentUserPromise = thisService.fetchCurrentUserData();
        _.assign(cachedInstance, currentUserPromise);
        invalidCache = false;
      }
    }

    /**
     * This method clears the permissions object.
     * It is intended to run when the user logs out.
     * @method _invalidateCache
     */
    function _invalidateCache() {
      invalidCache = true;
    }

    function _reportError(message) {
      angular.notify('success', message);
    }
  }
})();
{% endhighlight %}


A few comments about the way this service works:

{% highlight javascript %}
if (invalidCache && isUserLoggedIn) {
  invalidCache = false;
  var currentUserPromise = thisService.fetchCurrentUserData();
  cachedInstance = _.assign(currentUserPromise, _.cloneDeep(instanceDefaults));
} else {
  // Return empty promise if not authenticated
  var emptyPromise = $q.resolve();
  cachedInstance = _.assign(emptyPromise, _.cloneDeep(instanceDefaults));
}
{% endhighlight %}

which translates to:

{% highlight %}
if (cache is not set and we have an auth token) {
  1. fetch the current user data from the api and
  2. decorate this service with the promise created by the above fetch
} else {
  return an empty resolved promise
}
{% endhighlight %}

If the `else` branch is executed, we will go through the same process again when the `auth:login` event is triggered. The following piece of code does that:

{% highlight javascript %}
$rootScope.$on('auth:login', _checkCache);
{% endhighlight %}

A very important bit is the `_populateWithData` function:


In order to preserve the bindings which may be set on this service before the data is resolved, we need to make sure that we pre-create the entire tree of nested objects that this service will have.
Also we have to make sure that we are never overriding any of these nested object references once we created them because the template bindings could be linked to the old objects which won't receive the new data if we override references instead of extending existing references with new data.


With the above explanations and the comments in the code it should now be fairly clear what `_populateWithData` does and why it does it in that way.


Examples of usage:

- in route's resolve if we need to guarantee that the data is available by the time we reach the controller:
{% highlight javascript %}
{
  ...,
  resolve: {
  currentUser: function (CurrentUser) {
    return CurrentUser;
  }
}
{% endhighlight %}
 In controller the data will be ready when we inject the currentUser.

- in the controllers / service the CurrentUser is .then-able:
{% highlight javascript %}
 function Controller(CurrentUser) {
  CurrentUser.then(function(currentUser) {
    ...
  });
 }
{% endhighlight %}
- bindings in templates:
{% highlight javascript %}
function Controller($scope, CurrentUser) {
	$scope.currentUser = CurrentUser;
}
{% endhighlight %}
{% highlight html %}
<p ng-if="currentUser.permissions.writeCampaigns">I can write campaigns</p>
{% endhighlight %}
Initially `writeCampaigns` doesn't exist on `currentUser.permissions` but as soon as the promise is resolved, the values will be
available and will display in templates in the next digest cycle.


The drawback with this approach is that it can easily be broken if the maintainer doesn't have a deep understanding of the architecture. Eg.: by overriding object references which lead to breaking template bindings.


But of course this can be overcome with good unit testing.


Hope you'll find this useful and happy coding.
