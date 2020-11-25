TEMPLATE FOR RETROSPECTIVE (Team 8)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done  7/7
- Total points committed vs done 24/24
- Nr of hours planned vs spent (as a team) 72h/66h26m

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| #0   |     10    |     |     29h5m      |    30h4m        |
| _#1_   |     2    |    3  |    3h       |    3h34m         |
| #2    |     2   |    3    |     2h40m      |    6h29m          |
| #3     |     2  |   5    |    1h40m       |    4h36m          |
| #4   |     2   |      2  |     1h       |     3h         |
| #5      |   2      |   3     |  1h          |     5h12         |
| #6     |     2   |   5     |      4h30m     |      1d3h46m        |
| #7     |     2    |   3     |    1h      |      1h49m        |

   

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation):2h46m

- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table :67%

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated:12h
  - Total hours spent:12h16m
  - Nr of automated unit test cases :53
  - Coverage (if available)
  ![image](https://github.com/S274294/PULSeBS-Team8/blob/master/Retrospectives/coverage.png)
- E2E testing:
  - Total hours estimated
  - Total hours spent
- Code review 
  - Total hours estimated 3h30m
  - Total hours spent:4h30m
- Technical Debt management:
  - Total hours estimated :3h
  - Total hours spent
  - Hours estimated for remediation by SonarQube:3h
  - Hours spent on remediation :4h50m
  - debt ratio (as reported by SonarQube under "Measures-Maintainability")：0%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability )：A，A，A
  


## ASSESSMENT

- What caused your errors in estimation (if any)?
Because we lack the experience of estimating the project, we did not think about review, fix, tests when we did the estimation.

- What lessons did you learn (both positive and negative) in this sprint?
positive：More communication helps us solve problems more efficiently.
We can plan and assign tasks better.
negative：We should improve our ability of estimation.

- Which improvement goals set in the previous retrospective were you able to achieve? 
  We improve our skills about React.js.
- Which ones you were not able to achieve? Why?

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

> Propose one or two

Each of us should learn to estimate hours correctly,and improve our skills.
And we add review,fix,tests under every story,This can better evaluate our working hours.In addition,we will timely communication to help each other.

- One thing you are proud of as a Team!!
