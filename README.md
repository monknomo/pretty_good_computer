Pretty Good Computer
=====================

What Is It?
-------------

Pretty Good Computer is a toy computer I built to simulate the z-machine [as described by jgc.](http://blog.jgc.org/2013/05/the-two-problems-i-had-to-solve-in-my.html)  I enjoyed working out the problems long hand, but thought that I could have a computer do the repetetive scut work; they're better at it after all.

The z machine has unlimited memory locations that are numbered, so we can refer to them.  The cpu understands 3 instructions:

* z _n_
** z zeros, or initializes, memory location n
* i _n_
** i increments memory location n
* j _n_ ! _m_ ) l
** j compares memory locations n and m's value.  If they are equal, the program proceeds to the next line, otherwise it goes to line l

Of course, I can't figure out a good way to represent infinite memory locations in a browser window, so we are stuck with 16-bits by default.  This is user-editable, if you need more space to really explore whatever you are doing.