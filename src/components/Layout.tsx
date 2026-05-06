import React, { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  Trophy, 
  Wallet, 
  LogOut, 
  ChevronRight,
  TrendingUp,
  Diamond,
  Zap,
  Coins
} from 'lucide-react';
import { BUILDER_CODE } from '../lib/erc8021';

// Games
import LuckySpin from './games/LuckySpin';
import RocketCrash from './games/RocketCrash';

export default function Layout() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  const [activeTab, setActiveTab] = useState('lobby'); // lobby, games, vault, leaderboard
  const [activeGame, setActiveGame] = useState<string | null>(null);
  
  const [balance, setBalance] = useState(1000); // Mock offchain balance

  const handleConnect = () => {
    connect({ connector: connectors[0] });
  };

  const handleSayGM = async () => {
    try {
      // Mocking SIWE / GM Transaction
      if (address) {
        await signMessageAsync({ account: address, message: `Saying GM to Base Casino! Builder: ${BUILDER_CODE}` });
      } else {
        await signMessageAsync({ message: `Saying GM to Base Casino! Builder: ${BUILDER_CODE}` } as any);
      }
      alert('GM Transaction Submitted (Mocked)!');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-hidden flex flex-col selection:bg-purple-500/30">
      
      {/* Top Navbar */}
      <header className="flex-none h-16 bg-slate-900/80 backdrop-blur-md border-b border-purple-900/30 flex items-center justify-between px-4 z-50 sticky top-0">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => {setActiveTab('lobby'); setActiveGame(null);}}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            <Diamond className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            BASE CASINO
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700 flex items-center gap-2">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span className="font-mono text-sm font-bold text-yellow-400">{balance.toLocaleString()}</span>
          </div>
          
          {isConnected ? (
            <button 
              onClick={() => disconnect()}
              className="bg-slate-800 hover:bg-slate-700 p-2 rounded-full border border-slate-700"
            >
              <LogOut className="w-4 h-4 text-slate-300" />
            </button>
          ) : (
            <button 
              onClick={handleConnect}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 px-4 py-1.5 rounded-full text-sm font-bold shadow-[0_0_10px_rgba(168,85,247,0.4)] transition-all"
            >
              Connect
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow overflow-y-auto relative pb-20">
        {/* Background glow effects */}
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />

        <AnimatePresence mode="wait">
          {activeGame ? (
            <motion.div
              key="game"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full"
            >
              {activeGame === 'slots' && <LuckySpin balance={balance} setBalance={setBalance} onClose={() => setActiveGame(null)} />}
              {activeGame === 'crash' && <RocketCrash balance={balance} setBalance={setBalance} onClose={() => setActiveGame(null)} />}
            </motion.div>
          ) : (
            <motion.div
              key="tab-content"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="p-4 w-full max-w-2xl mx-auto flex flex-col gap-6 pt-6"
            >
              {activeTab === 'lobby' && (
                <>
                  {/* Hero Banner */}
                  <div className="relative rounded-3xl overflow-hidden border border-purple-500/30 bg-gradient-to-br from-slate-900 to-slate-800 p-6 flex flex-col items-start gap-4">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-[60px]" />
                    <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider backdrop-blur-sm border border-purple-500/30">
                      Welcome Bonus
                    </span>
                    <h2 className="text-3xl font-black w-3/4 leading-tight">100% Match on your first Deposit</h2>
                    <button onClick={handleSayGM} className="bg-white text-black px-6 py-2 mt-2 rounded-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform flex items-center gap-2">
                       Say GM On-Chain <Zap className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Games Grid */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
                      <Gamepad2 className="w-5 h-5 text-purple-400" /> Hit the Tables
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      
                      <button 
                        onClick={() => setActiveGame('slots')}
                        className="group relative rounded-2xl border border-slate-700 bg-slate-800/50 p-4 overflow-hidden hover:border-purple-500/50 transition-colors text-left flex flex-col gap-2"
                      >
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-500/20 rounded-full blur-xl group-hover:bg-purple-500/40 transition-colors" />
                        <span className="text-4xl text-left block">🎰</span>
                        <div className="mt-2">
                          <h4 className="font-bold text-white text-lg">Lucky Spin</h4>
                          <p className="text-xs text-slate-400">High volatility slots</p>
                        </div>
                      </button>

                      <button 
                        onClick={() => setActiveGame('crash')}
                        className="group relative rounded-2xl border border-slate-700 bg-slate-800/50 p-4 overflow-hidden hover:border-blue-500/50 transition-colors text-left flex flex-col gap-2"
                      >
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-500/40 transition-colors" />
                        <span className="text-4xl text-left block">🚀</span>
                        <div className="mt-2">
                          <h4 className="font-bold text-white text-lg">Crash</h4>
                          <p className="text-xs text-slate-400">To the moon</p>
                        </div>
                      </button>

                      <button 
                        className="group relative rounded-2xl border border-slate-800 bg-slate-900/50 p-4 overflow-hidden opacity-50 cursor-not-allowed text-left flex flex-col gap-2"
                      >
                        <span className="text-4xl text-left block">🃏</span>
                        <div className="mt-2">
                          <h4 className="font-bold text-white text-lg">Blackjack</h4>
                          <p className="text-xs text-slate-500">Coming Soon</p>
                        </div>
                      </button>

                      <button 
                         className="group relative rounded-2xl border border-slate-800 bg-slate-900/50 p-4 overflow-hidden opacity-50 cursor-not-allowed text-left flex flex-col gap-2"
                      >
                        <span className="text-4xl text-left block">🎡</span>
                        <div className="mt-2">
                          <h4 className="font-bold text-white text-lg">Roulette</h4>
                          <p className="text-xs text-slate-500">Coming Soon</p>
                        </div>
                      </button>

                    </div>
                  </div>
                </>
              )}

              {activeTab === 'leaderboard' && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-yellow-500/20 rounded-full border border-yellow-500/30">
                      <Trophy className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Top High Rollers</h2>
                      <p className="text-sm text-slate-400">On-chain verified wins</p>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
                    {[
                      { rank: 1, name: '0x8f...4a2b', amount: '50,000' },
                      { rank: 2, name: '0x1c...99ef', amount: '24,500' },
                      { rank: 3, name: '0x9b...11c2', amount: '12,200' },
                      { rank: 4, name: '0xaa...bbcc', amount: '8,400' },
                      { rank: 5, name: '0x3d...44ff', amount: '5,000' },
                    ].map((player, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border-b border-slate-800/50 last:border-0 hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <span className={`font-black text-xl w-6 ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-orange-400' : 'text-slate-600'}`}>{player.rank}</span>
                          <span className="font-mono text-sm text-slate-300">{player.name}</span>
                        </div>
                        <div className="flex items-center gap-1 font-bold text-yellow-400">
                           <Coins className="w-4 h-4" /> {player.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'vault' && (
                <div className="flex flex-col items-center justify-center p-8 bg-slate-800/30 rounded-3xl border border-slate-700 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                    <Wallet className="w-8 h-8 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">The Vault</h2>
                  <p className="text-slate-400 mb-6 text-sm">Convert your virtual chips to on-chain tokens.</p>
                  
                  <div className="w-full bg-slate-900 p-4 rounded-xl border border-slate-800 mb-6">
                    <div className="text-sm text-slate-500 mb-1">Current Balance</div>
                    <div className="text-3xl font-mono font-bold text-yellow-400 flex items-center justify-center gap-2">
                      <Coins className="w-6 h-6" /> {balance.toLocaleString()}
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-full font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-shadow">
                    Withdraw to Wallet
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Mobile Navigation */}
      <nav className="flex-none h-20 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 fixed bottom-0 left-0 right-0 z-50 px-6 pb-[env(safe-area-inset-bottom)]">
        <ul className="flex items-center justify-between h-full max-w-sm mx-auto">
          <li>
            <button 
              onClick={() => {setActiveTab('lobby'); setActiveGame(null);}}
              className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === 'lobby' && !activeGame ? 'text-purple-400' : 'text-slate-500'}`}
            >
              <Gamepad2 className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Lobby</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => {setActiveTab('leaderboard'); setActiveGame(null);}}
              className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === 'leaderboard' && !activeGame ? 'text-purple-400' : 'text-slate-500'}`}
            >
              <Trophy className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Top</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => {setActiveTab('vault'); setActiveGame(null);}}
              className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === 'vault' ? 'text-purple-400' : 'text-slate-500'}`}
            >
              <Wallet className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Vault</span>
            </button>
          </li>
        </ul>
      </nav>

    </div>
  );
}
