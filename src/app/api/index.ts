import { resolve } from 'path'

const todos = [
  {
    id: 1,
    title: 'Learn HTML',
    completed: false,
  },
  {
    id: 2,
    title: 'Learn CSS',
    completed: false,
  },
  {
    id: 3,
    title: 'Learn Javascript',
    completed: false,
  },
  {
    id: 4,
    title: 'Learn React',
    completed: false,
  },
  {
    id: 5,
    title: 'Learn Next.js',
    completed: false,
  },
]

export type Todos = typeof todos
export type Todo = Todos[0]

export const fetchTodos = async (query = ''): Promise<Todo[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  console.log('fetched todos, query:', query)

  const filteredTodos = todos.filter((todo) => {
    todo.title.toLowerCase().includes(query.toLowerCase())
  })

  return [...todos]
}

export const addTodo = async (todo: Pick<Todo, 'title'>): Promise<Todo> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const newTodo = {
    id: todos.length + 1,
    title: todo.title,
    completed: false,
  }
  todos.push(newTodo)

  return newTodo
}

const items = Array.from({ length: 100 }).map((_, i) => ({
  id: i,
  name: `Item ${i}`,
}))

type Item = (typeof items)[0]

const LIMIT = 10

export function fetchItems({ pageParam }: { pageParam: number }): Promise<{
  data: Item[]
  currentPage: number
  nextPage: number | null
}> {
  console.log('pageParam:', pageParam, items.length)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: items.slice(pageParam, pageParam + LIMIT),
        currentPage: pageParam,
        nextPage: pageParam + LIMIT < items.length ? pageParam + LIMIT : null,
      })
    }, 1000)
  })
}
