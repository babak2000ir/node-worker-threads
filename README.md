# Worker Threads Inspector
* node
* react 
* node:worker_threads
* koa

###### v 1.0.1

React app is added to the project. you can see and compare results:

![Test result screenshot - client](https://github.com/babak2000ir/node-worker-threads/blob/main/Screenshot%202023-08-13%20170140.jpg?raw=true)

Durations of the shortCall and longCall requests after heavyCall do include heavyCall's long running time.

But the durations of the shortCall and longCall requests after heavyCallWT is not affected by heavyCallWT's long running time.

**There is an interesting and classic isse solved in this update: "React Asyncronous state update". This issue causes our state break when we push an array and update it in the .then(...). But using function for of setState, you can take your update out of the closure and keep the state always updated in your then(...)**

###### v 1.0.0

This is a POC based on my node-react minimalist framework. I'm creating a test environment to observe node:worker_threads handles heavy request using a pool of worker_threads. 

You can test the api layer with an Api client:

#### **without worker_threads:**
The shortCall will take 5 seconds to reply back, 
```
localhost:3000/shortCall
```

the longCall will take 10 seconds. 
```
localhost:3000/longCall
```
You can make these calls concurrently and you'll get the reply without any time interference, these async calls do not block the main thread.

However if you look at the heavyCall it will block the main thread for some bogus heavy computation. you can try this and it will take around 30 seconds (on my computer, your mileage may vary, this is a processor dependent calculation):
```
localhost:3000/heavyCallAsync
```
If you try calling shortCall or longCall while heavyCallAsync is running, you'll notice that the main thread is blocked and you'll get the reply 5 or 10 seconds after the heavyCallAsync is done. (so around 35 or 40 seconds)!


#### **with worker_threads:**
Now try the last scenario but instead of calling heavyCallAsync, call heavyCallWT. This will use a worker_thread to do the heavy computation and will not block the main thread. You can call shortCall or longCall while heavyCallWT is running and you'll notice that the main thread is not blocked and you'll get the reply after 5 or 10 seconds immediately after you call them.
```
localhost:3000/heavyCallWT
```

**Please consider the blocking scenario is not your normal everyday fetch or async operations, it's a specific usage and is not necessary for most of the applications. However if you have a heavy computation that you want to run in the background, you can use worker_threads to do that.**

A production build needs a proper pool management for thread workers. In future I will add a pool management to this POC based on this article, very good read:

https://amagiacademy.com/blog/posts/2021-04-09/node-worker-threads-pool
