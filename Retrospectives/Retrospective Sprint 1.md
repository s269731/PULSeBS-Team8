RETROSPECTIVE SPRINT 1 (Team 8)
=====================================


- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done  6/7
- Total points committed vs done 21/24
- Nr of hours planned vs spent (as a team) 72h/66h 26m

N.B.: actually, at the first Demo, we've shown also story 7, even if not completely working (we discovered a bug just some minutes before the demo).

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| #0     |   10    |        |   29h 5m   |  30h 4m      |
| #1     |    2    |   3    |    3h      |    3h 34m    |
| #2     |    2    |   3    |   2h 40m   |    6h 29m    |
| #3     |    2    |   5    |   1h 40m   |    4h 36m    |
| #4     |    2    |   2    |     1h     |     3h       |
| #5     |    2    |   3    |     1h     |   5h 12m     |
| #6     |    2    |   5    |  4h 30m    |   11h 46m    |
| #7     |    2    |   3    |    1h      |  1h 49m      |



- Hours per task (average, standard deviation): average 2h 46m - standard deviation 5h 57m
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table: 0.66

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 
  - Total hours spent: 12h 16m
  - Nr of automated unit test cases: 
  - Coverage (if available)
  ![image](https://github.com/s269731/PULSeBS-Team8/blob/master/Retrospectives/coverageS1.png)
- E2E testing:
  - Total hours estimated
  - Total hours spent
- Code review 
  - Total hours estimated 3h 30m
  - Total hours spent: 4h 30m
- Technical Debt management:
  - Total hours estimated: 3h
  - Total hours spent: 2h 35m 
  - Hours estimated for remediation by SonarQube: 3h
  - Hours spent on remediation: 4h 50m
  - debt ratio (as reported by SonarQube under "Measures-Maintainability")：0%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability )：A，A，A
  


## ASSESSMENT

- What caused your errors in estimation (if any)?

  First of all, we didn't estimate time for each part of the work (implementation, reviewing, testing), but only for the task in general. Secondly, we underestimated a lot of tasks, surely because we didn't take into consideration our evident lack of experience but also since we weren't so precise in terms of time required for each part of the work.

- What lessons did you learn (both positive and negative) in this sprint?

  Positive：communication and peer programming helped us to overcome obstacles more quickly.
  
  Negative：we should improve our capability of estimation and be more precise.

- Which improvement goals set in the previous retrospective were you able to achieve? 

  We improved our skills about React.js and testing, also thanks to some peer programming sessions.

- Which ones you were not able to achieve? Why?

  We weren't able to improve our capability of estimating, especially because of lack of adequate experience regarding that.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.). Propose one or two

  In order to do a better work we surely must try to estimate better, by taking in consideration possible factors (that may cause waste of time), and furthermore we have to create more precise subtasks for each task (and estimate them as well).

- One thing you are proud of as a Team!!
  We didn't encounter any problem in auto-assigning tasks and cooperation among team members was very good.
