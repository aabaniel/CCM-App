# Product Specification — TimeBudget

## Audience

Collegiate students who want to balance academics, internships, health, relationships, hobbies, and leisure while making intentional use of each day.

## Core concept

A day is a budget of 1,440 minutes. TimeBudget is closer to a budgeting app for time than a conventional backlog/to-do manager.

The core loop is:

1. Plan tomorrow.
2. Set daily personal target minutes.
3. Allocate activities across the day; unallocated time is allowed.
4. Optionally optimize existing flexible activities.
5. Commit the plan.
6. Execute today: Start, Done, or Skip.
7. Late completion pushes later flexible blocks when they collide.
8. Finalize the day and compare actual allocation to personal targets.
9. Earn participation XP and maintain a daily-loop streak.

## Categories

Scored:
- Health
- Relationships
- Identity
- Challenge / Interest

Neutral:
- Maintenance
- Free

Each activity has one category only. Categories are fixed in the MVP.

## Targets and score

Targets are defined every day. The score measures how closely the user's planned/actual category totals match the user's own declared targets. It does not assert an objectively healthy universal schedule.

Skipped activities have no direct penalty. They matter only through their effect on actual allocation.

## Scheduling

- Tomorrow planning is manual in MVP.
- Activities do not overlap.
- Activities can be fixed or flexible.
- Optimize may move/resize existing flexible activities only.
- Optimize must not invent new activities.
- No recurring schedules in MVP.
- No weekly/monthly planning in MVP.
- No calendar integration in MVP.

## Execution

Native concept: start from notification and Done explicitly records the end.

Web conversion: Start is available from Today and browser alerts can remind while the page stays open. Done records actual end. No pause/resume.

If a task ends late, later colliding flexible activities cascade forward. Fixed activities are not silently moved.

## Gamification

Traditional XP + levels + streaks are included.

Baseline daily XP:
- commit tomorrow +30
- start at least one activity +20
- complete at least one activity +20
- finalize daily loop +30

XP rewards participation in the intentional-planning loop, not a high balance score.

## Business model

Free for the current MVP.

## Product success metric

Primary beta activation metric:

**Complete at least three full Plan → Execute → Review loops in the first seven days.**

Ongoing metric:

**Completed Daily Loops per Weekly Active User.**

Supporting metrics include plan commit rate, next-day return rate, Start rate, Done rate, Optimize usage/acceptance, and D7 retention.
