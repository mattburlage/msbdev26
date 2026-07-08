---
title: "Don't Merge What You Can't Fix by Hand"
description: "Repo-Driven Development: How relying on repo structure can drive responsible AI-driven software development."
pubDate: 2026-07-08
tags: ["ai", "claude-code", "software-engineering", "comprehension-debt", "spec-driven-development"]
---

One year ago, I set out to try Claude Code for the first time. I was excited, as I needed a fairly complicated web application that I knew I'd never have time to create by hand. I installed it, paid the $20, and began work. It started out well, but I quickly realized I had let the AI drive me and that I had no idea how my brand new application worked. I scrapped it and started over.

This time, I was going to be methodical. I would review every line so that if a critical bug appeared, I could fix it by hand. That turned out to be easier said than done, and eventually I gave in to the temptation of easy velocity. Within weeks I'd lost the thread again. I scrapped the project a second time and went looking for a better way: one that would let me keep the agent's speed without giving up the ability to fix my own code.

Regardless of the wider discussion of the ethics of the AI boom, the tools' value towards software engineering is hard to argue against.  And organizations are moving towards them in a big way.   But as Addy Osmani discussed earlier this year, a new problem is emerging: [*comprehension debt*](https://addyosmani.com/blog/comprehension-debt/)

## How can we understand code we didn't write?

Nothing can replace the familiarity with a codebase as writing it character by character. But as we transition away from that and leverage AI driven development, it will be important to figure out how organizations, especailly governments and large enterprises, can ensure their devs actually understand what is happening in the code. This is a big challenge, and one that will not have a single solution.  But a large part of the success of an AI-driven project will revolve around this question: "Did we set ourselves up for success before writing (or prompting) a single line of code."

## Specs for Success

Requirements gathering, as well as design documents, have always been a critical component for how humans build systems.  But in a world where we can't control the output of an LLM, it becomes critical to control what we can: the input.  The approach that I have found to work most convincingly is iterating a design from requirements with the help of an LLM. Once you think you have the vision nailed down, its time to write a design document. I've had success with both writing these by hand as well as using the LLM to iterate with me. Either way, it is vital to review those in depth so that any output later on has the best chance to succeed.

This has gained in popularity and is now known as Spec Driven Development. 

