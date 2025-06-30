# Wayflyer frontend take-home project

First of all - thank you for your interest in Wayflyer, and for taking the time to engage with this process. Your challenge today, should you choose to accept it, concerns **optimistic updates**.

<aside>
Recommended time: 3 hours
</aside>

## The problem

You are working on a ground-breaking new product that will revolutionise human productivity - a *Todo List*. But this one has a key differentiator that will no doubt result in investors falling over themselves to jump aboard: **you cannot ever add or remove from the list**.

You get an opinionated static list of things todo, and you may re-order them, and mark them as “done”, but that’s it.

Naturally, because you want to get to market quickly, you will use a third-party to manage the actual todos - and that is where the challenge comes in.

Turns out this service has some quirks, it supports everything you need:

- Getting a list of todos
- Toggling the “done” state of a todo
- Updating the order of todos

But unfortunately, the response time is slow, and somewhat erratic. Several requests within a small time window to update the order of todos will often result in the responses coming back out of order.

## Requirements

- A reusable list / grid component that supports re-ordering, and is agnostic about where the data comes from.
- Management of optimistic updates for drag/drop re-ordering, with the server response(s) acting as the source of truth (remember they can be received out of order)
- Some sort of visual indication of “done” / “not done” state and a means to toggle this state. This state should also be updated optimistically.
- A user that drags and drops to re-order quickly (more than one every 3 secs), should not see any unexpected re-ordering as late responses come in.

## Guarantees

- You can assume that the server processes each request in the order they are sent. Only the responses can be out of order
- The order array will always have the same length as the total count of todos

## The API

`GET https://localhost:8123/todos`

Returns a list of todos, along with their order

```tsx
type TodosResponse = {
   todos: Array<{
	   id: number;
	   title: string;
	   body: string;
	   done: boolean;
	   imageUrl: string;
	}>
   order: Array<number>
}
```

`PUT https://localhost:8123/todos-order`

Updates the order of the todos, responds with the new order

```tsx
type TodosOrderRequestBody = {
   order: Array<number>
}

type TodosOrderResponse = {
   order: Array<number>
}
```

`PUT https://localhost:8123/todos/<id>`

Updates a single todo, only accepts boolean `done` state. Responds with updated todo.

```tsx
type TodosOrderRequestBody = {
   done: boolean
}

type TodosOrderResponse = {
   todo: {
	   id: number;
	   title: string;
	   body: string;
	   done: boolean;
	   imageUrl: string;
	}
}
```

## Assessment criteria

This project is primarily intended as jumping-off point to drive the discussion during the technical interview. We are interested in assessing proficiency in the following areas:

- TypeScript
- React
- CSS
- Data-fetching patterns
- Code-quality
- UX best practices

You are unlikely to be able to fully demonstrate your abilities through this project in the recommended time. You are free to choose to focus on one or several of these and to lean on libraries or frameworks for the others. You will get a chance to demonstrate your knowledge for these on the call, and also to justify your choice of technologies.

You will not be negatively assessed for:

- Use of frameworks (just be prepared to defend choice, and understand how they work)
- Using beta / alpha versions of libraries
- Use of scaffolding tools / boilerplates / starter kits
- Lack of test coverage

## Scaffolding provided

- A node server that simulates the out-of-order responses, and also throttles responses
- A Vite React 19 app
- A frontend data-layer based on `tanstack/react-query`
- Some basic examples of queries and mutations

You are free to ignore the Vite app, and set up your own from scratch if you prefer.
You are also free to adjust the server, or fix bugs (hopefully there are none), but the simulated out-of-order / throttled responses must be left intact.

To start the provided project (from the root):


```
pnpm i
pnpm dev
```

This will start both the Hono server and the Vite dev server

Good luck, and have fun!
