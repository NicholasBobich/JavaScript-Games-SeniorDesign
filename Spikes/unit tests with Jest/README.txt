Using jest to make unit tests
https://jest-bot.github.io/jest/docs/configuration.html

Will need to install npm.
then use 'npm install --save-dev jest' to install jest

a file called 'package.json' will need to be created with the text:
{
  "scripts": {
    "test": "jest"
  }
}

To run the tests type 'npm run test'