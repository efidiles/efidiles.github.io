---
layout: post

title: Using Fiddler to force mocked response error messages

excerpt: "Use Fiddler to mock error responses in order to test
    how errors are displayed in the interface."
---

Sometimes you may need to test how the error messages look in your application's view but you need to force certain responses for your requests. Of course
this can be done in many different ways but using Fiddler is a quick and generic way of doing it.

The following steps describe how to do this:

- Open the **Rules** > **Customize rules...** menu (or press Ctrl + R) (**fig. 1**)
- Look for the **OnBeforeResponse** handler and add the below code to override
all **PUT** requests with a custom JSON response.
- Make sure that after you added the code you reload the script (**fig. 2**).

```csharp
public static void OnBeforeResponse(Session oSession) {
  // Write rules here to filter for a specific response. You can target a
  // specific hostname, url path, method etc. (more details can be found in
  // Fiddler's documentation)
  if (oSession.HTTPMethodIs("PUT")) {
    // You can log custom messages which can be viewed in the log tab (fig. 3)
    FiddlerObject.log("From response put");

    // Send a custom JSON as response body
    oSession.utilSetResponseBody("{\"errors\": [\"someError\"}]");

    // You may need to override the response code if your browser strips out
    // the response body for certain response statuses (such as 422).
    oSession.oResponse.headers.HTTPResponseCode = 200;
    oSession.oResponse.headers.HTTPResponseStatus = "200 Success";
    oSession.oResponse.headers.Add("Content-Type", "application/json");
  }
}
```

At this point you should get the custom response for any `PUT` request made by your application.


**Figure 1: Customize rules menu**  
![Customize rules menu](/images/fiddler/fig1.jpg)

**Figure 2: Reload script menu**  
![Reload script menu](/images/fiddler/fig2.jpg)

**Figure 3: Logs tab**  
![Logs tab](/images/fiddler/fig3.jpg)
