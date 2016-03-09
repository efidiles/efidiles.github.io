---
layout: post

title: Stop stopwords in ProcessWire

excerpt: "Disabling the MySql stopwords list in ProcessWire also requires to disable a stopwords list found in core code."

---

I've recently spent close to a week of back and forths, trial and error, different OS-es, versions etc because I wasn't able to stop the MySQL stopwords of a LAMP based project. After experimenting with all the recommendations found over the internet to disable the default stopwords list, my system was still immune to anything I would of done. In the end I realised that the fault wasn't with my MySQL instance but with my CMS.

ProcessWire has its own class that provides the stopwords functionality provided by MySQL thus just configuring MySQL to disable the stopwords won't work because ProcessWire will filter the results using it's own internal DatabaseStopwords class. I suspect the reason for this is that many ProcessWire users are on hosts where they don't have access to the MySQL config file to configure/disable the list.

Therefore, in order to disable the stopwords in LAMP stack running ProcessWire you need to:

**1. Disable the stopwords list in MySQL - in the config file (my.ini) on Windows, add the following line in the [mysqld] section:**

{% highlight javascript %}
ft_stopword_file = ""
ft_min_word_len = 2
{% endhighlight %}

or link an empty file "empty_stopwords.txt"; "/dev/null" on Linux machines

You can also add the below line to allow words starting from 2 character in searches. What's less than 2 characters gets ignored.

{% highlight javascript %}
ft_min_word_len = 2
{% endhighlight %}

After folllowing these steps restart the MySQL server and run a quick repair on all database tables (you can easily do this with PhpMyAdmin).

Otherwise you must manually play around with:

{% highlight sql %}
REPAIR TABLE tbl_name QUICK
{% endhighlight %}

**2. In ProcessWire add the following code to disable its internal stopwords list (wrapped inside a module's method preferably):**

```php
$words = DatabaseStopwords::getAll();
if(count($words)) {
  foreach($words as $word) {
    DatabaseStopwords::remove( $word );
  }
}
```
