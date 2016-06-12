---
layout: post

title: Filter for a single file when running 'npm test'

excerpt: "Neat trick to make use of environment variables in npm scripts"

---

Let's say we have the following  `package.json`:  

```js
{  
...  
  "script": {  
   "test": "mocha ./test/**/*.spec.js"  
  }  
...  
}  
```

I would like the ability to run `npm test` but also be able to somehow filter for a single test file without having to create a separate npm script task for that.

First solution that comes to mind would be to use some kind of argument with `npm test` which will then be passed to mocha.
Something like  `npm test -- --filter some-file`.

That would work but the problem is that mocha doesn't have a filter argument because it would be redundant. You'd normally already 'filter' when you specify the glob for files (`./test/**/*.spec.js` in this case).

**NOTE: Mocha allows a `--grep` argument but it will grep the tests titles not the file names.**

Turns out there is a trick we can apply to get this done by making use of the environment variables. Basically we update the npm script to this:
`mocha ./test/**/*$MATCH*.spec.js`

and then we can call the npm script like this:
 `MATCH=some-file npm test`

The interpreted command will be:
 `mocha ./test/**/*some-file*.spec.js`

Pretty cool!
