SPRINT 2 RETROSPECTIVE (Team 8)
=====================================

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done 9/9
- Total points committed vs done 45/45
- Nr of hours planned vs spent (as a team) 72h/68h 49m


**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |   6     |    -   |  21h       |  23h 28m     |
| 7      |   1     |    3   |    20m     |  20m         |
| 8      |   2     |    2   |  1h 40m    |  1h 40m      |
| 9      |   6     |    3   |  3h 40m    |  3h          |
| 10     |   5     |    8   |  10h       |  9h 43m      |
| 11     |   6     |    8   |  8h        |  7h 42m      |
| 12     |   5     |    13  |  18h       |  16h 49m     |
| 13     |   5     |    3   |  2h 40m    |  2h 10m      |
| 14     |   3     |    3   |  2h        |  1h 52m      |
| 15     |   1     |    2   |  1h 30m    |  30m         |
   
N.B.: story 7 was almost finished already for the previous Sprint. We just had to test that a little better.


- Hours per task (average, standard deviation): average 28m, standard deviation 

- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table: 1.02

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 5h 30m
  - Total hours spent: 6h 5m
  - Nr of automated unit test cases: 46 (frontend) + 69 (backend)
  - Coverage: 86%
- E2E testing:
  - Total hours estimated: -
  - Total hours spent: -
- Code review 
  - Total hours estimated: 1h 22m
  - Total hours spent: 1h 15m
- Technical Debt management:
  - Total hours estimated: 3h
  - Total hours spent: 3h
  - Hours estimated for remediation by SonarQube: ?????
  - Hours spent on remediation: 3h
  - debt ratio (as reported by SonarQube under "Measures-Maintainability") 0%
  - rating for each quality characteristic reported in SonarQube under "Measures": Reliability:A, Security: A, Maintainability: A  


## ASSESSMENT

- What caused your errors in estimation (if any)?

  Some tasks were a bit overestimated, but not that much.

- What lessons did you learn (both positive and negative) in this sprint?

  Positive: estimation was improved a lot with the respect to the previous Sprint, together with the split of a story into tasks.

  Negative: we had some last-minute bugs to fix, and this caused a little bit of anxiety.

- Which improvement goals set in the previous retrospective were you able to achieve? 

  We were able to estimate better than the previous Sprint, and furthermore we were more precise in splitting a story into subtasks (including also tasks for code review and testing).
  
- Which ones you were not able to achieve? Why?

  None.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.). Propose one or two

  We need to invest some time to learn how to perform automatic E2Etesting of the whole app, with tools such as puppeteers or similar.

  Currently, we run extensive integration tests separately for both client (by mocking server calls) and server, and test the entire app only manually while developing.
  Hence, we couldn't estimate and track the time spent on this, because we didn't define rigorously use cases.

- One thing you are proud of as a Team!!

  We're satisfied about how we're working together and happy to have received positive feedbacks during the demo.
