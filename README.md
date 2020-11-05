# Flow-Blocks
## Open-Source visual node-based programming language for general purpose operations.

>The current version is very unstable and un-usable.
>The code is un-organised and not optimised, because this is just a proof of concept.

Every block has its own properties , and each one analyses a set of input and outputs based on node connections.

### What are block connections ?
A connection is a uni-dimensional relation between two blocks that is able to send a single value or a set of values.
Each block reads incoming data , based on the time the connection was initiated. For example, **greater** block will return A>B only if *A* was connected earlier than *B*. To make things easier , blocks like **greater** can read tuples like [A,B] ( that will return list[0]>list[1] )

Current features:
- Free camera, mouse interaction etc.
- Constants
- Lists
- ![img](https://i.imgur.com/hZrg5Me.png)
- Basic operators
- ![img](https://i.imgur.com/YQoUThK.png)
- Live Code Preview ( unstable )
- Arithmetic operators
- List functions (Sorting alogrithms and reversion)
- Boolean operators
- If statement
- Bug-fixes
- Better visuals
- Functions
- Cycles (for, while, repeat)
- User interface (for adding blocks)

Other images:
- ![img](https://i.imgur.com/JOPzJbV.png)
- ![img](https://i.imgur.com/MMBGr3s.png)
- ![img](https://i.imgur.com/KKktjM3.png)

