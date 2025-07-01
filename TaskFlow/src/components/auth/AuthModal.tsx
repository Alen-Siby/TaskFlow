import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Lock, User } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import { api } from '../../utils/api';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLoginSuccess, addToast }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        className="relative w-full max-w-md h-[550px]"
        style={{ perspective: '1200px' }}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
      >
        <motion.div
            className="relative w-full h-full"
            style={{ transformStyle: 'preserve-3d' }}
            initial={false}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
            <LoginForm onFlip={() => setIsFlipped(true)} onLoginSuccess={onLoginSuccess} addToast={addToast} />
            <SignupForm onFlip={() => setIsFlipped(false)} addToast={addToast} />
        </motion.div>
      </motion.div>
      <motion.button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <X size={28} />
      </motion.button>
    </div>
  );
};

const FormWrapper = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
    <div className="absolute w-full h-full glass-strong p-8 rounded-2xl shadow-2xl flex flex-col justify-center bg-gradient-to-br from-purple-600/30 via-blue-500/30 to-indigo-700/30" style={{...style, backfaceVisibility: 'hidden'}}>
        {children}
    </div>
)

interface LoginFormProps {
    onFlip: () => void;
    onLoginSuccess: () => void;
    addToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onFlip, onLoginSuccess, addToast }) => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!identifier || !password) {
            addToast('error', 'Email/Username and password are required');
            return;
        }

        try {
            const isEmail = identifier.includes('@');
            const payload = {
                password,
                [isEmail ? 'email' : 'username']: identifier,
            };

            const data = await api.login(`${API_BASE_URL}/auth/login`, payload);

            if (data.success && data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.userId);
                onLoginSuccess();
            } else {
                addToast('error', data.message || 'Login failed');
            }
        } catch (error) {
            addToast('error', (error as Error).message || 'An unexpected error occurred.');
            console.error('Login error:', error);
        }
    };
    
    return (
        <FormWrapper>
            <motion.h2 className="text-3xl font-bold mb-6 text-center text-white" >
            Welcome Back
            </motion.h2>
            <AuthInput icon={Mail} placeholder="Email or Username" type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
            <AuthInput icon={Lock} placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <motion.button onClick={handleLogin} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg mt-6 transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Log In
            </motion.button>
            <motion.p className="text-center text-sm text-gray-300 mt-6" >
            Don't have an account?{' '}
            <button onClick={onFlip} className="font-bold text-white hover:underline">
                Sign up
            </button>
            </motion.p>
        </FormWrapper>
    )
};

interface SignupFormProps {
    onFlip: () => void;
    addToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onFlip, addToast }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        if (!username || !email || !password) {
            addToast('error', 'All fields are required');
            return;
        }

        try {
            const payload = { username, email, password };
            const data = await api.post(`${API_BASE_URL}/auth/register`, payload);

            if (data.success) {
                addToast('success', 'Registration successful! Please log in.');
                onFlip(); // Flip to login form
            } else {
                addToast('error', data.message || 'Registration failed');
            }
        } catch (error) {
            addToast('error', (error as Error).message || 'An unexpected error occurred.');
            console.error('Signup error:', error);
        }
    };
    
    return (
        <FormWrapper style={{ transform: 'rotateY(180deg)' }}>
            <motion.h2 className="text-3xl font-bold mb-6 text-center text-white">
            Create Account
            </motion.h2>
            <AuthInput icon={User} placeholder="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            <AuthInput icon={Mail} placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <AuthInput icon={Lock} placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <motion.button onClick={handleSignup} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg mt-6 transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Sign Up
            </motion.button>
            <motion.p className="text-center text-sm text-gray-300 mt-6">
            Already have an account?{' '}
            <button onClick={onFlip} className="font-bold text-white hover:underline">
                Log in
            </button>
            </motion.p>
        </FormWrapper>
    )
};

interface AuthInputProps {
    icon: React.ElementType;
    placeholder: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AuthInput: React.FC<AuthInputProps> = ({ icon: Icon, placeholder, type, value, onChange }) => (
  <motion.div className="relative mb-4" whileHover={{ scale: 1.02 }}>
    <motion.div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
      <Icon className="w-5 h-5" />
    </motion.div>
    <motion.input type={type} placeholder={placeholder} value={value} onChange={onChange} className="w-full pl-10 pr-4 py-3 bg-white/10 text-white rounded-lg border border-transparent focus:border-white/50 focus:bg-white/20 outline-none transition-all" whileFocus={{ scale: 1.05, boxShadow: '0 0 15px rgba(255, 255, 255, 0.2)' }}/>
  </motion.div>
); 