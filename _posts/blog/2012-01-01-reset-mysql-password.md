---
layout: post

title: Reset MySql password

excerpt: "A reminder about how to easily reset MySQL password on Windows machines."

---
A reminder about how to easily reset MySQL password on Windows machines.

Navigate to bin directory of your mysql folder, open a command prompt there (as administrator) and type:

{% highlight sql linenos %}
mysqladmin -u root password admin
{% endhighlight %}