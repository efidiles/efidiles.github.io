---
layout: post

title: Warning regarding 'npm test' command  

excerpt: "If your 'npm test' command reports more tests than you actually defined in your project then double check your declaration."

---

This is a school boy error but it ate more than half a day of my lifetime.  
I've decided to give [tape](https://github.com/substack/tape) testing framework a go after coming across [an article](https://medium.com/javascript-scene/why-i-use-tape-instead-of-mocha-so-should-you-6aa105d8eaf4) of Eric Elliott in Medium.

The issue I had was that my express server wasn't closing after all the tests were completed or the test was timing out.  
After some digging I noticed `tape` was running more tests than the actual amount of tests defined in my project. Next step was to go through all my tests and make sure I didn't have any strange logic or weird syntax in my files. 

Everything was fine there so I realised that my `npm test` command in `package.json` was the culprit.  
It looked like this: `"test": "tape test/**/*.js"` when it should obviously look like this: `"test": "tape ./test/**/*.js"`; otherwise it would launch your test command against all `test` directories and subdirectories inside your project.
