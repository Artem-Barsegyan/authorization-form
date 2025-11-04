import { useRef, useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import backSvg from '../../assets/back.svg'
import { toast } from 'sonner';

import styles from './TwoFactorAuth.module.css'

const TwoFactorAuth = ({ onBack, onSuccess }) => {
    const [codes, setCodes] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(30);
    const [hasError, setHasError] = useState(false);
    const [generatedCode, setGeneratedCode] = useState('');
    const inputsRef = useRef([]);

    function getNewCode() {
        const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedCode(randomCode);
        toast.info(`Сгенерированный код для 2FA: ${randomCode}`, { duration: 4000 });
    }

    async function mockVerify2FA(code) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (code === generatedCode) {
            return { success: true };
        } else {
            throw new Error('Invalid verification code');
        }
    }

    const verifyMutation = useMutation({
        mutationFn: mockVerify2FA,
        onSuccess: () => {
            onSuccess();
        },
        onError: (error) => {
            setError(error.message);
            setHasError(true);
        }
    });

    useEffect(() => {
        getNewCode();
        inputsRef.current[0].focus();
    }, []);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    useEffect(() => {
        setHasError(false);
        setError('');
    }, [codes]);

    const handleInput = (e, index) => {
        const value = e.target.value;
        const newCodes = [...codes];
        newCodes[index] = value;
        setCodes(newCodes);

        if (value && index < 5) {
            inputsRef.current[index + 1].focus();
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const fullCode = codes.join('');
        setError('');
        verifyMutation.mutate(fullCode);
    }

    const handleGetNewCode = () => {
        setCodes(['', '', '', '', '', '']);
        setTimeLeft(30);
        setError('');
        setHasError(false);
        getNewCode();
    }

    const fullCode = codes.join('');
    const isCodeComplete = fullCode.length === 6;
    const showGetNewButton = timeLeft === 0;
    const canSubmit = isCodeComplete && !hasError;

    const inputsArr = codes.map((code, index) => {
        return (
            <input
                type='text'
                name='number'
                inputMode='numeric'
                maxLength={1}
                pattern='[0-9]'
                required
                value={code}
                ref={el => inputsRef.current[index] = el}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                key={index}
            />
        )
    })

    return (
        <>
            <form onSubmit={handleSubmit} className={styles.form}>
                <img
                    src={backSvg}
                    alt="back-to-login"
                    onClick={onBack}
                />
                <span>Company</span>
                <h1>Two-Factor Authentication</h1>
                <p>Enter the 6-digit code from the Google Authenticator app</p>

                {error && (
                    <div style={{ color: 'red', marginBottom: '10px' }}>
                        {error}
                    </div>
                )}

                <div className={styles['input-container']}>
                    {inputsArr}
                </div>

                {timeLeft !== 0 && <div style={{ marginBottom: '10px', color: '#666' }}>
                    Time left: {timeLeft}s
                </div>}

                {showGetNewButton ?
                    <button
                        type="button"
                        className={styles.btn}
                        onClick={handleGetNewCode}
                    >
                        Get new code
                    </button>
                    :
                    isCodeComplete &&
                    <button
                        type="submit"
                        className={styles.btn}
                        disabled={!canSubmit || verifyMutation.isPending}
                    >
                        {verifyMutation.isPending ? 'Verifying...' : 'Continue'}
                    </button>}
            </form>
        </>
    )
}

export default TwoFactorAuth;