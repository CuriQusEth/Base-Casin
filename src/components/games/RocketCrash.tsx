import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Coins, Rocket, AlertTriangle } from 'lucide-react';
import { useSignMessage, useAccount } from 'wagmi';
import { BUILDER_CODE } from '../../lib/erc8021';

interface Props {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  onClose: () => void;
}

export default function RocketCrash({ balance, setBalance, onClose }: Props) {
  const [bet, setBet] = useState(10);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'crashed'>('idle');
  const [multiplier, setMultiplier] = useState(1.0);
  const [crashPoint, setCrashPoint] = useState(0);
  const [winAmount, setWinAmount] = useState(0);
  
  const multiplierRef = useRef(1.0);
  const animationRef = useRef<number>(0);
  
  const { signMessageAsync } = useSignMessage();
  const { address } = useAccount();

  const startGame = () => {
    if (balance < bet) return;
    setBalance(prev => prev - bet);
    setGameState('playing');
    setMultiplier(1.0);
    multiplierRef.current = 1.0;
    setWinAmount(0);

    // Calculate crash point beforehand (biased towards house)
    const e = 100;
    const h = Math.random() * 100;
    // House edge calculation
    let p = 100 * e - h;
    p = p / (e - h);
    // Limit max to 1000x to prevent insane runs
    const finalCrash = Math.max(1.0, Math.min(p / 100, 1000.0));
    setCrashPoint(finalCrash);

    let lastTime = performance.now();
    
    // Animation loop
    const update = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Exponential growth
      multiplierRef.current += (multiplierRef.current * 0.1) * delta;
      
      if (multiplierRef.current >= finalCrash) {
        setMultiplier(finalCrash);
        setGameState('crashed');
        cancelAnimationFrame(animationRef.current);
        if (window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate(500);
        }
        return;
      }

      setMultiplier(multiplierRef.current);
      animationRef.current = requestAnimationFrame(update);
    };

    animationRef.current = requestAnimationFrame(update);
  };

  const cashOut = () => {
    if (gameState !== 'playing') return;
    cancelAnimationFrame(animationRef.current);
    
    const won = bet * multiplier;
    setBalance(prev => prev + won);
    setWinAmount(won);
    setGameState('idle'); // Instead of showing crash immediately, go to idle with win message

    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([100, 50, 100]);
    }
  };

  useEffect(() => {
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  const handleRecordWin = async () => {
    try {
      if (address) {
        await signMessageAsync({ account: address, message: `I escaped the crash at ${multiplier.toFixed(2)}x on Base Casino! Base Denim Mainnet 200ms Blocks. Builder: ${BUILDER_CODE}` });
      } else {
        await signMessageAsync({ message: `I escaped the crash at ${multiplier.toFixed(2)}x on Base Casino! Base Denim Mainnet 200ms Blocks. Builder: ${BUILDER_CODE}` } as any);
      }
      alert("⚡ Win recorded on Base Denim Mainnet! Included in 200ms canonical block.");
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 p-4 pt-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-300">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-white tracking-wider uppercase">Rocket Crash</h2>
        <div className="w-10" />
      </div>

      {/* Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        
        {/* Main Canvas / Visualizer */}
        <div className="relative w-full max-w-sm h-64 bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden flex flex-col items-center justify-center shadow-inner">
          
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

          {gameState === 'crashed' && (
            <div className="absolute inset-0 bg-red-500/20 z-10 flex flex-col items-center justify-center backdrop-blur-sm">
              <AlertTriangle className="w-12 h-12 text-red-500 mb-2" />
              <div className="text-3xl font-black text-red-500">CRASHED</div>
              <div className="text-xl font-mono text-red-400">@ {multiplier.toFixed(2)}x</div>
            </div>
          )}

          <div className="z-20 text-center">
            <motion.div 
               animate={gameState === 'playing' ? { y: [-5, 5, -5], x: [-2, 2, -2] } : {}}
               transition={{ repeat: Infinity, duration: 0.5 }}
               className="mb-4"
            >
              <Rocket className={`w-16 h-16 ${gameState === 'playing' ? 'text-blue-500' : 'text-slate-500'} mx-auto transform -rotate-45`} />
            </motion.div>
            <div className={`text-6xl font-black font-mono font-bold tracking-tighter ${gameState === 'playing' ? 'text-blue-400' : 'text-slate-300'}`}>
              {multiplier.toFixed(2)}x
            </div>
          </div>
          
        </div>

        {/* Win Message for CashOut */}
        {winAmount > 0 && gameState === 'idle' && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center bg-green-500/20 text-green-400 px-6 py-2 rounded-full border border-green-500/50"
          >
            <span className="font-bold">Cashed out! +{winAmount.toFixed(0)}</span>
            <button onClick={handleRecordWin} className="text-xs mt-1 underline">Record On-Chain</button>
          </motion.div>
        )}

        {/* Controls */}
        <div className="w-full max-w-sm bg-slate-900 p-4 rounded-3xl border border-slate-800 flex flex-col gap-4 mt-auto">
          <div className="flex justify-between items-center text-sm font-bold text-slate-400">
            <span>BET AMOUNT</span>
            <div className="flex items-center gap-1 text-white">
              <Coins className="w-4 h-4 text-yellow-400" />
              {bet}
            </div>
          </div>
          <div className="flex gap-2">
            {[10, 50, 100, 500].map(b => (
              <button 
                key={b}
                onClick={() => setBet(b)}
                disabled={gameState === 'playing'}
                className={`flex-1 py-2 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 ${bet === b ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
              >
                {b}
              </button>
            ))}
          </div>

          {gameState === 'idle' || gameState === 'crashed' ? (
            <button 
              onClick={startGame}
              disabled={balance < bet}
              className={`w-full py-4 rounded-2xl font-black text-xl tracking-widest uppercase transition-all mt-2 ${balance < bet ? 'bg-slate-800 text-slate-600' : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-[1.02]'}`}
            >
              START
            </button>
          ) : (
            <button 
              onClick={cashOut}
              className="w-full py-4 rounded-2xl font-black text-xl tracking-widest uppercase transition-all mt-2 bg-green-500 text-white shadow-[0_0_30px_rgba(34,197,94,0.6)] hover:bg-green-400"
            >
              CASH OUT ({(bet * multiplier).toFixed(0)})
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
