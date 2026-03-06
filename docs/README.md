# Magic School Learning Management System

<!-- responsive web page picture here -->

##Introduction

This README file contains information about the Magic School Learning Management System (LMS), its purpose, functionality, how to get started and how to run tests. The LMS allows 3 different types of users to access and interact accordingly with the Magic School system:

- Students can view and enroll in courses. They can check the courses they are enrolled on too.
- Teachers can create, view, edit and delete courses.
- Admin can also create, view, edit and delete courses, as well as manage users of the system.

Initial Wireframes can be viewed [here](https://www.figma.com/design/Awb57P0vDdMdV5rvqqdX1N/Magic-School-LMS?).

Please click here to access the website.

## Technical Aspects and Features

The LMS is composed of a React frontend and a Django REST framework backend, integrated with a SQLite database for data persistence.

The React frontend is responsible for rendering the user interface, routing and handling client-side interactions. The Django backend exposes RESTful API endpoints that manage authentication, validation and database operations.

When the frontend either requires data or performs an action (such as creating, updating or deleting a course or user) it sends a HTTP request to the specified API endpoint. Each request includes a JWT access token in the authorization header, allowing the user to be identified if the access token is valid. Authorization is role based, determining if the authenticated user is allowed to perform the requested action next. The appropriate serializer validates any incoming JSON data, confirming required fields are present and formatted correctly. If validation succeeds, the view performs the necessary database operations via Django’s ORM. The data retrieved from the database is serialized into a structured JSON response and returned to the frontend with a corresponding HTTP status code. Dependent on the failure scenario that occurs different HTTP status codes can also be returned (400 validation errors, 403 authorization failure, etc.)

Additional to the backend authorization, the frontend enforces role based page access via protected routes paired with an auth context provider that retains the users' role and JWT tokens. A refresh token is also stored, allowing user's to obtain a new access token without requiring the user to login again. Upon logout the backend blacklists tokens from future use.

## Technologies Used

- [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) was used for the structure of the site.
- [CSS](https://developer.mozilla.org/en-US/docs/Web/css) was used to add styles and layout to the site.
- [CSS Flexbox](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox) was used to arrange items symmetrically on the pages.
- [React](https://react.dev/) was used to write the user interface and frontend.
- [Python Django](https://www.djangoproject.com/) was used to write the backend logic and REST APIs.
- [SQLite](https://www.sqlite.org/) was used for the database.
- [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for writing react tests.
- [VSCode](https://code.visualstudio.com/) was used as the main tool to write and edit code.
- [Git](https://git-scm.com/) was used for the version control of the website.
- [GitHub](https://github.com/) was used to host the code of the website.
- [Figma](https://www.figma.com/) was used for producing initial wireframes. Wireframes can be viewed [here](https://www.figma.com/design/Awb57P0vDdMdV5rvqqdX1N/Magic-School-LMS?).
- [Phind](https://www.phind.com/) used as a troubleshoot tool.

## Future enhancements

- When students enroll in an available course it is removed from the available courses section.
- Serializer for user login checks user is also active before attempting to log the user into their account.
- Admin's user management has option to mark a user as inactive/active.
- Ability for students to unenroll from courses.
- Format required field messages to be uniform.
- Fix re-opening after login to direct to user dashboard and not show the home page.

## Testing

The frontend react code has been succesfully tested with React Testing Library and Vitest:

screenshot of frontend tests passing

The backend Django Restframework API endpoints have been succesfully tested with APITestCase:
![API Endpoint Tests](docs\images\API-tests-OK.jpg)


## Deployment

The site was deployed to SITE. The steps to deploy are as follows:

The live link can be found [here]()

## Set up guide

how to set up and run the application locally
- clone repo
- .ven virtual environment set up
- activate BE
- change environment variable in fetch requests in frontend 

## Testing guide

how to run the tests
- frontend npm run test
- backend python manage.py test

## Credits

### - Inspiration

- Our weekly D&D game set in the magic school, Strixhaven University, with my friends and partner.
- My partner Laurie and our dog King for being the best rubber ducks.
- My mentor Andy for his guidance, feedback and encouragement.
- My student care advisor Vita for her support and understanding.

### Image Sources

- https://1d6chan.miraheze.org/wiki/Strixhaven
- https://magic.wizards.com/en/news/making-magic/strixhaven-part-2-2021-04-05
- https://www.dndbeyond.com/posts/1111-tour-strixhavens-biblioplex-and-the-chaotic-snarl?srsltid=AfmBOoonlG6M3T7Dq0G6s_WDm1uVMH3ZRhpq3mUI6_6pjZG-91rPEtE_
- https://startplaying.games/adventure/cm7glull4000yyiy1toey8zsa
