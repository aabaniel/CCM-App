
gamified time scheduler 
mobile experience

i want to create a time-allocation/time-management app 

# mvp features:
- daily time allocation
- 24 hours
- list of tasks only for TODAY
- notifications for start and end of task


# Ideal User: collegiate student who wants to party, get internships, still call family from far away, and who want to maximize their DAY

# user perspective: 
1. can add tasks and when to do
2. can categorize tasks according to:
(Health & Biological (Sleep, exercise, nutrition)
Challenge / Productive (SWE, side projects, work, study)
Identity / Personal (Hobbies, creative pursuits)
Social & Leisure (Gaming, relaxation, relationships))
3. ai can also auto-categorize (output simple json file with "Task Name: ''", "Category": 'AI_RESPONSE')
4. AI recommends tasks within day to improve score
5. user is notified for every start of task
6. user is notified for every supposed end of task (also list down if excess time)
7. at start of new day, point system and score will be showed, with recommendations
score of 100: well balanced
score of 0: not healthy allocation of time
8. user can see score of previous day + see timeline of previous day + see pie chart of classifications based on hours spent + other data analytics

# what does this solve
solves how we allocate and assign tasks throughtout the day
solves task management
avoids doomscrolling because schedule is now fully allocated
avoids focusing on just work leading to overwork, focusing on playing too much, etc etc

# slogan
## "you focus on the life that you want to build"

# basic idea:
PLAN → LIVE → ADAPT → REFLECT → IMPROVE
Gamification should reward behavior, not perfection


# final scoring
the user can 
Final Scoring will be based on these papers:
# The Occupational Therapy Framework: Life Balance Inventory (LBI)

If you want academic validation for scoring **balance across activity classes**, look at:

* **Matuska, K. (2012)** — *"Description and Development of the Life Balance Inventory"* (*American Journal of Occupational Therapy*).
* **Matuska, K., & Christiansen, C. (2008)** — *"A Model of Lifestyle Balance"* (*Journal of Occupational Science*).

**How it works:**
Matuska groups tasks into four functional need categories:

1. **Health & Biological** (Sleep, exercise, nutrition)
2. **Challenge / Productive** (SWE, side projects, work, study)
3. **Identity / Personal** (Hobbies, creative pursuits)
4. **Social & Leisure** (Gaming, relaxation, relationships)

Instead of applying arbitrary moral weights (e.g., claiming "gaming is inherently bad"), the LBI quantifies balance through **Congruence**:

$$\text{Discrepancy} = \sum_{k} \vert{}T_{\text{actual}, k} - T_{\text{target}, k}\vert{}$$

A user defines an intentional target (e.g., Target: 8 hrs sleep, 6 hrs SWE, 1.5 hrs games). If the user plays 7 hours of games and works 2 hours, the variance triggers penalties, lowering the total Life Balance score.



# future work: 
- weekly, monthly time allocation
- google calendar integeration
- quality of schedule





TIMEBUDGET — 5-MINUTE PITCH
[0:00–0:35 — HOOK]
Imagine that every morning, someone deposits 1,440 dollars into your account.
You have to spend all of it before midnight.
You cannot save it. You cannot borrow from tomorrow. And once it's gone, it's gone.
Now replace dollars with minutes.
Every single day, we all receive exactly 1,440 minutes.
The question is: Are we actually spending those minutes on the life we say we want to build?
That is the idea behind TimeBudget.

[0:35–1:20 — THE PROBLEM]
Our initial ideal user is a college student.
Someone who wants to do well in school, land an internship, exercise, spend time with friends, pursue personal interests, and still remember to call their family.

In a U.S. survey of more than 18,000 undergraduate students, almost 79% reported experiencing moderate or high stress in the previous 30 days.

and for these students, the same research reports that up to 70% of college students identify themselves as procrastinators.

The problem is not necessarily that students don't know what they need to do.
We already have calendars, to-do lists, and productivity apps for that. 
The problem is that those tools usually answer:
“What do I need to do?”
But they don't really answer:
“Where is my life actually going?”

You can complete ten tasks and still realize that you slept four hours, studied all day, never exercised, and had no time for the people who matter to you.
So we approached time differently.
Instead of treating the day as a list of tasks, we treat it as a budget.

[1:20–3:15 — PRODUCT + LIVE DEMO]
[Open TimeBudget.]
This is TimeBudget.
At the center of the experience are your 1,440 minutes.
First, I decide what matters to me and how I want my day to be allocated.
We organize activities around major areas of life such as:
Health. Relationships. Identity. And Challenge or Interest.

And we can still account for things like commuting, chores, maintenance, and intentional free time.
[Show targets/categories.]
Next, I build my day.
For example, I'll add:
Study — 8:00 AM to 12:00 PM.
[Add activity.]
Immediately, TimeBudget accounts for those four hours.
I can now see how much of my day has been allocated and how much time I still have available.
Then maybe I add exercise.
[Add/edit another activity.]
And perhaps some time with family or friends.
[Show schedule/timeline.]
Now TimeBudget does something a normal to-do list doesn't.
It looks at my entire day and compares the time I've allocated against the priorities I personally set.
That gives me a Projected Alignment Score.
[Point to score.]
And this distinction is important:
A score of 100 does not mean TimeBudget thinks you've lived a perfect life.
It simply means:
“The day you planned closely matches the priorities you said were important to you.”
So if I change my schedule—
[Change/delete/shorten an activity and show score change.]
—the score changes with it.
The feedback is immediate.
I'm not waiting until the end of the week to discover that my priorities and my calendar were completely different.
I can see it before I live the day.

[3:15–4:10 — WHAT MAKES IT DIFFERENT]
That creates a simple loop:
Plan. Live. Adapt. Reflect. Improve.
Eventually, TimeBudget follows the user throughout the day.
When an activity is supposed to begin, the user receives a notification.
When it should end, TimeBudget asks whether it was completed, extended, or skipped.
That allows us to compare two things:
The day I intended to live versus the day I actually lived.
And this is where gamification becomes meaningful.
We don't want to reward people simply for working more.
We want to reward intentionality.
Planning your day. Following through. Making adjustments. Reflecting honestly. And improving over time.
So a difficult day doesn't mean, “You failed.”
It becomes information for designing tomorrow better.

[4:10–4:40 — AI / FUTURE VISION]
And this is also where AI becomes useful.
Not as something that decides what a good life should look like.
The user still owns that decision.
Instead, AI can act as an advisor.
If my schedule doesn't match the priorities I've set, TimeBudget can identify the gap and suggest better ways of arranging the activities that are already important to me.
The user remains in control.
AI helps optimize the allocation.

[4:40–5:00 — CLOSE]
Our lives are ultimately made up of how we spend our time.
Yet most of us carefully budget our money while barely budgeting our minutes.
TimeBudget changes that.
We give people a way to see their day as the finite resource that it is:
1,440 minutes. Your priorities. Your choices.
Because productivity isn't just about getting more things done.
It's about making sure that the things you do are building the life you actually want.
TimeBudget — build the life you want, one day at a time.
