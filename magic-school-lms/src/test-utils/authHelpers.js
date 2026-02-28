// helpers to create mock authentication objects.  Each function accepts an
// optional `overrides` object so tests can supply things like a username or
// change the role without needing to duplicate the whole structure.

const makeAdminAuth = (overrides = {}) => ({
  user: { role: 'admin', username: 'Admin', ...overrides },
  tokens: { access: 'admin-token' },
});

const makeTeacherAuth = (overrides = {}) => ({
  user: { role: 'teacher', username: 'Teacher', ...overrides },
  tokens: { access: 'teacher-token' },
});

const makeStudentAuth = (overrides = {}) => ({
  user: { role: 'student', username: 'Student', ...overrides },
  tokens: { access: 'student-token' },
});

export { makeAdminAuth, makeTeacherAuth, makeStudentAuth };
