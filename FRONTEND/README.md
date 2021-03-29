# Employee Management Application

## Web application using React Js, Next Js, Axios, Cloud Firebase DB, Material-UI, ExpressJS, NodeJS, Bookshelf.

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

This EMS Applications is cloud database powered, mobile compatible ReactJS-powered Application for managing the employee data for small amd medium scale organizations

## Features

- Two types of users can login to the system: Admin and User
- Admins can CREATE/DELETE/UPDATE/VIEW Employee's data in the company.
- Users can VIEW/Request Changes to their data own data.
- Users can apply for leave and check the status of their leave applications through the system
- Admins can approve/reject the leave applications.
- Users can ADD/UPDATE their weekly work schedules in the system.
- Admins can view their employee's weekly work schedules.
- Users can schedule meetings with their co-workers.
- Both users and admins get email notifications once their leaves are approved, meetings are scheduled.

#### Technologies used

This EMS Applications uses various open-source npm libraries and packages to make the UI simple and look better for users using the application:

- [ReactJs](https://reactjs.org/) - A JavaScript library for building user interfaces!
- [Material-UI](https://material-ui.com/) - React components for faster and easier web development.
- [Axios](https://github.com/axios/axios) - Promise based HTTP client for the browser and node.js.
- [NodeJS](https://nodejs.org/en/) - JavaScript runtime built on Chrome's V8 JavaScript engine
- [Express] - fast node.js network app framework [@tjholowaychuk]
- [Gulp] - the streaming build system
- [Webpack](https://webpack.js.org/) - Bundle your code
- [email-js](https://www.emailjs.com/docs/examples/reactjs/) - Send Email Directly From JavaScript Apps
- [immer](https://immerjs.github.io/immer/) - package that allows you to work with immutable state in a more convenient way
- [react-hot-toast](https://react-hot-toast.com/) - Smoking hot React notifications

And many other packages like react-datepicker,react dom, moment, bookshelf, knex are being used in this application.

## Installation

This EMS applications requires [Node.js](https://nodejs.org/) v8+ to run.

- Clone the application repository from - [Github](https://github.com/shabbi268/Employee-Management-System)
- Install the dependencies and devDependencies and start the server.
- Open the repository in any of the code editor of your choice and go the FRONTEND directory of the project in the Terminal and execute the below command

## Development

```sh
npm i
```

## For production environments...

```sh
npm install --production
NODE_ENV=production node app
```

Open your favorite Terminal and run these commands.

First Tab:

```sh
npm run dev
```

Second Tab:

```sh
npm run webpack:dev
```
