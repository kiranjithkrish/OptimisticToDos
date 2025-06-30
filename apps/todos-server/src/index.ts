import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()
app.use('*', cors())

const NORMAL_RESPONSE_TIME = 1000
const OUT_OF_ORDER_RESPONSE_TIME = 4000
const OUT_OF_ORDER_REQUEST_WINDOW = 3000

type Todo = {
  id: number
  title: string
  body: string
  done: boolean
  imageUrl: string
}

class InMemoryStore {
  private order: Array<number>
  private todos: Array<Todo>
  longResponseInProgress: boolean = false;
  lastOrderUpdate: number = 0;
  lastTodosUpdate: number = 0;

  constructor(todos: Array<Todo>, order: Array<number>) {
    this.todos = todos
    this.order = order
  }

  setOrder(order: Array<number>) {
    this.lastOrderUpdate = Date.now()
    this.order = order
  }

  getOrder() {
    return this.order
  }

  getTodos() {
    return this.todos
  }

  getTodoById(id: number): Todo | undefined{
    return this.todos.find((todo) => todo.id === id)
  }

  updateTodoById(id: number, todo: Todo) {
    const index = this.todos.findIndex((todo) => todo.id === id)
    this.lastTodosUpdate = Date.now()
    this.todos[index] = todo
  }

  setLongResponseInProgress(value: boolean) {
    this.longResponseInProgress = value
  }
}

const store = new InMemoryStore([
  {
      "id": 1,
      "title": "Wrangle Unicorns",
      "body": "Find a mythical stable, procure glitter, and practice ethical unicorn handling.",
      "imageUrl": "",
      "done": false
  },
  {
      "id": 2,
      "title": "Organize Sock Drawer",
      "body": "Match socks based on existential compatibility and color, not just size.",
      "imageUrl": "",
      "done": false
  },
  {
      "id": 3,
      "title": "Build Time Machine",
      "body": "Acquire flux capacitor, avoid paradoxes, and make sure to return before dinner.",
      "imageUrl": "",
      "done": false
  },
  {
      "id": 4,
      "title": "Train for Space Mission",
      "body": "Prepare for zero gravity, pack snacks, and memorize the entire user manual for the spaceship.",
      "imageUrl": "",
      "done": false
  },
  {
      "id": 5,
      "title": "Learn Dolphin Language",
      "body": "Watch 'Flipper' reruns, practice underwater breathing, and perfect your squeaks and clicks.",
      "imageUrl": "",
      "done": false
  },
  {
      "id": 6,
      "title": "Become a Ninja",
      "body": "Buy black pajamas, take stealth classes, and master the art of disappearing into thin air.",
      "imageUrl": "",
      "done": false
  },
  {
      "id": 7,
      "title": "Bake a Cake for Dragons",
      "body": "Research fireproof frosting, ensure cake is big enough, and avoid becoming the dessert.",
      "imageUrl": "",
      "done": false
  },
  {
      "id": 8,
      "title": "Host a Ghost Party",
      "body": "Send spooky invites, prepare ectoplasmic appetizers, and avoid any exorcisms.",
      "imageUrl": "",
      "done": false
  },
  {
      "id": 9,
      "title": "Invent Self-Walking Shoes",
      "body": "Combine shoes with tiny motors, ensure they know where they're going, and avoid walking off cliffs.",
      "imageUrl": "",
      "done": false
  },
  {
      "id": 10,
      "title": "Write a Novel in Emoji",
      "body": "Translate classic literature into emojis, capture all emotions, and make sure it's 😎👌.",
      "imageUrl": "",
      "done": false
  }
], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

const waitFor = (ms: number) => new Promise((r) => setTimeout(r, ms))

const simulateOutOfOrderResponse = async (lastUpdate: number) => {
  // Simulate a long response if the last update was less than 3 seconds ago
  // But only if there isn't already a long response in progress
  const shouldAddLongResponseDelay = !store.longResponseInProgress && lastUpdate !== 0 && Date.now() - lastUpdate < OUT_OF_ORDER_REQUEST_WINDOW
  shouldAddLongResponseDelay && store.setLongResponseInProgress(true)
  shouldAddLongResponseDelay && console.log('Simulating long response')
  await waitFor(shouldAddLongResponseDelay  ? OUT_OF_ORDER_RESPONSE_TIME : NORMAL_RESPONSE_TIME)
  shouldAddLongResponseDelay && store.setLongResponseInProgress(false);
}


app.get('/todos', async (c) => {
  await waitFor(NORMAL_RESPONSE_TIME)
  return c.json({ todos: store.getTodos(), order: store.getOrder() })
})

app.put('/todos-order', async (c) => {
  const body = await c.req.json()
  const lastUpdate = store.lastOrderUpdate;
  store.setOrder(body.order)

  await simulateOutOfOrderResponse(lastUpdate);
  return c.json({ order: store.getOrder() })
})

app.put('/todos/:id', async (c) => {
  const id = parseInt(await c.req.param('id'))
  const body = await c.req.json()

  const existingTodo = store.getTodoById(id);

  if (!existingTodo) {
    return c.status(404)
  }

  const newTodo: Todo = { ...existingTodo, done: body.done };
  const lastUpdate = store.lastTodosUpdate;
  store.updateTodoById(id, newTodo)

  await simulateOutOfOrderResponse(lastUpdate);
  return c.json(newTodo)
})


const port = 8123
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
