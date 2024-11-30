import React, { useState, useEffect } from 'react';
import './DynamicCounter.css';

function DynamicCounter() {
    const [count, setCount] = useState(0);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [quote, setQuote] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [warning, setWarning] = useState('');

    const MIN_VALUE = 0;
    const MAX_VALUE = 100;

    useEffect(() => {
        let timer;
        if (isTimerActive) {
            timer = setInterval(() => {
                setCount((prev) => {
                    if (prev + 1 > MAX_VALUE) {
                        setWarning('Достигнуто максимальное значение.');
                        return prev;
                    }
                    setWarning('');
                    return prev + 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isTimerActive]);

    const fetchQuote = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('https://api.quotable.io/random');
            if (!response.ok) throw new Error('Ошибка при загрузке цитаты');
            const data = await response.json();
            setQuote(data.content);
        } catch (error) {
            setQuote('Не удалось загрузить цитату. Попробуйте позже.');
        } finally {
            setIsLoading(false);
        }
    };

    const increase = () => {
        if (count + 1 > MAX_VALUE) {
            setWarning('Достигнуто максимальное значение.');
            return;
        }
        setWarning('');
        setCount(count + 1);
    };

    const decrease = () => {
        if (count - 1 < MIN_VALUE) {
            setWarning('Достигнуто минимальное значение.');
            return;
        }
        setWarning('');
        setCount(count - 1);
    };

    return (
        <div className="dynamic-counter">
            <h2>Счётчик: {count}</h2>
            {warning && <p className="warning">{warning}</p>}
            <button onClick={increase}>Увеличить</button>
            <button onClick={decrease}>Уменьшить</button>
            <button onClick={() => setIsTimerActive((prev) => !prev)}>
                {isTimerActive ? 'Отключить таймер' : 'Включить таймер'}
            </button>
            <button onClick={fetchQuote}>Получить случайную цитату</button>
            {isLoading ? (
                <div className="loader"></div>
            ) : (
                quote && <p className="quote">Цитата: "{quote}"</p>
            )}
        </div>
    );
}

export default DynamicCounter;
