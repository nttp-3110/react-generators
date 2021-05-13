/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';

export const GuardianMW = ({ defaultPath, defaultRedirect, DefaultComponent }, { errorPath, errorRedirect, ErrorComponent }) => props => {
  const { context: { currentStudentId }, history, match: { path, params } } = props;

  switch (path) {
    case defaultPath:
      if (!!!currentStudentId) {
        if (errorRedirect) {
          history.replace(errorRedirect(currentStudentId, params));
          return null;
        }
        // return <ErrorComponent {...props} />;
        return <></>;
      }
      if (+params?.studentId !== currentStudentId) {
        history.replace(defaultRedirect(currentStudentId, params));
        return null;
      }
      // return <DefaultComponent {...props} />;
      return <></>;

    case errorPath:
      if (!!currentStudentId) {
        history.replace(defaultRedirect(currentStudentId, params));
        return null;
      }
      // return <ErrorComponent {...props} />;
      return <></>;

    default:
      return null;
  }
};
