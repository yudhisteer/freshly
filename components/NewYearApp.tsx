"use client";

import React, { useState, useEffect } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, User } from 'lucide-react';

interface User {
    name: string;
    goals: { type: string; children: { text: string; }[]; }[];
    editor?: ReturnType<typeof withReact>;
  }

type Page = 'username' | 'users' | 'goals';

const NewYearApp = () => {
  const [currentPage, setCurrentPage] = useState<Page>('username'); // username, users, goals
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');

  const [initialValue] = useState([
    {
      type: 'paragraph',
      children: [{ text: 'Write your goals here...' }],
    },
  ]);

  const handleCreateUser = () => {
    if (!username.trim()) return;
    if (users.some(user => user.name.toLowerCase() === username.toLowerCase())) {
      alert('Username already exists!');
      return;
    }
  
    const newUser = {
      name: username,
      goals: initialValue,
      editor: withReact(createEditor()),  // Add this line
    };
  
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setCurrentPage('users');
  };

  const handleViewGoals = (user: User) => {
    setSelectedUser(user);
    setCurrentPage('goals');
  };

  const handleGoBack = () => {
    setCurrentPage('users');
    setSelectedUser(null);
  };

  const renderUsernamePage = () => (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="space-y-4">
            <Input
              placeholder="Choose a username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full"
            />
            <Button 
              onClick={handleCreateUser}
              className="w-full bg-yellow-200 hover:bg-yellow-300 text-black"
            >
              Confirm
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderUsersPage = () => (
    <div className="p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {users.map((user) => (
          <Card 
            key={user.name}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleViewGoals(user)}
          >
            <CardContent className="p-4 text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full border-2 border-gray-300 flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <div className="font-medium">{user.name}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderGoalsPage = () => {
    if (!selectedUser || !selectedUser.editor) return null;
    
    return (
      <div className="p-4">
        <div className="mb-4">
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="bg-yellow-200 hover:bg-yellow-300 text-black"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go back
          </Button>
        </div>
        <Card className="w-full">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">{selectedUser.name}'s Goals</h2>
            <Slate
              editor={selectedUser.editor}
              value={selectedUser.goals}
              onChange={value => {
                if (currentUser && selectedUser.name === currentUser.name) {
                  const updatedUsers = users.map(u =>
                    u.name === currentUser.name ? { ...u, goals: value } : u
                  );
                  setUsers(updatedUsers);
                }
              }}
            >
              <Editable
                className="min-h-[200px] p-4 border rounded"
                readOnly={!currentUser || selectedUser.name !== currentUser.name}
                placeholder="Write your resolutions here..."
              />
            </Slate>
          </CardContent>
        </Card>
      </div>
    );
  };

  const pageComponents: Record<Page, () => React.ReactNode> = {
    username: renderUsernamePage,
    users: renderUsersPage,
    goals: renderGoalsPage,
  };

  return pageComponents[currentPage]();
};

export default NewYearApp;