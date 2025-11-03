import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import styles from './LoginForm.module.css';

const LoginForm = ({ onSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function mockLogin(userInfo) {
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (userInfo.email === 'test@gmail.com' && userInfo.password === '123456') {
            return { success: true };
        } else {
            throw new Error('Invalid email or password');
        }
    }

    const loginMutation = useMutation({
        mutationFn: mockLogin,
        onSuccess: () => {
            onSuccess();
        },
        onError: (error) => {
            setError(error.message);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        loginMutation.mutate({ email, password });
    }

    const isActive = (email.length > 10 && email.includes('@')) && password.length >= 6 ? false : true;

    return (
        <>
            <form onSubmit={handleSubmit} className={styles.form}>
                <span>Company</span>
                <h1>Sign in to your account <br /> to continue</h1>
                {error &&
                    <div style={{ color: 'red', marginBottom: '10px' }}>
                        {error}
                    </div>
                }
                <div className={styles['input-fields']}>
                    <div className={styles.email}>
                        <input
                            type="email"
                            placeholder="Email"
                            name='email'
                            onChange={(e) => setEmail(e.target.value)}
                            value={email} />
                    </div>
                    <div className={styles.password}>
                        <input
                            type="password"
                            placeholder="Password"
                            name='password'
                            onChange={(e) => setPassword(e.target.value)}
                            value={password} />
                    </div>
                </div>
                <button
                    className={styles.btn}
                    type="submit"
                    disabled={isActive || loginMutation.isPending}>
                    {loginMutation.isPending ? 'Loading...' : 'Log in'}
                </button>
            </form>
        </>
    )
}

export default LoginForm;