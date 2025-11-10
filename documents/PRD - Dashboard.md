# PRD - Dashboard


Add icon Add cover
PRD - Dashboard
Meetings
Tue, Aug 26, 2025 Wassam presents their Wayloader report template 
for PowerBi - here
User Problem:  
I am not able to see all my information in one place, or easily understand the 
areas that I should be focusing on using the Wayloader platform 
Why is this important 
There is so much information collated in Waylaoder when it's being used by 
clients, that it is difficult to sieve this into actionable information. This results in 
users addressing tasks one at a time, instead of potentially identifying groups 
of issues, identifying important trends or making ready tasks for the WWP in a 
more streamlined manner.
Examples and research  
• Discussion 1 with Omar
• There seems to be two separate potential approaches
1. We can build our own solution for data analysis, graphs and wire 
everything up OR
2. We can embed PowerBi using an inline frame and just use their 
solution placed in our platfrom
• Discussion 2 with Omar:
• Dashboards conversation:
1. There won't be a difference on the performance between iFrame 
pBi solution and native - Jasons team are using an API to access 
the data anyway
03/11/2025, 11:45 PRD - Dashboard
https://loop.cloud.microsoft/print/eyJwIjp7InUiOiJodHRwczovL3Vjb25pYS5zaGFyZXBvaW50LmNvbS86Zmw6L3IvY29udGVudHN0b3JhZ2UvQ1NQXzA4… 1/7


---


2. Embedded type solutions can be opened while doing something 
else on the Product
3. Native solution will not have a click through from powerbi to 
Wayloader
a. Powerbi will show but not give the dive down
4. Making the POwerbi responsiveness would be difficult with 
iFrames but there is react or other solutions for this to make it 
more responsive
5. Embedding will be the entire report with all the widgets in one 
place
6. Configurability will need to be part of the native solution but 
would take a lot more time
a. How to charge for the simple vs complex data analysis
7. There are built dashboards out of the box
a. Construction site leader sde there was sufficinet information in 
the data and dashboard
b. Jason Rymer was involve in the process (with JC), Paddy were 
the main people included in understanding the dashboards 
that were required
8. Focusing on top priority
9. Reasons for native development solution
a. Looks native to the Product
b. Have more control over how the data is presented
c. Far more options with connections between modules and 
options to surface information and link up the dashboard with 
the source information
i. Ability to dive down into detail you see in charts and find 
the original source
d. More future development possibilities such as configurability 
of specific widgets and the data they show
10. Reasons for PowerBi embed solution
a. Will be much faster to develop
03/11/2025, 11:45 PRD - Dashboard
https://loop.cloud.microsoft/print/eyJwIjp7InUiOiJodHRwczovL3Vjb25pYS5zaGFyZXBvaW50LmNvbS86Zmw6L3IvY29udGVudHN0b3JhZ2UvQ1NQXzA4… 2/7


---


b. Will need far less Product discovery and time up front to 
understand the user needs, use cases and connectivity 
between data points within the report
c. Will be able to deliver all that powerBi can offer straight away, 
rather than drip feed of metrics / graphs
d. New analysis, graphs or metrics being generated will not 
require engineering time to develop and add to the 
dashboard, powerbi will just need a data analyst and this 
would be much faster
• Pain Points to solve:
• Plan contains many tasks that are primarily viewed in a long list, 
making it difficult to identify where needs the most attention or 
even more challenging to identify patterns to what is causing the 
problem due to lack of summarised data
• Getting an overview of all, or the highest priority, 
issues/tasks/variances etc. is difficult
• Location is not visually connected to tasks in Wayloader
• Moving to Powerbi dashboard feels disconnected from the 
Product experience
• Dashboards are overwhelming to more novice users with so 
much information present 
• I cannot see how each contractor is getting on with the WWP 
they have committed to completing. As a scheduer of the GC 
Proj, What PPC, SPI for each contractors WWP. I cannot see this 
live as the week is ongoing   
Jobs to be done 
1. Run the Look ahead planning meeting and have the team commit 
to the weekly work plan.
2. Understand the health of the project and whether the project is 
on track
3. Identify areas of work or teams that need more attention or are 
consistently behind
03/11/2025, 11:45 PRD - Dashboard
https://loop.cloud.microsoft/print/eyJwIjp7InUiOiJodHRwczovL3Vjb25pYS5zaGFyZXBvaW50LmNvbS86Zmw6L3IvY29udGVudHN0b3JhZ2UvQ1NQXzA4… 3/7


---


