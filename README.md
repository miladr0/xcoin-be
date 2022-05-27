### Features

- **DataDog** trace performance.
- **Sentry** catch errors.
- **API Documentation** using **Swagger**.
- **Basic Security Features** using Helmet and hpp.
- **Validation** using class-validator
- **class base routing** using routing-controllers
  ...

<br />

## ❯ Getting Started

1- install dependencies

```bash
yarn
```

2- use docker-compose, if you prefer to only run mongodb inside container and run Node.js app locally, you can comment it out in docker-compose file.

```bash
docker-compose up
```

3- set `.env.development.local` file with your credentials.

4- run the app

```bash
yarn run dev
```

<br />

you can access swagger documentation at `http://localhost:3000/api-docs`
