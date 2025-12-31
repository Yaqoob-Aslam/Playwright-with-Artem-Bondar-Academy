import { test } from './fixture';

test('Where is my candy', async ({helloWorld}) => {
  console.log(helloWorld);
  console.log('Where is my candy?')
})

test('I am alive', async ({greatDay, cupOfCoffee}) => {
  console.log(greatDay); //Calling greatDay fixture
  console.log(cupOfCoffee); //Calling cupOfCoffee fixture
})