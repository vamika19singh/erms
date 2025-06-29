import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

interface FormData {
  email: string;
  password: string;
}

const Login = () => {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  async function onSubmit(data: FormData) {
    try {
      await login(data.email, data.password);
    } catch {
      alert('Login failed');
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            {...register('email', { required: 'Email required' })}
            type="email"
            className="w-full border p-2 rounded"
          />
          {errors.email && <p className="text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input
            {...register('password', { required: 'Password required' })}
            type="password"
            className="w-full border p-2 rounded"
          />
          {errors.password && <p className="text-red-600">{errors.password.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;