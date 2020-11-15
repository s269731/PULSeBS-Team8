import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import TeacherPage from './TeacherPage';
import API from "../../api/api";

test('Teacher page rendering with lectures', async () => {

  const mockGetLectures = jest.spyOn(API, 'getLectures');
  mockGetLectures.mockReturnValue(
    new Promise(resolve => resolve([{"id":1,"subject":"SoftwareEngineering II","date":"2020-11-20","hour":"15:26","modality":"In person","room":"12A","capacity":150,"bookedStudents":100,"teacherName":"Franco yjtyjty","lectureId":1,"booked":false},{"id":2,"subject":"SoftwareEngineering II","date":"2020-11-28","hour":"17:26","modality":"In person","room":"12A","capacity":50,"bookedStudents":100,"teacherName":"Franco yjtyjty","lectureId":2,"booked":false},{"id":4,"subject":"SoftwareEngineering II","date":"2020-11-17","hour":"17:26","modality":"In person","room":"12A","capacity":50,"bookedStudents":100,"teacherName":"Franco yjtyjty","lectureId":4,"booked":false}]))
  );
  const mockNotLoggedUser = jest.fn();

  render(<TeacherPage notLoggedUser={mockNotLoggedUser} />)

  expect(screen.getByTestId('teacher-page')).toBeInTheDocument();

  await waitFor(() => expect(mockGetLectures).toHaveBeenCalledTimes(1))
  await waitFor(() => expect(mockNotLoggedUser).toHaveBeenCalledTimes(0))
})

test('Teacher page rendering with failing lectures api', async () => {

  const mockGetLectures = jest.spyOn(API, 'getLectures');
  mockGetLectures.mockReturnValue(
    new Promise((resolve, reject) => { reject({status:401}) })
  );
  const mockNotLoggedUser = jest.fn();

  render(<TeacherPage notLoggedUser={mockNotLoggedUser}/>)

  expect(screen.getByTestId('teacher-page')).toBeInTheDocument();

  await waitFor(() => expect(mockGetLectures).toHaveBeenCalledTimes(1))
  await waitFor(() => expect(mockNotLoggedUser).toHaveBeenCalledTimes(1))
  expect(screen.getByTestId('error-message')).toBeInTheDocument();

})

