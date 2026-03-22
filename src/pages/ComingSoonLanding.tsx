import { useEffect, useState } from 'react';

const TARGET_DATE = new Date('2026-02-16T07:00:00');

const calculateTimeLeft = () => {
    const now = new Date();
    const difference = TARGET_DATE.getTime() - now.getTime();

    if (difference > 0) {
        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
};

export default function ComingSoonLanding() {
    const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden text-white"
            style={{
                // Gradient from dark navy to a hint of orange/purple at top right
                background: 'radial-gradient(circle at top right, #3d1c33 0%, #030F35 60%, #000428 100%)'
            }}>

            {/* Background blobs */}
            <div className="absolute top-[10%] left-[20%] w-64 h-64 bg-[#FB5535] rounded-full blur-[128px] opacity-20 mix-blend-screen"></div>
            <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-[#030F35] rounded-full blur-[128px] opacity-50 mix-blend-color-dodge"></div>

            <main className="relative z-10 max-w-4xl w-full text-center space-y-12 animate-in fade-in zoom-in duration-1000">
                {/* Logo/Header */}
                <div className="space-y-4">
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        DWS
                    </h1>
                    <p className="text-xl md:text-2xl font-light text-gray-300 tracking-wide uppercase">
                        The Digital Workspace
                    </p>
                </div>

                {/* Coming Soon Title */}
                <div className="space-y-6">
                    <h2 className="text-5xl md:text-7xl font-bold text-white">
                        Coming <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FB5535] to-[#ff8c75]">Soon</span>
                    </h2>

                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        We're building something extraordinary. The <span className="text-[#FB5535] font-semibold">Digital Workspace</span> is launching soon to empower leaders and digital workers.
                    </p>
                </div>

                {/* Countdown Timer */}
                <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
                    {Object.entries(timeLeft).map(([label, value]) => (
                        <div key={label} className="flex flex-col items-center p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                            <span className="text-3xl md:text-5xl font-bold text-white tabular-nums">
                                {String(value).padStart(2, '0')}
                            </span>
                            <span className="text-xs md:text-sm text-gray-400 uppercase tracking-widest mt-2 font-medium">
                                {label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Stay Tuned Text */}
                <div className="pt-8">
                    <p className="text-xl md:text-2xl font-medium tracking-wide uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                        Stay Tuned
                    </p>
                </div>

            </main>

            <footer className="absolute bottom-8 text-center w-full">
                <p className="text-xs text-gray-500 uppercase tracking-widest">
                    Powered by Digital Qatalyst
                </p>
            </footer>
        </div>
    );
}
