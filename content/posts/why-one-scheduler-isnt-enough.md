---
title: "Why one scheduler isn't enough: placing IoT tasks across vehicular edge networks"
dek: "Notes on multi-coordinator reinforcement learning, and where a single policy breaks down."
lane: research
date: 2026-10-09
series: scheduling-at-the-edge
part: 1
featured: true
topics: [Reinforcement learning, Edge computing, Distributed systems]
hops:
  - { place: "Nairobi", what: "Drafted" }
  - { place: "[City]", what: "Reviewed" }
  - { place: "Nairobi", what: "Published · Oct 2026" }
---

Picture a city full of connected cars, each one producing work that has to run somewhere: on the car, on a roadside unit, at a base station or back in the cloud. Deciding where each task runs is the scheduling problem, and the network keeps changing under you while you solve it.

==A single central scheduler sees everything, but by the time it decides, the car has already moved on.== That gap between seeing and acting is where this series starts.

## Many coordinators, one goal

PRISM splits the decision across several coordinators. Each one is responsible for part of the network and learns its own placement policy with reinforcement learning. The network is modelled as a graph, so a coordinator can reason about nearby nodes and links when it chooses where a task goes.

[Body paragraph: how the coordinators share what they see, in plain words.]

## What comes next

Part 2 walks through the simulation setup: the SUMO traffic scenarios, the task mix and how latency is measured.
