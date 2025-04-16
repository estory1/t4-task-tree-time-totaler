# Hierarchical Task Estimate Summation Plugin

A plugin for the [Obsidian](https://obsidian.md) note-taking app that calculates hierarchical task time estimate sums.

## Example
Suppose you have the following task tree, with time estimates on the subtasks composing each task:
```
- [ ] [] Task
	- [ ] [] sub1
		- [ ] [3h] subsub1
		- [ ] [1h] subsub2
	- [ ] [] sub2
		- [ ] [2.5h] subsub3
```

**Problem**: you want a sum of the estimates for `sub1` and `sub2`, and ofc for just a few like the above this is easy -- but it's tedious and error-prone to do this as your task-set grows.

**Solution**: Running this plugin on your task document computes the result for you, for all tasks containing subtasks, to any depth of hierarchy, and upserts the sums:
```
- [ ] [6.50h] Task
	- [ ] [4h] sub1
		- [ ] [3h] subsub1
		- [ ] [1h] subsub2
	- [ ] [2.50h] sub2
		- [ ] [2.50h] subsub3
```

## Features

### Variable unit summation
Handles varying time units, summing in the smallest available unit (minutes), and for each task reporting the sum in the coarsest unit used among a task's subtasks, like this:
```
- [ ] [1.48w] Task w/ mixed subtask units
	- [ ] [8.50h] Subtask1
		- [ ] [8h] Subsubtask1
		- [ ] [30m] Subsubtask1
	- [ ] [2.25d] Subtask2
		- [ ] [2d] Subsubtask1
		- [ ] [6h] Subsubtask2
	- [ ] [1.11w] Subtask3
		- [ ] [1w] Subsubtask1
		- [ ] [18h] Subsubtask2
```

Available units (all in calendar-time except where specified):

| unit | description |
| --- | ---- |
| D | decade |
| Y | year |
| M | month |
| w | week |
| d | day |
| bw | business week (5 days) |
| bd | business day (8 hours) |
| h | hour |
| m | minute |

If no unit is defined, then for unit-accounting purposes a unit of minutes is assumed.


## Usage

### Task Formatting
Since this plugin works by regex-matching task lines, tasks must be defined as seen above.

The general format is:
`any_indentation - checkbox sum_field task_desc`

Which in Markdown is more specifically:
`- [ ] [] some task/subtask description`

### Execution
**NOTE: Every update overwrites any existing sum! Anything you type into the sum field will be overwritten.**

1. Open a doc containing tasks and subtasks.
2. Click the <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXNxdWFyZS1zaWdtYSI+PHJlY3Qgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiB4PSIzIiB5PSIzIiByeD0iMiIvPjxwYXRoIGQ9Ik0xNiA4LjlWN0g4bDQgNS00IDVoOHYtMS45Ii8+PC9zdmc+" alt="Σ inside a square" /> "Update Task Time Sums" button on the ribbon on the left side of Obsidian.


## Potential to-dos
1. **Maintain cursor position after click**.
2. **Configurable task format:** enable user-defined task format.
3. **Configurable decimal-handling:** enable adjustable decimal digits.
4. **Configurable business time-unit times**: e.g. for 4-day workweek, `bw` = 4 days instead of 5.
5. **Multiple estimates, multiple sums:** enables per-task estimate distribution.
    - Example: doing [Three-Point Method](https://en.wikipedia.org/wiki/Three-point_estimation) estimation (`(best-case + 4 * likeliest-case + worst-case)/6`), subtasks A `[1h,2h,4h]` and B `[2h,6h,12h]` gives task-level sums `[3h,8h,16h]`.
6. **Actual/Completed duration summation**: e.g. completed subtasks having a format like `- [x] [2.0h] ([4.67h]) Completed subsubtask1` would have their parenthetical durations summed.
7. **Estimate-consumed percentage**: `elapsed duration / estimated duration`.
8. **Unit tests**.