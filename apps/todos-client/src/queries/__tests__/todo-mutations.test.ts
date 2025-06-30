import { describe, it, expect } from 'vitest'
import { applyOptimisticTodoUpdate } from '../todos.mutations'

interface Todo {
  id: number
  title: string
  body: string
  done: boolean
  imageUrl: string
}

interface TodosData {
  data: {
    todos: Todo[]
    order: number[]
  }
}

describe('Todo Mutations - Pure Function Tests', () => {
  const mockData: TodosData = {
    data: {
      todos: [
        { id: 1, title: 'Todo 1', body: 'Body 1', done: false, imageUrl: '' },
        { id: 2, title: 'Todo 2', body: 'Body 2', done: true, imageUrl: '' },
      ],
      order: [1, 2]
    }
  }

  it('should apply optimistic update to correct todo', () => {
    const result = applyOptimisticTodoUpdate(mockData, 1, true)
    
    expect(result.data.todos[0].done).toBe(true) 
    expect(result.data.todos[1].done).toBe(true)
    expect(result.data.order).toEqual([1, 2])
  })

  it('should not affect other todos when updating one', () => {
    const result = applyOptimisticTodoUpdate(mockData, 2, false)
    
    expect(result.data.todos[0].done).toBe(false)
    expect(result.data.todos[1].done).toBe(false)
    expect(result.data.order).toEqual([1, 2]) 

  })

  it('should preserve all other todo properties', () => {
    const result = applyOptimisticTodoUpdate(mockData, 1, true)
    
    expect(result.data.todos[0].id).toBe(1)
    expect(result.data.todos[0].title).toBe('Todo 1')
    expect(result.data.todos[0].body).toBe('Body 1')
    expect(result.data.todos[0].imageUrl).toBe('')
    expect(result.data.todos[0].done).toBe(true) 
  })

  it('should handle non-existent todo id gracefully', () => {
    const result = applyOptimisticTodoUpdate(mockData, 999, true)

    expect(result.data.todos[0].done).toBe(false)
    expect(result.data.todos[1].done).toBe(true)
    expect(result.data.order).toEqual([1, 2])
  })
}) 