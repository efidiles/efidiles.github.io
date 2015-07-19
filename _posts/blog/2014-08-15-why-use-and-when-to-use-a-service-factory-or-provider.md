---
layout: post

title: Why use and when to use a service, factory or provider

excerpt: "A practical example which clarifies the differences between services, factories and providers in AngularJS."

---

Any AngularJS developer knows that there are three different ways of declaring a service: 

* using a **"factory declaration"**

* using a **"service declaration"**

* using a **"provider declaration"**

Instead of insisting too much about the theoretical differences between these three (a topic already covered in many articles over the internet), I prefer to highlight three use cases when each of them is particularily suitable. 

 

###1. Example where a factory declaration is the most suitable to use

Let's say we want to create a custom type (NotificationsQueue) which we want to use (inject) across our Angular app. Therefore we need to create a constructor, define the prototype and think of a way to pass our constructor through the app.

Since in Angular a "factory declaration" it's basically a function which returns a value we can easily identify that this is the most appropriate way of defining our new type in an Angular world.

Example of code:

{% highlight javascript linenos %}
.factory('NotificationsQueue', function () {

  //define the constructor
  function NotificationsQueueConstructor(params) {
    this.queue = [];
    ...
  }

  //define the prototype
  NotificationsQueueConstructor.prototype.add = 
  function() {
    ...
  };

  //this is the important bit
  return NotificationsQueueConstructor;

}); 
{% endhighlight %}

We can then inject and create instances of our newly created type anywhere in our Angular app.

Eg: 

{% highlight javascript linenos %}
.controller(
  'SomeController', 
  function (NotificationQueue){ 
    //this is the important bit
    var nq = new NotificationQueue();
    ...
  }
);
{% endhighlight %}

*Because the NotificationQueue is declared using a factory, the NotificationQueue parameter in the above controller will be the returned value of the NotificationQueue factory declaration - which is the NotificationsQueueConstructor.*

Why not use a "service declaration"?

Because a "service declaration" injects an instance of an object. Inside a "service declaration" you are actually inside a constructor.

Why not a provider?

**Too laborious to write, hard to read and it's not "semantically appropriate". When you use a provider you suggest to other developers who will read your code that you intent to use some functionality which is not available through a "factory/service declaration".**

###2. Example where a service declaration is the most suitable to use

As already mentioned, the above example can't be implemented using the "service declaration". The reason is that a service defined using a "service declaration" becomes an object instance when injected in other parts of your application - you can not return something else from it, you just add properties and methods to the current object (to this). When you are inside a "service declaration" you are inside a constructor.

A suitable example of "service declaration" would be a wrapper for our app's Ajax requests (wrapping our backend API).

{% highlight javascript linenos %}
.service('serverLayer', function () {

  this.logout = function(){...}
  this.users = {
    add: function(){...}
  };

  //notice: we're not returning anything 
  //because we're inside a constructor here
  ...
}
{% endhighlight %}

The example above could be defined using a factory as well:

{% highlight javascript linenos %}
.factory('serverLayer', function () {
  return {
    logout = function(){...},
    users = {
       add: function(){...}
     }
  };
  ...
}
{% endhighlight %}

but why should you when you can use the cleaner, clearer syntax of a "service declaration"? It's also more "semantically correct" as we already explained in the case of a factory vs a provider. After all, that's why a "service declaration" exists - to use it instead of returning an instance from a factory.

The argument that using factories everywhere would make the code more consistent doesn't hold because we should then use providers everywhere since both factories and services are providers under the hood and can obviously be defined using providers everywhere.

*Therefore when injecting the service declared using the "service declaration", in the below controller the serverLayer will always be an instance of an object and we can access its properties immediately.*

{% highlight javascript linenos %}
.controller( 'SomeController', 
  function (serverLayer){ 
    serverLayer.users.add('test');
    ...
  }
);
{% endhighlight %}

###3. Example where a provider declaration is the most suitable to use

A provider is the most generic way of declaring a service. Both "factory declarations" and "service declarations" can be replaced by a "provider declaration". Factories and services are themselves declared using providers under the hood. 

The "provider declaration" has the most laborious syntax and allows the configuration of our service before the Angular app actually runs. This happens in the so called "config phase". What's special about the config phase is that we can only inject providers in it (we can not inject services defined with "factory" or "service" declarations) and allows us to configure our services before they run.

An example will make things clearer:

Let assume that our **NotificationQueue** used in the first example should be able to collect inline error messages and display them in its own container. Let also assume that the NotificationQueue becomes a reusable module that we want to release to the public or maybe just reuse it across our own projects.

Therefore we'll most likely need to offer the user a way of configuring the service so he can opt for the instant collection of inline error messages or to opt for skipping this step (if his app doesn't have at all any inline messages outputed by a CMS).

If we were to build our service using a "factory or service declaration" then we wouldn't be able to know about this preference when our service is initialised. We would have to manually call a run method which would receive a parameter indicating if we should collect the inline errors or not (or some other alternative approaches) but the idea is that we can't detect that when the service runs.

{% highlight javascript linenos %}
.factory('NotificationsQueue', function () {

  //define the constructor
  function NotificationsQueueConstructor(params) {
    this.queue = [];
    ...
  }

  //define the prototype
  NotificationsQueueConstructor.prototype.add = 
  function() {
    ...
  }

  //when the execution reaches this line we can't 
  //decide if this NotificationQueue should 
  //automatically collect the inline error messages
  //or not

  return NotificationsQueueConstructor;
});
{% endhighlight%}

but if we define our service using a provider, when we reach the same execution line, we will be able to know the developer's preference for this service.

Eg: 

{% highlight javascript linenos %}
app.config(["NotificationQueueProvider", 
  function(NotificationQueueProvider) {
    NotificationQueueProvider.collectInline();
  }
])

.provider( 'NotificationQueue', function() {
  var collectInline = false;

  this.collectInline = function() {
    collectInline = true;
  };

  //Provider return value
  this.$get = function () {

    //define the constructor
    function NotificationsQueueConstructor(params) {
      this.queue = [];
      ...
    }

    //define the prototype
    NotificationsQueueConstructor.prototype.add = 
      function() {
        ...
      }

    //this time when the execution reaches this point
    //we know if the service should collect the inline
    //error messages or not that's because the 
    //provider was configured in the config state and 
    //since we are inside a closure we have access to 
    //the collectInline variable defined in the upper
    //scope
 
    if(collectInline) {
      //automatically collect inline messages
    }         

    return NotificationQueue;
  };
})
{% endhighlight %}