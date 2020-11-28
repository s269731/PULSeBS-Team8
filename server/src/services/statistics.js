const moment = require('moment');
const db = require('../db');
const subjectDao = require('../subjectsDao');
const lecturesDao = require('../lecturesDao');

function weeksBetween(date1, date2) {
  // The number of milliseconds in one week
  const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;
  // Convert both dates to milliseconds
  const date1_ms = date1.getTime();
  const date2_ms = date2.getTime();
  // Calculate the difference in milliseconds
  const difference_ms = Math.abs(date1_ms - date2_ms);
  // Convert back to weeks and return hole weeks
  return Math.floor(difference_ms / ONE_WEEK);
}

function getWeekId(date, dayofweek) {
  const firstdayofweek = moment(date).subtract(dayofweek - 1, 'days').format('YYYY-MMMM-DD');
  const weekendcap = 7 - dayofweek;
  const lastdayofweek = moment(date).add(weekendcap, 'days').format('YYYY-MMMM-DD');
  const monthofirstdayofweek = firstdayofweek.split('-')[1].substring(0, 3).toUpperCase();
  const firstday = firstdayofweek.split('-')[2];
  const lastday = lastdayofweek.split('-')[2];
  const monthoflastdayofweek = lastdayofweek.split('-')[1].substring(0, 3).toUpperCase();
  const year = firstdayofweek.split('-')[0];
  if (monthofirstdayofweek === monthoflastdayofweek) return `${firstday}-${lastday} ${monthofirstdayofweek} ${year}`;
  return `${firstday} ${monthofirstdayofweek}-${lastday} ${monthoflastdayofweek} ${year}`;
}

async function computeTeacherStatistics(teacherId) {
  const subjects = await subjectDao.getSubjectsByTeacherId(teacherId);
  const statsArray = [];
  let dailystatsarray = [];
  let weeklystatsarray = [];
  let monthlystatsarray = [];
  let subjectId;
  let weeklylesson = 0;
  let monthlylesson = 0;
  let weeklybookedseats = 0;
  let monthlybookedseats = 0;
  let weeklyunoccupiedseats = 0;
  let monthlyunoccupiedseats = 0;

  // eslint-disable-next-line no-restricted-syntax
  await Promise.all(subjects.map(async (subject) => {
    const lectures = await lecturesDao.getLecturesBySubjectId(subject.SubjectId);
    let month;
    let dayofweekbefore = 0;
    let dayofweek;
    let daybefore;
    let monthId;
    let monthlyavgbookings;
    let monthlyavgunoccupiedseats;
    let year;
    let actualmonth;
    let weekId;
    let weeklyavgbookings;
    let weeklyavgunoccupiedplaces;

    if (subjectId === undefined) subjectId = subject;

    lectures.forEach((lecture) => {
      const date = lecture.DateHour;
      const d = new Date(date);
      const dstring = d.toString();
      actualmonth = dstring.split(' ')[1];
      year = dstring.split(' ')[3];
      const unoccupiedSeats = lecture.Capacity - lecture.BookedPeople;
      // console.log({ subjectId, lecture });
      dailystatsarray.push({ date, bookedSeats: lecture.BookedPeople, unoccupiedSeats });

      if (dayofweek === undefined) {
        dayofweek = d.getDay();
        dayofweekbefore = dayofweek;
        daybefore = d;
      }
      dayofweek = d.getDay();
      // dayweekbefore<dayofweek or weeksbetween>=1
      // eslint-disable-next-line max-len
      // if just the first constraint is left, for example if its Wednesday 11, Friday 27 will be counted as the same week
      if (dayofweekbefore > dayofweek || weeksBetween(d, daybefore) >= 1) {
        // week ended, push the stats for this month in the weeklystatsarray
        weekId = getWeekId(daybefore, dayofweekbefore);
        weeklyavgbookings = weeklybookedseats / weeklylesson;
        weeklyavgunoccupiedplaces = weeklyunoccupiedseats / weeklylesson;
        weeklystatsarray.push({ weekId, weeklyavgbookings, weeklyavgunoccupiedplaces });
        weeklylesson = 0;
        weeklybookedseats = 0;
        weeklyunoccupiedseats = 0;
        // dayofweek = undefined;
      }
      dayofweekbefore = dayofweek;
      daybefore = d;
      console.log(month);
      console.log(actualmonth);
      if (month === undefined) month = actualmonth;
      if (month !== actualmonth) {
        // month ended, push the stats for this month in the monthlystatsarray
        monthId = `${month}-${year}`.toUpperCase();
        monthlyavgbookings = monthlybookedseats / monthlylesson;
        monthlyavgunoccupiedseats = monthlyunoccupiedseats / monthlylesson;
        monthlystatsarray.push({ monthId, monthlyavgbookings, monthlyavgunoccupiedseats });
        monthlylesson = 0;
        monthlybookedseats = 0;
        monthlyunoccupiedseats = 0;
        // month = actualmonth;
        month = undefined;
      }
      month = actualmonth;
      // eslint-disable-next-line no-plusplus
      weeklylesson++;
      // eslint-disable-next-line no-plusplus
      monthlylesson++;
      weeklyunoccupiedseats += unoccupiedSeats;
      monthlyunoccupiedseats += unoccupiedSeats;
      weeklybookedseats += lecture.BookedPeople;
      monthlybookedseats += lecture.BookedPeople;
    });
    // eslint-disable-next-line max-len
    // Lectures for that subjectId ended, push subjectId, dailystatsarray, weeklystatsarray, monthlystatsarray in the statsArray
    weekId = getWeekId(daybefore, dayofweekbefore);
    weeklyavgbookings = weeklybookedseats / weeklylesson;
    weeklyavgunoccupiedplaces = weeklyunoccupiedseats / weeklylesson;
    weeklystatsarray.push({ weekId, weeklyavgbookings, weeklyavgunoccupiedplaces });
    weeklylesson = 0;
    weeklybookedseats = 0;
    weeklyunoccupiedseats = 0;
    dayofweek = undefined;

    monthId = `${month}-${year}`.toUpperCase();
    monthlyavgbookings = monthlybookedseats / monthlylesson;
    monthlyavgunoccupiedseats = monthlyunoccupiedseats / monthlylesson;
    monthlystatsarray.push({ monthId, monthlyavgbookings, monthlyavgunoccupiedseats });
    monthlylesson = 0;
    monthlybookedseats = 0;
    monthlyunoccupiedseats = 0;
    statsArray.push({
      subjectId: subject, dailystatsarray, weeklystatsarray, monthlystatsarray,
    });
    dailystatsarray = [];
    weeklystatsarray = [];
    monthlystatsarray = [];
    subjectId = undefined;
  }));
  console.log(statsArray);
  console.log(statsArray[0]);
  return statsArray;
}

exports.computeTeacherStatistics = computeTeacherStatistics;
