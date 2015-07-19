---
layout: post
tags: [work]

title: Assets management system for BSkyB

excerpt: "An assets management system built with AngularJS, ngBoilerplate, SASS and PHP / ProcessWire."

url: www.believeinbetter.com

technologies:
    - PHP
    - MySQL
    - ProcessWire
    - AngularJS
    - Canvas
    - ngBoilerplate
    - HTML5
    - CSS3
    - SASS
    - File API
    - Plupload
    - jQuery
    - Grunt
    - Bower

thumbs:
    /images/assets-management/thumb-homepage.png: Homepage
    /images/assets-management/thumb-activity.png: Activity page
    /images/assets-management/thumb-approval.png: Approval page
    /images/assets-management/thumb-book-brandhub.png: Book a meeting page
    /images/assets-management/thumb-basket.png: View basket page
    /images/assets-management/thumb-assets.png: Browse assets page
    /images/assets-management/thumb-news.png: News page
    /images/assets-management/thumb-upload-assets.png: Upload assets page
    /images/assets-management/thumb-our-brand.png: Our brand page
    /images/assets-management/thumb-view-brandhub.png: View meetings page 
---

This website is an internal assets management system for Sky Brand department. I was the sole developer of the project.

The frontend was built in AngularJS with the help of ngBoilerplate structure with SASS support in exchange of LESS. The code is organised in folders representing components, each containing its entire app code (SASS files, HTML partials and JS code wrapped in its own AngularJS module). This assures an easily maintainable and testable code. Among other tasks, Grunt concaternates, minifies and wraps all the html partials in Angular modules thus reducing the need for extra http requests while keeping the templating easy for the Angular developer (and also helps with partials' cache invalidation).

The backend was build on top of ProcessWire and exposes a REST API consumed by AngularJS.