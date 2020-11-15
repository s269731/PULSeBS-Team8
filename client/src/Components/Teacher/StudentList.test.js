import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import StudentList from './StudentList';
import API from "../../api/api";

test('StudentList modal rendering with student list', async () => {

  const mockGetStudentList = jest.spyOn(API, 'getStudentListByLectureId');
  mockGetStudentList.mockReturnValue(
    new Promise(resolve => resolve([{name:"aa",surname:"bb",email:"a@b.c"},{name:"zz",surname:"yy",email:"z@y.x"}]))
  );
  const mockNotLoggedUser = jest.fn();

  render(<StudentList notLoggedUser={mockNotLoggedUser} />)

  const leftClick = { button: 0 }
  userEvent.click(screen.getByTestId('studentlist-button'), leftClick)
  await waitFor(() => expect(mockGetStudentList).toHaveBeenCalledTimes(1))
  await waitFor(() => expect(mockNotLoggedUser).toHaveBeenCalledTimes(0))

  expect(screen.getByTestId('studentlist-modal')).toBeInTheDocument();
  //close button
  userEvent.click(screen.getByTestId('close-button'), leftClick);
})

test('StudentList modal rendering without student list', async () => {

  const mockGetStudentList = jest.spyOn(API, 'getStudentListByLectureId');
  mockGetStudentList.mockReturnValue(
    new Promise((resolve,reject) => {reject({status:401})})
  );
  const mockNotLoggedUser = jest.fn();

  render(<StudentList notLoggedUser={mockNotLoggedUser} />)

  const leftClick = { button: 0 }
  userEvent.click(screen.getByTestId('studentlist-button'), leftClick)
  await waitFor(() => expect(mockGetStudentList).toHaveBeenCalledTimes(1))
  await waitFor(() => expect(mockNotLoggedUser).toHaveBeenCalledTimes(1))

  expect(screen.getByTestId('error-message')).toBeInTheDocument();

})
