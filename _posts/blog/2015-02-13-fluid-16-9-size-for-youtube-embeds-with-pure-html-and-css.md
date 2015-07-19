---
layout: post

title: Fluid 16:9 size for YouTube embeds with pure HTML and CSS

excerpt: "A pure CSS solution to keep the 16:9 ratio of embeded YouTube videos."

---

A pure CSS solution to allow YouTube embeds to:

- be centered in the container
- have a max-width
- have no fixed width/height attributes on the iframe
- have fluid layout when screen size/window size is smaller than max-width
- keep the 16:9 ratio when window/screen size is smaller than max-width
- support IE8+

{% highlight html linenos %}
<div style="text-align: center; background: #ccc">
    <div class="video-wrapper">
        <iframe src="https://www.youtube.com/embed/eCqhy5RoDf0?modestbranding=1&;showinfo=0&;autohide=1&;rel=0;" frameborder="0"></iframe>
    </div>
</div>
{% endhighlight %}

{% highlight css+php linenos %}
.video-wrapper {
    /* allows the container to horizontally center */
    display: inline-block; 
    /* removes bottom spacing cause by inline-block */
    margin-bottom: -4px;
    position: relative;
    width: 100%;
    max-width: 640px;
    max-height: 360px;
}
.video-wrapper:before {
    content: "";
    display: block;
    /* 16:9 aspect ratio */
    padding-top: 56.25%;
}
.video-wrapper > iframe {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}
{% endhighlight %}

A Codepen can be found here (resize the frame to see it in action): <a href="http://codepen.io/efidiles/pen/dPdzpr" target="_blank">http://codepen.io/efidiles/pen/dPdzpr</a>