---
layout: post

title: Assets management system for BSkyB
cover_image: blog-cover.jpg

excerpt: "An assets management system built with AngularJS, ngBoilerplate, SASS and PHP / ProcessWire."

url: www.believeinbetter.com
---

This website is an internal assets management system for Sky Brand department. I was the sole developer of the project.

The frontend was built in AngularJS with the help of ngBoilerplate structure with SASS support in exchange of LESS. The code is organised in folders representing components, each containing its entire app code (SASS files, HTML partials and JS code wrapped in its own AngularJS module). This assures an easily maintainable and testable code. Among other tasks, Grunt concaternates, minifies and wraps all the html partials in Angular modules thus reducing the need for extra http requests while keeping the templating easy for the Angular developer (and also helps with partials' cache invalidation).

The backend was build on top of ProcessWire and exposes a REST API consumed by AngularJS.