4. Identify the contractors that are most and least successful for 
awards and calling out
5. Find the tasks that have changed from the P6 and export those 
changes out to fill out the P6
6. View the progress of tasks through the lens of the floor plan 
locations to identify patterns and facilitate meetings
7. Track the work progression through the WWP and understand the 
live update from each contractor on how they are doing with the 
tasks they committed to completing
Requirements:
1. As a Last Planning Coordinator, I want metrics and visualisations that 
help to run the 6 week look ahead meetings, such that I can reduce 
the number of constraints faster and more consistently 
2. As a Last Planning Coordinator, I want to view the constraints for tasks 
in the look ahead window in aggregate or in summary, such that I can 
identify common traits between constraints and handle them 
together / identify patterns.
3. As a Project coordinator, I want to understand the overall health of 
the project, such that I can identify trends that might need to be 
rectified before they cause more issues
4. As a Last planning coordinator, I want to be guided towards solving 
the problems that are occuring instead of just notified of the 
problems, such that there is a more seamless transition from 
identifying the problem to being able to resolve it.
5. As a Last planner coordinator, I want metrics and visualisations to 
measure the success of the current weekly work plan (WWP) as the 
WWP progresses, such that I can identify issues in the teams 
delivering work and resolve them before they delay tasks and hold 
contractors that are performing poorly accountable (Barry request)
6. As a Last planner coordinator, I want to be able to visualise variances 
in an actionable way, such that I can learn from past mistakes and 
improve the process going forward
7. As a scheduler, I want to understand how the data coming from site is 
different to the P6 import at the beginning of the week, such that I 
03/11/2025, 11:45 PRD - Dashboard
https://loop.cloud.microsoft/print/eyJwIjp7InUiOiJodHRwczovL3Vjb25pYS5zaGFyZXBvaW50LmNvbS86Zmw6L3IvY29udGVudHN0b3JhZ2UvQ1NQXzA4… 4/7


---


can understand the risks and opportunities that this changing data 
represents live, instead of during the end of the week export
8. As a Last planner coordinator, I want to view the task that are in the 
Weekly work plan in relation to where they exist on the floor plan, 
such that I can visually see the progress and issues associated with 
specific areas of the project (we are consistently told that the people 
on the ground orient themselves based on location, so this is 
important - if it exists in the dashboards space...)
9. As a Last planner coordinator, I want to be able to view the success of 
previous WWPs and measure the success of them through simple 
graphs stratified by common metadata, such that I can identify trends 
and improve the future work completion
10. As a sub contractor lead, I want to be able to measure the efficiency 
of the work being done on the site as part of my WWP, such that I can 
understand if I am losing money due to inefficient work (i.e. measure 
the spent hours for resources on a task vs the planned hours for that 
task)
Design Considerations: 
Major design areas to be: 
• Global projects dashboard (Portfolio)
• Project Based Overview Dashboards
• Dashboards as a saved view (separate tab or base overview tab in saved 
view)
• Assistive integrated dashboard blocks (expandable/optional) in various 
views and app areas
List of dashboard data visualization widgets: 
• Issues/Constraints/Problems: amount, %, status (open/resolved);
• Risk & Opportunity Live Feed or Chart
• Lookahead Metrics: % made ready / % not ready / % with constraints on
• Workload: Number of tasks per assignee
03/11/2025, 11:45 PRD - Dashboard
https://loop.cloud.microsoft/print/eyJwIjp7InUiOiJodHRwczovL3Vjb25pYS5zaGFyZXBvaW50LmNvbS86Zmw6L3IvY29udGVudHN0b3JhZ2UvQ1NQXzA4… 5/7


---


• Work Completion Retro: Number of tasks assigned completed vs delayed 
(reviewed within Week or long-term timespan to track performance)
• ...
1. Global projects dashboard (Portfolio): 
Widgets to include
What can be configured: 
2.Project Based Overview Dashboards: 
Widgets to include
What can be configured: 
3. Dashboards as a view:
Widgets to includ
What can be configured: 
4. Assistive dashboard blocks: 
4.1 List view ( constraints only mode ) 
Feature requests:
1. Link FRs from Forms
Design and development links:
Embed Figma links:
Azure DE links:
• Epic link -   
 Azure DevOps Services | Sign In
03/11/2025, 11:45 PRD - Dashboard
https://loop.cloud.microsoft/print/eyJwIjp7InUiOiJodHRwczovL3Vjb25pYS5zaGFyZXBvaW50LmNvbS86Zmw6L3IvY29udGVudHN0b3JhZ2UvQ1NQXzA4… 6/7


---


Description of Solution:
Metrics
Mixpanel / PowerBi
03/11/2025, 11:45 PRD - Dashboard
https://loop.cloud.microsoft/print/eyJwIjp7InUiOiJodHRwczovL3Vjb25pYS5zaGFyZXBvaW50LmNvbS86Zmw6L3IvY29udGVudHN0b3JhZ2UvQ1NQXzA4… 7/7