import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { todos } from '../lib/api';

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  userId: string;
}

export function TodoList() {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      const { data } = await todos.getAll();
      setTodoList(data);
    } catch (error) {
      toast.error('Error fetching todos');
    }
  }

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      await todos.create({ title: newTodo.trim() });
      setNewTodo('');
      fetchTodos();
      toast.success('Todo added');
    } catch (error) {
      toast.error('Error adding todo');
    }
  }

  async function toggleTodo(id: string, completed: boolean) {
    try {
      await todos.update(id, { completed: !completed });
      fetchTodos();
    } catch (error) {
      toast.error('Error updating todo');
    }
  }

  async function deleteTodo(id: string) {
    try {
      await todos.delete(id);
      fetchTodos();
      toast.success('Todo deleted');
    } catch (error) {
      toast.error('Error deleting todo');
    }
  }

  async function updateTodo(id: string) {
    if (!editText.trim()) return;

    try {
      await todos.update(id, { title: editText.trim() });
      setEditingId(null);
      fetchTodos();
      toast.success('Todo updated');
    } catch (error) {
      toast.error('Error updating todo');
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={addTodo} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          <Plus className="h-5 w-5" />
        </button>
      </form>

      <div className="space-y-2">
        {todoList.map((todo) => (
          <div
            key={todo._id}
            className="flex items-center gap-2 p-3 bg-white rounded-lg shadow"
          >
            {editingId === todo._id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
                <button
                  onClick={() => updateTodo(todo._id)}
                  className="text-green-600 hover:text-green-700"
                >
                  <Check className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo._id, todo.completed)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span
                  className={`flex-1 ${
                    todo.completed ? 'line-through text-gray-400' : ''
                  }`}
                >
                  {todo.title}
                </span>
                <button
                  onClick={() => {
                    setEditingId(todo._id);
                    setEditText(todo.title);
                  }}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => deleteTodo(todo._id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}