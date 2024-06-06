import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://127.0.0.1:5500/index.html');
});

const TODO_ITEMS = [
  'buy some cheese',
  'feed the cat',
  'book a doctors appointment',
  'read book'
];

test.describe('New Todo', () => {
  test('should allow me to add todo items', async ({ page }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create 1st todo.
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

   
    //count items in a list
    await expect(page.locator('#list')).toHaveCount(1)

      // Make sure the list only has one todo item.
      await expect(page.locator('.itemall .item')).toHaveText([
        TODO_ITEMS[0]
      ]);
    // Create 2nd todo.
    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press('Enter');

    // Make sure the list now has two todo items.
    await expect(page.locator('.itemall .item')).toHaveText([
      TODO_ITEMS[0],
      TODO_ITEMS[1]
    ]);
  });

  test('should clear text input field when an item is added', async ({ page }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create one todo item.
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    // Check that input is empty.
    await expect(newTodo).toBeEmpty();
  });

  test('should append new items to the bottom of the list', async ({ page }) => {
     // create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');
    await newTodo.fill(TODO_ITEMS[2]);
    await newTodo.press('Enter');
    await newTodo.fill(TODO_ITEMS[3]);
    await newTodo.press('Enter');

    await expect(page.locator('.itemall .item')).toHaveCount(2)
    await expect(page.locator('.itemall .item').nth(1)).toContainText('read book')
    //add another item and check 
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');
    await expect(page.locator('.itemall .item')).toHaveCount(3)
    await expect(page.locator('.itemall .item').nth(2)).toContainText('buy some cheese')
  });
});

test.describe('Check every button functionality', () => {
  test.beforeEach(async ({ page }) => {
   await createDefaultTodos(page)
   await expect(page.locator('.itemall .item')).toHaveCount(4)
  });


  test('should allow me to mark all items as completed', async ({ page }) => {
    await expect(page.getByText('buy some cheese')).not.toHaveClass('item completed')
    await page.locator('.fas.fa-check').first().click()
    await expect(page.getByText('buy some cheese')).toHaveClass('item completed')

    await expect(page.getByText('feed the cat')).not.toHaveClass('item completed')
    await page.locator('.fas.fa-check').nth(1).click()
    await expect(page.getByText('feed the cat')).toHaveClass('item completed')

    await expect(page.getByText('book a doctors appointment')).not.toHaveClass('item completed')
    await page.locator('.fas.fa-check').nth(2).click()
    await expect(page.getByText('book a doctors appointment')).toHaveClass('item completed')

    await expect(page.getByText('read book')).not.toHaveClass('item completed')
    await page.locator('.fas.fa-check').nth(3).click()
    await expect(page.getByText('read book')).toHaveClass('item completed')
    
    //click the all button
    await page.locator('#allButton').click()
    //should have four item
    await expect(page.locator('.itemall .item')).toHaveCount(4)
    //click the complete button
    await page.locator('#completeButton').click()
    //should have four item
    await expect(page.locator('.itemall .item')).toHaveCount(4)
    await expect(page.locator('#number')).toContainText('Total: 4, Active: 0, Completed: 4')
  });

  test('should allow to clear the complete state of all items', async ({ page }) => {
    //click checkbox
    await page.locator('.fas.fa-check').first().click()
    //should have completed class
    await expect(page.getByText('buy some cheese')).toHaveClass('item completed')
    //uncheck the checkbox
    await page.locator('.fas.fa-check').first().click()
    //should not have completed class
    await expect(page.getByText('buy some cheese')).not.toHaveClass('item completed')

    //click checkbox
    await page.locator('.fas.fa-check').nth(1).click()
     //should have completed class
    await expect(page.getByText('feed the cat')).toHaveClass('item completed')
    //uncheck checkbox
    await page.locator('.fas.fa-check').nth(1).click()
    //should not have completed class
    await expect(page.getByText('feed the cat')).not.toHaveClass('item completed')

    //click checkbox
    await page.locator('.fas.fa-check').nth(2).click()
     //should have completed class
    await expect(page.getByText('book a doctors appointment')).toHaveClass('item completed')
    //uncheck checkbox
    await page.locator('.fas.fa-check').nth(2).click()
    //should not have completed class
    await expect(page.getByText('book a doctors appointment')).not.toHaveClass('item completed')

    //click checkbox
    await page.locator('.fas.fa-check').nth(3).click()
     //should have completed class
    await expect(page.getByText('read book')).toHaveClass('item completed')
     //uncheck the checkbox
     await page.locator('.fas.fa-check').nth(3).click()
    //should not have completed class
    await expect(page.getByText('read book')).not.toHaveClass('item completed')

   //click the complete button
   await page.locator('#completeButton').click()
   //should have no item
   await expect(page.locator('.itemall .item')).toHaveCount(0)
  });

  test('Should delete any task', async ({page}) => {
    await expect(page.locator('#number')).toContainText('Total: 4, Active: 4, Completed: 0')
    //click the delete button
    await page.locator('.fas.fa-trash').nth(1).click()
    //the list should have 3 item 
    await expect(page.locator('.itemall .item')).toHaveCount(3)

    //click the delete button
    await page.locator('.fas.fa-trash').nth(0).click()
    //the list should have 2 items left
    await expect(page.locator('.itemall .item')).toHaveCount(2)
    await expect(page.locator('#number')).toContainText('Total: 2, Active: 2, Completed: 0')
  })

  test('should allow me to edit an item', async ({ page }) => {
    await expect(page.locator('.itemall .item').nth(1)).toContainText(TODO_ITEMS[1])
    await page.locator('.itemall .item').nth(1).dblclick().then(async () =>{
      await page.keyboard.press('Control+A');
      await page.keyboard.press('Backspace');
      await page.keyboard.type('Buy some sausages')
      await page.keyboard.press('Enter')

    })
        await expect(page.locator('.itemall .item').nth(1)).toHaveValue('Buy some sausages');
       
      }); 
});

async function createDefaultTodos(page: Page) {
  // create a new todo locator
  const newTodo = page.getByPlaceholder('What needs to be done?');

  for (const item of TODO_ITEMS) {
    await newTodo.fill(item);
    await newTodo.press('Enter');
  }
}
