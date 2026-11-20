import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { verifyOtp, resendOtp } from '../services/authServices';

const RESEND_SECONDS = 60;

function OtpVerify({ email, onVerified, onBack }) {

    const [otp, setOtp] = useState('');
    const [localError, setLocalError] = useState('');
    const [info, setInfo] = useState('');
    const [cooldown, setCooldown] = useState(RESEND_SECONDS);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    const verifyMutation = useMutation({
        mutationFn: () => verifyOtp(email, otp),
        onSuccess: () => onVerified(),
    });

    const resendMutation = useMutation({
        mutationFn: () => resendOtp(email),
        onSuccess: () => {
            setInfo('A new code has been sent to your email');
            setCooldown(RESEND_SECONDS);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setInfo('');

        if (!/^\d{6}$/.test(otp)) {
            setLocalError('Enter the 6-digit code');
            return;
        }

        setLocalError('');
        verifyMutation.mutate();
    };

    const handleResend = () => {
        setInfo('');
        setLocalError('');
        verifyMutation.reset();
        resendMutation.mutate();
    };

    const serverError =
        (verifyMutation.isError && verifyMutation.error.message) ||
        (resendMutation.isError && resendMutation.error.message) ||
        '';

    return (
        <>
            <h1 className="text-xl sm:text-2xl font-semibold text-white mb-1 tracking-wide">
                VERIFY EMAIL
            </h1>

            <p className="text-white text-xs sm:text-sm mb-5 sm:mb-6 break-words">
                We sent a 6-digit code to <span className="font-medium">{email}</span>
            </p>

            <form onSubmit={handleSubmit} noValidate className="space-y-3.5 sm:space-y-4">

                <div>
                    <label className="block text-xs font-medium text-white mb-1">
                        Verification code
                    </label>

                    <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => {
                            setOtp(e.target.value.replace(/\D/g, ''));
                            setLocalError('');
                        }}
                        className={`w-full placeholder-gray-300 bg-white/10 border rounded-md px-3 py-2.5 text-center text-lg tracking-[0.5em] focus:outline-none text-white ${
                            localError
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-white/20 focus:border-orange-400'
                        }`}
                    />

                    {localError && (
                        <p className="text-red-400 text-xs mt-1 break-words">{localError}</p>
                    )}
                </div>

                {serverError && (
                    <p className="text-red-400 text-xs break-words">{serverError}</p>
                )}

                {info && (
                    <p className="text-green-400 text-xs break-words">{info}</p>
                )}

                <button
                    type="submit"
                    disabled={verifyMutation.isPending}
                    className="w-full bg-orange-600 text-white text-sm font-medium py-2.5 rounded-md hover:bg-orange-700 transition disabled:opacity-60"
                >
                    {verifyMutation.isPending ? 'Verifying...' : 'Verify'}
                </button>

            </form>

            <div className="flex items-center justify-between mt-5 text-xs text-gray-300">
                <button type="button" onClick={onBack} className="hover:text-white">
                    Change email
                </button>

                <button
                    type="button"
                    onClick={handleResend}
                    disabled={cooldown > 0 || resendMutation.isPending}
                    className="text-orange-600 font-medium hover:text-orange-500 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
                </button>
            </div>
        </>
    );
}

export default OtpVerify;