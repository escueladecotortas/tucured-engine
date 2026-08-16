import React, { useRef, useEffect, useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

/**
 * NumberInput with increment/decrement buttons (stacked on right side)
 * Handles px, %, rem, em values
 * Supports hold-to-repeat for continuous increment/decrement
 */
const NumberInput = ({ value, onChange, label, step = 1, min = 0, max = 10000, suffix = 'px' }) => {
    const intervalRef = useRef(null);
    const timeoutRef = useRef(null);
    const [localValue, setLocalValue] = useState(value || 'auto');
    const [isFocused, setIsFocused] = useState(false);

    // Sync external value to local when not focused
    useEffect(() => {
        if (!isFocused) {
            setLocalValue(value || 'auto');
        }
    }, [value, isFocused]);

    // Parse numeric value and unit
    const parseValue = (val) => {
        if (!val || val === 'auto') return { num: 0, unit: suffix };
        const match = String(val).match(/^([\d.-]+)(.*)$/);
        if (match) {
            return { num: parseFloat(match[1]) || 0, unit: match[2] || suffix };
        }
        return { num: 0, unit: suffix };
    };

    // Round to avoid floating point errors
    const roundValue = (num) => {
        return Math.round(num * 100) / 100;
    };

    // Use ref to always have latest onChange callback and current value
    const onChangeRef = useRef(onChange);
    const localValueRef = useRef(localValue);
    onChangeRef.current = onChange;
    localValueRef.current = localValue;

    const doIncrement = () => {
        const parsed = parseValue(localValueRef.current);
        const newNum = roundValue(Math.min(max, parsed.num + step));
        const newValue = `${newNum}${parsed.unit}`;
        localValueRef.current = newValue;
        setLocalValue(newValue);
        onChangeRef.current(newValue);
    };

    const doDecrement = () => {
        const parsed = parseValue(localValueRef.current);
        const newNum = roundValue(Math.max(min, parsed.num - step));
        const newValue = `${newNum}${parsed.unit}`;
        localValueRef.current = newValue;
        setLocalValue(newValue);
        onChangeRef.current(newValue);
    };

    const startHold = (action) => {
        action();
        timeoutRef.current = setTimeout(() => {
            intervalRef.current = setInterval(action, 50);
        }, 300);
    };

    const stopHold = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => stopHold();
    }, []);

    // Handle manual input - commit the value
    const handleCommit = () => {
        setIsFocused(false);
        let val = localValue.trim();
        if (val === '') {
            setLocalValue(value || 'auto');
            return;
        }

        // If user typed just number, append default unit
        if (!isNaN(parseFloat(val)) && isFinite(val)) {
            const currentUnit = parseValue(value).unit || suffix;
            val = `${val}${currentUnit}`;
            setLocalValue(val);
        }

        onChange(val);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCommit();
            e.target.blur();
        }
    };

    const handleChange = (e) => {
        // Only update local state, NOT the parent
        setLocalValue(e.target.value);
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    return (
        <div className="flex flex-col gap-0.5">
            {label && <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">{label}</span>}
            <div className="flex items-stretch bg-black/40 rounded border border-white/10 overflow-hidden hover:border-white/20 transition-colors h-7">
                <input
                    type="text"
                    value={localValue}
                    onChange={handleChange}
                    onBlur={handleCommit}
                    onFocus={handleFocus}
                    onKeyDown={handleKeyDown}
                    className="flex-1 min-w-0 bg-transparent text-xs py-1 px-2 focus:outline-none font-mono text-zinc-300 placeholder-zinc-700"
                />
                <div className="flex flex-col border-l border-white/10 w-4">
                    <button
                        type="button"
                        onMouseDown={() => startHold(doIncrement)}
                        onMouseUp={stopHold}
                        onMouseLeave={stopHold}
                        className="flex-1 hover:bg-white/10 text-zinc-500 hover:text-white flex items-center justify-center cursor-pointer active:bg-indigo-500/50"
                        tabIndex={-1}
                    >
                        <ChevronUp size={8} />
                    </button>
                    <button
                        type="button"
                        onMouseDown={() => startHold(doDecrement)}
                        onMouseUp={stopHold}
                        onMouseLeave={stopHold}
                        className="flex-1 hover:bg-white/10 text-zinc-500 hover:text-white flex items-center justify-center cursor-pointer active:bg-indigo-500/50 border-t border-white/5"
                        tabIndex={-1}
                    >
                        <ChevronDown size={8} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NumberInput;

