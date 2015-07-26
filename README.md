# Lucibus

*Modern stage lighting control system*

We are taking a fresh look at designing a lighting control system. We are starting with some high level goals and then some more specific goals. Then we are creating an architecture, data structure, and UI that will allow us to achieve our goals. This is an entirely open and not for profit process. We are tired of lighting systems that have been patched together from the past and have been inspired by [Rob Halliday's great articles on lighting programming](http://www.robhalliday.com/OtherThings/Articles/index.html).

## Goals
* Brings the UI and structure of the app closer to the mental picture the lighting designer has of the show.
* Interface is intuitive and simpler. Easy to pick up for a beginner.
* Open source and free. BYOH (bring your own hardware). Windows, Mac, and Linux all supported.
	* Have your own idea how you wanna control your lights? Great make a tool to do it, nothing is stopping you now.
	* Or contribute a patch, if you think others could benefit from it.

### Content

#### Readable Cues

Although we had this idea before reading [Rob Halliday's Building Blocks article](http://www.robhalliday.com/ArticleStore/ArticleStore/ConsoleWants2.html), he does a great job of describing the problem.

The idea is that if you want to bring up a group of lights, you should be able to specify that group in language close to how you think about them and the system will understand. For example "USL Front" or "Warm Top" or "Platform Special". So if we allow that, then it requires tagging all lights in the patch with values. So that they can be referred to later. Then when you write "warm top" you are really saying "find all lights with tag WARM and tag TOP".

Another problem he brings up is that after you record a cue, despite any nice filtering the console lets you do to select lights originally, they are all recorded as just channel numbers. Which makes it hard later to figure out what was going on in that cue and edit it.

So instead, we elimate all channel numbers. We only refer to lights through filters, and save those filters in the cue. So a cue might be composed of "front @ 50% and top @30%", and the dimmers that those filters select are determined by what lights are tagged a front and top.

So we propose the patch looking like a mapping between dimmer addresses and tags. Like `Dimmer 1: USL, Front, Cool`. 



#### Sharing looks between cues

We often want to share a bunch of different groups of lights at certain levels between multiple cues. Tradationally, tracking has been a tool to solve this problem. Tracking, however has a few disadvantages.

1. It is confusing. It is not always apperent when tracking should end or how to end it. It is also unclear exactly what cues you are affecting when you change a light in a cue with tracking. Read [Rob Halliday's great article](http://www.robhalliday.com/ArticleStore/ArticleStore/ConsoleWants3.html) for some more in depth examples of the nuances of tracking.
2. It doesn't allow you to save a certain level once and then refer back to it later. Like if you have one scene in location A, then a blackout, then another scene in location A, you might want levels to persist between those scenes, but tracking doesn't allow this because you have a blackout in between.

Instead we propose having all states (that means all cues, the live page, all looks) be stacks. I will give some examples:


```
# our current Live
USL Front @ 50%
Front @ 20%
Cue 1 @ 100%
```

This is a top takes precedence stack. So currently Cue 1 is up at full, then overriding that is all front lights at 20% and overriding that is the USL front like at 50%. This would be what is displayed to the user and what is stored on the system (except not stored as text, but the same structure)

```
# Cue 1
Front @ 30%
Top @ 10%
```
Each cue would look like that as well, so that all the  different states have the same structure and can be embedded in one another.

To save a bunch of lights in a named group, we make a **look**, which is just a stack with a name attached to it. If you used it in multiple cues, those cues would just store a reference to the look, and so if any light was changed in the look, it would affect the output of all the cues that use it. If you just wanted to change a light in your cue, without affecting any looks that it used, you could just add an override above it, like we did in the first example with the front lights.


#### Works with multi paramater lights

We need to be able to patch and select multi parameter instruments easily. To do this 

Be able to set multiple parameters on special lights with their own profiles. So being able to set the X and Y parameter of a mirror, or the red green blue value of an LED.

```
USL Front -> mirror X @ 50%, mirror Y @ 20%
LEDs -> Red @ 25%, Green @ 50%
```

#### Different Profiles

There are lots of unique lights that have different values corresponding to different attributes on a light. Besides just a regular slider, having for example RGB pickers for the RGB attributes of an LED, or a drop down menu for the gobo of a moving light would be useful. The UI for each new light profile has to be able to be customized to that specific type of light.


```
USL Front -> mirror @ USC
```

#### Labeled Outputs

Individual lights or groups of lights can have certain percentages represented by text labels. This would allow someone to put for example a scroller at the color blue, without having to know what value blue is at for the dimmer.

#### Automatically assigned dimmers for moving lights

For any light that uses multiple dimmers, the dimmers would be assigned in a row. So if a moving light needs 10 addresses, the light would have a starting address, then the next 9 addresses come right after, so it becomes a block of adresses, which is referenced using the starting address. This could be overrided by the user if the attributes for a moving light needed to be stored at non-consecutive addresses.

#### History
To have the ability to save versions of cues, or back up the entire show, so that one could revert back to a previous state. Also having the ability to undo recent commands would be useful, so automatically storing the previous commands of the user would be neccesary.

#### Cue Navigation
Being able to name cues would allow you to easily identify a cue. It would also be useful to have a searchbar to search for cues by name.

#### Multiple Customizable UIs

Anyone could create their own custom UI with no changes to the base system.

#### Simplifying Blackout Cues

In addition to being able to tell a group of lights to be at a certain percent, it should also be possible to tell a group of lights on the stack to be the same percentage as the last cue, or the same as the next cue. This would be useful for scrollers during a blackout, when after the scene lights went down, the scrollers need to stay up, so you could say

```
scrollers @ previous_cue
```

These could be used to create a chain of groups in cues that follow whatever the previous v

#### Select By Current Levels

This idea is stolen from [part four of Rob Halliday's series](http://www.robhalliday.com/ArticleStore/ArticleStore/ConsoleWants4.html).

Let's say you have a bunch of moving lights all pointed at SC. Then you wanna select those and increase their level by 10%, for a bump at the end of a cue. It would be great to be able to select based not only on intrinsic properties of a light, but also temporary properties based on their current level.

We envision allowing existing parameter values to be valid selectors. For example, in this case you could write a query like:

```
focus @ SC -> intensity +@ 10%
```

This keeps the same structure as a general filter, but instead of filter based on tags of an instrument, we select based on their current parameter levels.



### Structural


#### Physical Inputs

We want to be able to use physical as well as digital inputs. An example of this would be a slider that attaches via USB to a computer that we want to modify a light level with. 

#### "Go Button" Latency < 50ms 

This is the maximum that a response can happen and it seem "instantanious" from a human perspective. According to something I forget. Might be worth looking into more, for a better number

#### DMX Render Frequency > x hertz
 
 We need to figure out exactly how fast we should be pumping things out the serial ports to the ENTTEC DMX USB Pro, in order fades to be fluid.

#### Accessible on different devices
We should be able to view and modify the current state from a phone or a computer.

#### Simultanious Clients

Multiple users should be able to edit and view the system at the same time.

## Decisions

### Content


* "preset focus" / named levels
  * these are discrete output levels that have a certain meaning for a certain device. 
  * support default for some instrument types (like types of focus on a moving light)
  * allow manual creation and share between multiple instruments of same type (like color scrollers)
  * allow on the fly creation for things like focus
	* allow labeling after positiong ([src](https://hypothes.is/a/q1_gid3AQu24oNnzYmJl2A))
  * when selecting which one to use, order them by distance from current position ([src](https://hypothes.is/a/raheturASa-VtDBhn-zseA))
  * Combine multiple presets after the fact to clean up ([src](https://hypothes.is/a/_PmTAGcmSJKrhn1SfKLeIA))
* proper import/export
  * lightwrite support
* analytics
  * use another app for this maybe
  * which lights did i use
  * http://www.robhalliday.com/ArticleStore/page69/page69.html
* select based on levels
  * allow filtering based on existing levels

```
Filter:
<selector>  -> [[<parameter> <operator> <level>], [<parameter> <operator> <level>], ...]
front -> intensity @ 20%, color @ green
color @ green -> intensity @ 30%
```

### Architecture

We decided to build it in a client server model. The client would be a static html site that communicates to the server over HTTP (or websockets). Multiple clients can connect to the server at once, and it will maintain the master state.

We used Go to build the backend server (called subicul) and react + baobab for
the frontend (called caido).
