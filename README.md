# Simple server to push empty commit to a given branch

### WHY?
CircleCI applies sanctions to Russia so it doesn't run tests for some of our devs.
The workaround we have been doing is pushing an empty commit to their branch from a non-Russian account. However, this creates a dependency and constantly interrupts the other developers.
This is a server so that Russian devs can self-serve.

### Specs and features:
- Node JS and express
- Uses [simple-git](https://www.npmjs.com/package/simple-git) to connect to Git
- Simple password protection
- Logging with Pino
- Dev live reloading with Nodemon

### Setup steps:
1. Run `yarn install`
2. Create an `.env` file copying the `.env.example` and adjusting the values
3. Start API with `yarn start:dev`

### Getting Github Oauth token:
- Go to Github/Settings/Developer Settings/Personal Access Tokens/Create token
- You might need to authorize Organizations if they require it
<img width="1204" alt="image" src="https://user-images.githubusercontent.com/17788257/184656922-426f165c-aad5-4410-a72b-3a6932e68201.png">

### Endpoint:
```
POST localhost:3001/v1/commit

Params:
{
  "branch":"test/mybranch",
  "repo": "myrepo",
  "password": "sample",
}
```

Example with curl:
```bash
curl -d '{"repo":"myrepo", "branch":"test/mybranch", "password":"somesecurepassword" }' -H "Content-Type: application/json" -X POST localhost:3001/v1/commit
```
