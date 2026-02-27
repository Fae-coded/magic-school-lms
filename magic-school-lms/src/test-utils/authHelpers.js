const makeAdminAuth = () => ({
  user: { role: 'admin' },
  tokens: { access: 'admin-token' },
});

const makeTeacherAuth = () => ({
  user: { role: 'teacher' },
  tokens: { access: 'teacher-token' },
});

const makeStudentAuth = () => ({
  user: { role: 'student' },
  tokens: { access: 'student-token' },
});

export { makeAdminAuth, makeTeacherAuth, makeStudentAuth };
