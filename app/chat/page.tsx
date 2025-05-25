'use client';

import { fetchStreamedPlan } from '@/lib/internal_api';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userMessage = input.trim();

    if (!userMessage) return;

    setInput('');
    setIsLoading(true);

    const onComplete = () => setIsLoading(false);
    const onUpdate = (resultUntilNow: string) => setResult(resultUntilNow);

    fetchStreamedPlan(userMessage, onComplete, onUpdate);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Planejador de Aulas
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Diga qual plano de aula você quer
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col space-y-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ex: Plano de aula sobre fotossíntese para 6º ano..."
              rows={2}
              className="w-full p-4 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
            >
              {isLoading ? 'Gerando...' : 'Gerar Plano'}
            </button>
          </div>
        </form>

        {isLoading && (
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" />
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-100" />
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-200" />
            </div>
          </div>
        )}

        {result && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg prose dark:prose-invert max-w-none">
            <ReactMarkdown>
              {result}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
} 