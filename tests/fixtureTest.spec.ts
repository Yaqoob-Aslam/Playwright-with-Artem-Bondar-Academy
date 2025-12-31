import { test } from './fixture';

test('Where is my candy', async ({helloWorld}) => {
  console.log(helloWorld);
  console.log('Where is my candy?')
})

test('I am alive', async ({greatDay}) => {
  console.log(greatDay);
  console.log('I am alive!')
});