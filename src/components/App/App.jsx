import { useState } from 'react';

import LoginForm from '../LoginForm/LoginForm';
import TwoFactorAuth from '../TwoFactorAuth/TwoFactorAuth';

import '../../reset.css';

const App = () => {
    const [currentForm, setCurrentForm] = useState('login')
    return (
        <>
            {currentForm === 'login' &&
                <LoginForm
                    onSuccess={() => setCurrentForm('2fa')} />}
            {currentForm === '2fa' &&
                <TwoFactorAuth
                    onBack={() => setCurrentForm('login')}
                    onSuccess={() => setCurrentForm('success')} />}
            {currentForm === 'success' &&
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>Success! You are logged in!</div>}
        </>
    )
}

export default App;