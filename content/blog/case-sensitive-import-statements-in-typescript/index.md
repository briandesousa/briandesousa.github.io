---
title: "Case-sensitive import statements in TypeScript"
date: "2019-02-09"
description: ""
categories: 
  - "angular"
  - "javascript"
tags: 
  - "cross-platform"
  - "npm"
  - "typescript"
---

I ran into a tricky TypeScript build issue with an Angular app that would build successfully on a Windows 10 machine but failed to build on a Linux machine with a "Cannot find module" error. The cause of the problem ended up boiling down to a single case-sensitive character, "X" instead of "x".

When I first encountered the error, I started with the basic and compared my Linux and Windows environments:

- Confirmed the source code is identical on both machines
- Confirmed the Node and NPM versions are identical
- Confirmed the issue occurs even with the most basic build by removing build steps from my NPM script

Of course, instead of looking at the obvious my mind starts wandering to more complex causes. Is there something wrong with the NPM cache? I'll force clean it. Nope, that didn't do it. Maybe if I enable debug output, I can get additional information about the issue. Nope, nothing helpful here.

After some time, I took a closer look at the import statement:

```
import { Observable } from 'rxjs/RX'; 
```

The "RX" didn't look right, but surely the build wasn't failing due to case sensitivity. I tried try changing it anyways. Jackpot!

It turns out that import statements are **case-insensitive on Mac and Windows but case-sensitive on Linux.** There is a `forceConsistentCasingInFileNames` tsconfig.json compiler option that can help detect these sorts of issues at compile time. In my case, this option had no effect on the build however this could be because the app is still using TypeScript 2.4. There seems to be some fixes related to this compiler option in TypeScript 2.7.2.

If you have been bit by this issue too, you may want to consider adding your feedback to this [open suggestion issue 21736](https://github.com/Microsoft/TypeScript/issues/21736) on the TypeScript GitHub repository.
