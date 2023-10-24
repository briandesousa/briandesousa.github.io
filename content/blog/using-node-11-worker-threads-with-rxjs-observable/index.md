---
title: Using Node 11.7 Worker Threads with RxJS Observable
date: 2019-02-16
image: ./worker-thread-observable-1.png
categories: 
  - "how-to"
  - "javascript"
  - "node"
  - "rxjs"
tags: 
  - "multi-threading"
  - "nodejs"
  - "streams"
  - "worker-threads"
---

![Node.js worker_threads + Observables](images/worker-thread-observable-1.png)

With the release of Node 11.7, the worker\_threads module becomes a standard feature and is no longer hidden behind the `--experimental-worker` switch. The worker\_threads module allows developers to run JavaScript asynchronously in light-weight, isolated threads contained within the main Node process. This article will be focusing on how use worker threads to execute a task asynchronously and stream data from that task back to the rest of your Node application using RxJS Observables.

Before we get started, if you want to learn more about worker threads and why you might want to use them, I would recommend reading [Node.js multithreading: What are Worker Threads and why do they matter?](https://blog.logrocket.com/node-js-multithreading-what-are-worker-threads-and-why-do-they-matter-48ab102f8b10) by [Alberto Gimeno.](https://blog.logrocket.com/@gimenete) Alberto has done a fantastic job explaining the purpose of the worker\_thread module, provided some solid examples of where it makes sense to use it as well as demonstrated some alternate ways to build a multi-threaded Node app.

## What are we building?

We are going to be building a simple Node app that creates a worker thread running a simulated long-running task that reports status back at regular intervals until it completes or until time runs out. The worker thread will be wrapped in an RxJS Observable so that the rest of the application can stream messages returned from the worker thread using the powerful RxJS library.

**If you want to jump ahead and see the final solution, you can see it out on GitHub at** **[briandesousa/node-worker-thread-rxjs](https://github.com/briandesousa/node-worker-thread-rxjs)****.**

## Setting up your environment

The first thing we need to do is ensure our environment is ready to go:

1. Install Node 11.7.0+
2. Use `npm init` to initialize a new NPM package
3. Add a simple start script to the package.json to start the app: `node node-parent-thread-rxjs.js`
4. Install the RxJS package with `npm install -s rxjs`
5. Create node-parent-thread-rxjs.js which will contain code running on the main thread
6. Create node-worker-thread-rxjs.js which will contain the implementation of the long-running task running on a separate thread

## Creating the worker thread

The worker thread has the logic to simulate a long-running task:

\[gist https://gist.github.com/briandesousa/28949fe67a47362b1391bcd136debc0e /\]

Let's break this script down a bit:

- We use `parentPort` from the `worker_threads` modules to communicate back to the parent thread at 3 different points:
    - before the task begins
    - while the task is running (within the do while loop) to provide status back to the parent thread
    - when the task completes
- We use `workerData` from the `worker_threads` module to pass in a time limit for how long (in seconds) the task should run for. The task completes when this time limit is reached (line 19).

This worker thread doesn't do anything particularly useful but it does demonstrate how a thread might receive instructions from its parent and stream multiple updates back to its parent.

## Creating the parent thread

The parent thread has the following responsibilities:

- Start the worker thread, specifying how long the worker thread should run for. We will call this WORKER\_TIME.
- Receiving updates from the worker thread in an observable stream
- Exit the application if the worker thread takes too long. We will call this MAX\_WAIT\_TIME.

https://gist.github.com/briandesousa/28f1c667e6c9b22aad5aaaa9a6dd36b7

There is a lot going on here. Let's focus on the `runTask()` function first:

- We use `Observerable.create()` from the `rxjs` package to create a new observable. This observable creates an instance of the worker thread and passes some data in.
- We map events output from the worker thread to the appropriate functions on the [Observer](http://reactivex.io/rxjs/class/es6/MiscJSDoc.js~ObserverDoc.html) interface:
    - `message` events are returned as normal values pushed to the subscriber through `Observer.next()`
    - `error` events are mapped to `Observer.error()`
    - when an `exit` message is received, we check the message to determine why the worker thread exited:
        - if a non-zero value is returned, then we know something went wrong and map the result to `Observer.error()`
        - if zero is returned, we call a callback function to notify the application that the task was completed on time, we send one final special COMPLETE\_SIGNAL value and then we complete the observable with `Observer.complete()`

The `runTask()` doesn't have a very descriptive name however you can now see that it encapsulates the mapping logic between worker thread events and the Observable interface.

Next, let's look at the at the `main()` function:

- We create the observable by calling `runTask()`. We pass in a simple callback that sets the `completedOnTime` flag to true so that we can report the reason why the observable completed.
    - Note that the observable we just created is a [cold observable](http://reactivex.io/documentation/observable.html). It creates the worker thread and starts emitting events only once it has been subscribed to.
- We pipe some RxJS operator functions into the observable:
    - `takeWhile()` to stop the stream when the special COMPLETE\_SIGNAL value is received
    - `takeUntil()` to stop the stream when time has run out
- We subscribe to the observable and log any values or errors that are received to the console. When the observable completes, we log the reason why it completed. If the reason is because we ran out of time, then we forcefully exit the application with `process.exit(0)`.

## Running the solution

Run the solution with your `npm start` command. Assuming MAX\_WAIT\_TIME is still set to 3 and WORKER\_TIME is set to 10, you will see the following output:

```
Node multi-threading demo using worker_threads module in Node 11.7.0 [Main] Starting worker from process 4764 [Main] worker says: starting heavy duty work from process 4764 that will take 10s to complete [Main] worker says: heavy duty work in progress...1s [Main] worker says: heavy duty work in progress...2s [Main] worker says: heavy duty work in progress...3s [Main] worker could not complete its work in the allowed 3s, exiting Node process
```

The worker thread started to do its work, but after 3 seconds, the app signaled to stop the stream. The main process was forcefully exited along with the worker thread before it had a chance to complete its task.

You can also try adjusting the solution to see what happens when:

- WORKER\_TIME is less than MAX\_WAIT\_TIME
- multiple worker threads are spawned from the parent thread by calling `runTask()` multiple times and creating multiple observables with different settings

## Wrap up

We have only just scratched the surface of what is possible when you combine the streaming power and beauty of RxJS Observables with the worker\_threads module. Happy threading!

Check out the full solution on GitHub at [briandesousa/node-worker-thread-rxjs](https://github.com/briandesousa/node-worker-thread-rxjs).
