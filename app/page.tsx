'use client';
import { addTodo, fetchTodos } from '@/api';
import TodoCard from '@/components/ui/todo-card';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

export default function Home() {
  const refetchQueryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [search, setSearch] = useState('');

  const {
    data: todos,
    isLoading,
    error,
  } = useQuery({
    queryFn: () => fetchTodos(search),
    queryKey: ['todos', { search }],
    staleTime: Infinity,
    refetchInterval: 10,
  });

  const { mutateAsync: addMutation } = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      refetchQueryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  if (isLoading) {
    return <div>Loading ...</div>;
  }
  if (error) {
    return <div>Our Service is down due to this: {error.message}</div>;
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div>
        <input
          type='text'
          placeholder='Add A Todo Now'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          role='button'
          onClick={async () => {
            try {
              await addMutation({ title });
              setTitle('');
            } catch (error) {
              console.log(error);
            }
          }}
        >
          Add a Todo
        </button>
      </div>

      {todos?.map((todo) => (
        <TodoCard key={todo.id} todo={todo} />
      ))}
    </main>
  );
}
