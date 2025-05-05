import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup(email, password);
  };

  return (
    <form onSubmit={handleSignup} className="max-w-md mx-auto mt-20 space-y-4">
      <h2 className="text-xl font-bold">Signup</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border" />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border" />
      <button type="submit" className="bg-black text-white px-4 py-2">Signup</button>
    </form>
  );
};

export default Signup;
