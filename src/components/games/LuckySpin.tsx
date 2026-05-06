import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';
import { ChevronLeft, Coins } from 'lucide-react';
import { useSignMessage, useAccount } from 'wagmi';
import { BUILDER_CODE } from '../../lib/erc8021';

interface Props {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  onClose: () => void;
}

const SYMBOLS = ['🔵', '💎', '🍒', '7️⃣', '🔔', '🚀'];
const BASE_SYMBOL = '🔵'; 
const MULTIPLIERS: Record<string, number> = {
  '🔵': 10,
  '💎': 5,
  '7️⃣': 3,
  '🚀': 2,
  '🔔': 1.5,
  '🍒': 1.2
};

export default function LuckySpin({ balance, setBalance, onClose }: Props) {
  const [bet, setBet] = useState(10);
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState(['🔵', '🔵', '🔵']);
  const [winMessage, setWinMessage] = useState('');
  
  const { signMessageAsync } = useSignMessage();
  const { address } = useAccount();

  const spin = async () => {
    if (balance < bet || spinning) return;
    
    setSpinning(true);
    setBalance(prev => prev - bet);
    setWinMessage('');

    // Simulate outcome
    // Small chance for a big win
    const isWin = Math.random() < 0.3;
    let newReels = [];
    if (isWin) {
      const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      newReels = [symbol, symbol, symbol];
    } else {
      newReels = [
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
      ];
      // Ensure it's not a win
      if (newReels[0] === newReels[1] && newReels[1] === newReels[2]) {
        newReels[2] = SYMBOLS[(SYMBOLS.indexOf(newReels[2]) + 1) % SYMBOLS.length];
      }
    }

    // Spin animation duration
    await new Promise(resolve => setTimeout(resolve, 2000));
    setReels(newReels);
    
    if (newReels[0] === newReels[1] && newReels[1] === newReels[2]) {
      const wonAmount = bet * MULTIPLIERS[newReels[0]];
      setBalance(prev => prev + wonAmount);
      setWinMessage(`BIG WIN! +${wonAmount}`);

      // Haptic feedback if available
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([200, 100, 200]);
      }
    }

    setSpinning(false);
  };

  const handleRecordWin = async () => {
    try {
      if (address) {
        await signMessageAsync({ account: address, message: `I just won big on Base Casino Lucky Spin! Builder: ${BUILDER_CODE}` });
      } else {
        await signMessageAsync({ message: `I just won big on Base Casino Lucky Spin! Builder: ${BUILDER_CODE}` } as any);
      }
      alert("Win recorded on-chain! (Simulated)");
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
        <h2 className="text-xl font-bold text-white tracking-wider uppercase">Lucky Spin</h2>
        <div className="w-10" />
      </div>

      {/* Machine */}
      <div className="flex-1 flex flex-col items-center justify-center">
        
        <div className="bg-gradient-to-br from-purple-600 to-blue-700 p-2 rounded-3xl w-full max-w-sm shadow-[0_0_40px_rgba(168,85,247,0.3)]">
          <div className="bg-slate-900 rounded-2xl p-6 border-4 border-slate-800 flex justify-between items-center overflow-hidden relative">
            
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

            {reels.map((symbol, i) => (
              <div key={i} className="bg-slate-950 rounded-xl w-20 h-24 flex items-center justify-center text-5xl shadow-inner border border-slate-800 relative overflow-hidden">
                <motion.div
                  animate={spinning ? { y: [0, -100, 100, 0] } : { y: 0 }}
                  transition={spinning ? { repeat: Infinity, duration: 0.2, ease: "linear", delay: i * 0.1 } : {}}
                  className="absolute"
                >
                  {spinning ? '🎰' : symbol}
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Win Message */}
        <div className="h-20 flex items-center justify-center my-4">
          {winMessage && (
            <motion.div 
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="px-6 py-2 bg-yellow-400 text-yellow-900 font-extrabold text-2xl rounded-full shadow-[0_0_20px_rgba(250,204,21,0.5)] flex flex-col items-center"
            >
              {winMessage}
              <button 
                onClick={handleRecordWin}
                className="text-xs bg-yellow-900 text-yellow-100 px-3 py-1 rounded-full mt-2 hover:bg-yellow-800"
              >
                Record This Win On-Chain
              </button>
            </motion.div>
          )}
        </div>

        {/* Controls */}
        <div className="w-full max-w-sm bg-slate-900 p-4 rounded-3xl border border-slate-800 flex flex-col gap-4">
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
                className={`flex-1 py-2 rounded-xl font-bold text-sm transition-colors ${bet === b ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'}`}
              >
                {b}
              </button>
            ))}
          </div>

          <button 
            onClick={spin}
            disabled={spinning || balance < bet}
            className={`w-full py-4 rounded-2xl font-black text-xl tracking-widest uppercase transition-all mt-2 ${spinning || balance < bet ? 'bg-slate-800 text-slate-600' : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-[1.02]'}`}
          >
            {spinning ? 'SPINNING...' : 'SPIN'}
          </button>
        </div>

      </div>
    </div>
  );
}
