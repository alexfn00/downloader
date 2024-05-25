import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { addTodo, fetchTodos } from '../api'

const Demo = () => {
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('')
  const [search, setSearch] = useState('')
  const { data: todos, isLoading } = useQuery({
    queryFn: () => fetchTodos(search),
    queryKey: ['todos', { search }],
    // staleTime: Infinity,
    gcTime: 0,
  })

  const { mutateAsync: addTodoMutation } = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <div>
        <input
          className='border'
          type='text'
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <button
          onClick={async () => {
            try {
              await addTodoMutation({ title })
              setTitle('')
            } catch (e) {
              console.error(e)
            }
          }}>
          Add Todo
        </button>
      </div>
      {todos?.map((todo) => {
        return <div key={todo.id}>{todo.title}</div>
      })}
    </div>
  )
}

export default Demo
