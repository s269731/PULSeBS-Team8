SPRINT 3 RETROSPECTIVE (Team 8)
=====================================

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done 6/6
- Total points committed vs done 42/42
- Nr of hours planned vs spent (as a team) 72h/66h 30m


**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |   8     |    -   |  36h 40m   |  29h 39m     |
| 16     |   5     |    5   |  6h 15m    |  10h 40m     |
| 17     |   6     |    8   |  5h 50m    |  6h 5m       |
| 18     |   6     |    3   |  2h 25m    |  2h 40m      |
| 19     |   5     |    3   |  2h 35m    |  2h 30m      |
| 20     |   6     |   21   |  19h       |  13h 35m     |
| 21     |   3     |    2   |  1h 30m    |  1h 20m      |



- Hours per task (average, standard deviation): average 1h 42m, standard deviation 2h 26m

- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table: 4455/3989 = 1.11

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 11h 45m
  - Total hours spent: 12h 5m
  - Nr of automated unit test cases: 59 (frontend) + 100 (backend)
  - Coverage: 82.2%
- E2E testing:
  - Total hours estimated: 13h
  - Total hours spent: 8h 33m
  
  We were finally able to automate E2E testing.

- Code review 
  - Total hours estimated: 1h 45m
  - Total hours spent: 1h 20m
- Technical Debt management:
  - Total hours estimated: 3h
  - Total hours spent: 50m
  - Hours estimated for remediation by SonarQube: 2h 38m
  - Hours spent on remediation: 50m (1 bug + some smells not completely solved)
  - debt ratio (as reported by SonarQube under "Measures-Maintainability") 0%
  - rating for each quality characteristic reported in SonarQube under "Measures": Reliability: E, Security: A, Maintainability: A  
  N.B.: the bug signaled by Sonarcloud is not a real bug, since the system considers as infinite a while loop that actually isn't.


## ASSESSMENT

- What caused your errors in estimation (if any)?

  We overestimated story 20, because we thought that this story would have required more time in order to fix the database structure, making it coherent with the provided .csv files. Furthermore, we underestimated story 16, that actually required more time than the expected one.

- What lessons did you learn (both positive and negative) in this sprint?

  Positive: although some errors in the estimation of single stories, we obtained an estimation error ratio really better than previous sprints.

  Negative: we had some last-minute bugs to fix, and this caused a little bit of anxiety.

- Which improvement goals set in the previous retrospective were you able to achieve? 

  We estimated better than previous sprints and, furthermore, we were able to write automated E2E testing.
  
- Which ones you were not able to achieve? Why?

  Estimation was not perfectly fine.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.). Propose one or two

  During the demo, we discovered a little misunderstanding regarding one story. In order to avoid this kind of problems, surely we will try to ask more questions when the requirements of a story are not so specific.

- One thing you are proud of as a Team!!

  We have received positive feedbacks during the demo, and we are satisfied of how it has gone.
