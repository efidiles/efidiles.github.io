---
layout: post

title: Global setting to ignore folders in Sublime's 'Find & Replace'

excerpt: "Solution to make Sublime Text always ignore certain folders when performing a search into a folder."

---

Sublime Text can be instructed to ignore certain folders by using the `folder_exclude_patterns` setting in your project's
settings file or in your user's settings file.  
Eg: `"folder_exclude_patterns": [".svn", ".git", "node_modules", "coverage"]`.  
However, this doesn't do anything for the 'Find & Replace' functionality and it's a bit annoying to keep manually adding 
an exclude filter in the `Where` box.

A neat workaround is to do the following:  
- Add your folders to the `folder_exclude_patterns`.  
- Assign a keyboard shortcut with the following command:  
`{ "keys": ["ctrl+alt+h"], "command": "side_bar_find_in_selected", "args": {"paths": ["<open folders>"]} }`

The important bit is the `<open folders>` parameter. This will cause the search to only look in the folders available 
in your sidebar thus it won't include those specified in the `folder_exclude_patterns` array.

If you want to keep the folder in your sidebar then you could just use the keyboard shortcut and specify an exclude filter.
Eg: `{ "keys": ["ctrl+alt+h"], "command": "side_bar_find_in_selected", "args": {"paths": ["<open folders>-*/node_modules/*, -*/coverage/*"]} }`
