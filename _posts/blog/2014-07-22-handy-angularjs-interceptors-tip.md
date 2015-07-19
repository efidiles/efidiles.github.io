---
layout: post

title: Handy AngularJS interceptors tip

excerpt: "How can you use the AngularJS interceptors to deal with user authentification and the server session."

---

When developing Single Page Apps (SPA), you will at some point have to deal with authentification and the server session.

For example let's imagine the following scenario: the user's computer goes into standby mode and the he returns after 2 days. If you'd have a classical website which makes full page requests then immediately as you click anywhere or refresh the page you'd get the login screen or a session expiry screen. This can be easily implemented on the server side because the server is in control of the session.

Things are a bit different on a SPA website because you're not in control of the session. The user generally makes Ajax requests when he interacts with your website and if you don't properly cover scenarios such as an expired session on the server then the user may end up confused about the state of the website. He would most likely constantly click things and have the impression that something is broken or not working. Many time he won't even do a full page refresh (which he shouldn't need to do anyway).

The solution to this is to accompany your Ajax responses with a status code, a parameter for the session status and eventually a parameter for errors.

AngularJS then provides a very helpful service called **Interceptor** which you can use to check for generic scenarios such as session state and reporting generic errors.

The interceptor, can intercept (obviously) both the requests before they are sent to the server and the responses before they are passed to your app's callbacks and allows you to either decorate, modify, sanitize your requests before they are sent or to take action when certain things have happened or are present in your responses.

In our case let's say we receive from the server a session variable in all our Ajax requests. Using the interceptor we can monitor if the session still exists or if for example the site is in a maintenance mode.

Based on these details we can redirect our app to an appropriate screen (login or "in maintenance" screen).

This time, regardless of what actions the user performes, when the first ajax requests kicks in, if the session expired the user will be redirect to the login screen.

Example of code for an interceptor:

{% highlight javascript linenos %}
function checkSession(r, $location) {
    var 
      loginUrl = '/api/user/login',
      logoutUrl = /api/user/logout'
    ;

    if (r.config.url !== loginUrl && 
        r.config.url !== logoutUrl && 
        r.session && !r.session.isLoggedIn) {
            $location.path('/login');          
    }
}

$httpProvider.interceptors.push(
  function($q, $location) {
    return {
      'response': function(response) {
        //check if the session didn't expire
        checkSession(response, $location);
        return response;
      },
     'responseError': function(rejection) {
        //check if the website is in maintenance
        if (rejection.data.result && 
            rejection.data.result.in_maintenance) {
                $location.path('/maintenance');
        }
        //check if the session didn't expire
        checkSession(rejection, $location);
        return $q.reject(rejection);
      }
    };
  }
);
{% endhighlight %}