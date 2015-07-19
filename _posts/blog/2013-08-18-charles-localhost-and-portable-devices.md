---
layout: post

title: Charles, localhost and portable devices

excerpt: "How to use charles to access localhost WAMP instances via network from portable devices such as mobiles, tablets etc. without using the hosts file."

---

How to use charles to access localhost WAMP instances via network from portable devices such as mobiles, tablets etc. without using the hosts file (which can't be edited anyway if the device is not rooted).

**1. On your mobile/tablet please indicate to your device to use a proxy when connecting to the internet. The proxy to use will be your machine's IP followed by the proxy port number set in Charles (default is 8888 as shown in the screenshot below).**

![Charles port configuration](/images/charles/charles-port.png)

**2. Configure rewrite settings in Charles by setting it to replace any occurence of your local domain with your machine's IP. This is particularily important for Wordpress since the domain name is hardcoded in the database.**

![Charles rewrite settings](/images/charles/charles-rewrite.png)