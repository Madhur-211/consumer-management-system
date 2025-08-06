'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [schema_name, setSchema_name] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/signup', { name, schema_name, email, password }, { withCredentials: true });
    //   localStorage.setItem('token', res.data.access_token);
      router.push('/login');
    } catch (err) {
      alert('Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="border mb-2 w-full" />
      <input value={schema_name} onChange={(e) => setSchema_name(e.target.value)} placeholder="Schema Name" className="border mb-2 w-full" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="border mb-2 w-full" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="border mb-2 w-full" />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">Signup</button>
    </form>
  );
}
