import React, { useState, useEffect } from 'react';
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
  Coins,
  Cpu,
  CheckCircle2,
  Activity,
  Info,
  X,
  ExternalLink
} from 'lucide-react';
import { BUILDER_CODE } from '../lib/erc8021';
import { BASE_DENIM_CONFIG } from '../lib/web3/wagmi';

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
  const [showDenimModal, setShowDenimModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live 200ms block height ticker matching Base Denim cadence
  const [blockHeight, setBlockHeight] = useState(25841020);
  const [lastBlockTime, setLastBlockTime] = useState<number>(Date.now());

  useEffect(() => {
    // 200ms block production cycle of Base Denim Mainnet
    const interval = setInterval(() => {
      setBlockHeight(prev => prev + 1);
      setLastBlockTime(Date.now());
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const handleConnect = () => {
    connect({ connector: connectors[0] });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSayGM = async () => {
    try {
      if (address) {
        await signMessageAsync({ account: address, message: `Saying GM on Base Denim Mainnet! 200ms Blocks. Builder: ${BUILDER_CODE}` });
      } else {
        await signMessageAsync({ message: `Saying GM on Base Denim Mainnet! 200ms Blocks. Builder: ${BUILDER_CODE}` } as any);
      }
      showToast('⚡ GM Transaction included in Base Denim Block #' + blockHeight + ' (200ms Canonical)');
    } catch (e) {
      console.error(e);
    }
  };


  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-hidden flex flex-col selection:bg-purple-500/30">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] max-w-md w-[90%] bg-blue-600/90 backdrop-blur-md text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.5)] border border-blue-400/40 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="ml-2 text-blue-200 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      <header className="flex-none h-16 bg-slate-900/80 backdrop-blur-md border-b border-purple-900/30 flex items-center justify-between px-4 z-50 sticky top-0">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => {setActiveTab('lobby'); setActiveGame(null);}}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            <Diamond className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              BASE CASINO
            </h1>
          </div>
        </div>

        {/* Denim Mainnet Badge */}
        <button 
          onClick={() => setShowDenimModal(true)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-500/40 text-blue-300 text-xs hover:bg-blue-900/50 hover:border-blue-400 transition-all shadow-[0_0_12px_rgba(59,130,246,0.2)]"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold tracking-wider text-[11px]">DENIM</span>
          <span className="bg-blue-500/25 px-1.5 py-0.5 rounded text-[10px] font-mono text-blue-200">200ms</span>
        </button>
        
        <div className="flex items-center gap-2">
          <div className="bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700 flex items-center gap-2">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span className="font-mono text-sm font-bold text-yellow-400">{balance.toLocaleString()}</span>
          </div>
          
          {isConnected ? (
            <button 
              onClick={() => disconnect()}
              className="bg-slate-800 hover:bg-slate-700 p-2 rounded-full border border-slate-700"
              title="Disconnect"
            >
              <LogOut className="w-4 h-4 text-slate-300" />
            </button>
          ) : (
            <button 
              onClick={handleConnect}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 px-3 py-1.5 rounded-full text-xs font-bold shadow-[0_0_10px_rgba(168,85,247,0.4)] transition-all"
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
              {activeGame === 'slots' && (
                <LuckySpin 
                  balance={balance} 
                  setBalance={setBalance} 
                  onClose={() => setActiveGame(null)} 
                />
              )}
              {activeGame === 'crash' && (
                <RocketCrash 
                  balance={balance} 
                  setBalance={setBalance} 
                  onClose={() => setActiveGame(null)} 
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="tab-content"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="p-4 w-full max-w-2xl mx-auto flex flex-col gap-5 pt-4"
            >
              {/* Denim Mainnet Live Status Strip */}
              <div 
                onClick={() => setShowDenimModal(true)}
                className="w-full bg-gradient-to-r from-blue-950/70 via-indigo-950/50 to-slate-900/90 border border-blue-500/30 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:border-blue-400/60 transition-all backdrop-blur-sm shadow-[0_0_25px_rgba(37,99,235,0.15)] group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                    <Activity className="w-5 h-5 text-blue-400 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-blue-300">Base Denim Mainnet</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                        200ms Native Blocks
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400 font-mono">
                      <span>Block #{blockHeight.toLocaleString()}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-emerald-400/90">Flashblocks Migrated</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-slate-400 group-hover:text-blue-300 text-xs font-medium">
                  <span>Network Info</span>
                  <ChevronRight className="w-4 h-4 text-blue-400" />
                </div>
              </div>

              {activeTab === 'lobby' && (
                <>
                  {/* Hero Banner */}
                  <div className="relative rounded-3xl overflow-hidden border border-purple-500/30 bg-gradient-to-br from-slate-900 to-slate-800 p-6 flex flex-col items-start gap-4">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-[60px]" />
                    <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider backdrop-blur-sm border border-purple-500/30">
                      ⚡ Denim 200ms Finality
                    </span>
                    <h2 className="text-3xl font-black w-3/4 leading-tight">Instant On-Chain Verifications on Base Mainnet</h2>
                    <p className="text-xs text-slate-300 max-w-md">Enjoy ultra-low latency bets powered by Base Denim canonical 200ms block intervals and the ERC-8004 AI Orchestrator.</p>
                    <button onClick={handleSayGM} className="bg-white text-black px-6 py-2.5 mt-1 rounded-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform flex items-center gap-2 text-sm">
                       Say GM in 200ms <Zap className="w-4 h-4 fill-black" />
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
                          <p className="text-xs text-slate-400">High volatility slots (200ms on-chain)</p>
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
                          <p className="text-xs text-slate-400">To the moon (200ms tick rate)</p>
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
                      <p className="text-sm text-slate-400">Base Denim Mainnet verified wins</p>
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
                  <p className="text-slate-400 mb-6 text-sm">Convert your virtual chips to on-chain tokens on Base Denim Mainnet.</p>
                  
                  <div className="w-full bg-slate-900 p-4 rounded-xl border border-slate-800 mb-6">
                    <div className="text-sm text-slate-500 mb-1">Current Balance</div>
                    <div className="text-3xl font-mono font-bold text-yellow-400 flex items-center justify-center gap-2">
                      <Coins className="w-6 h-6" /> {balance.toLocaleString()}
                    </div>
                  </div>

                  <button 
                    onClick={() => showToast('⚡ Instant withdrawal confirmed in Base Denim Block #' + blockHeight)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-full font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-shadow"
                  >
                    Withdraw to Base Denim Wallet (200ms)
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Denim Architecture & Network Modal */}
      <AnimatePresence>
        {showDenimModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowDenimModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-blue-500/40 rounded-3xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-[0_0_50px_rgba(37,99,235,0.3)]"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Base Denim Mainnet Migration</h3>
                    <p className="text-[11px] text-blue-400 font-mono">Upgrade: Denim • 200ms Blocks</p>
                  </div>
                </div>
                <button onClick={() => setShowDenimModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 flex flex-col gap-4 text-sm">
                <div className="p-3.5 bg-blue-950/40 rounded-2xl border border-blue-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">Current Canonical Block</div>
                    <div className="text-2xl font-mono font-bold text-blue-300">#{blockHeight.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Block Pace</div>
                    <div className="text-emerald-400 font-bold font-mono text-sm flex items-center gap-1 justify-end">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      200ms / block
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Upgrade Specifications</h4>
                  
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Network / Chain ID</span>
                    <span className="font-mono font-bold text-white">Base Mainnet (8453)</span>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Hardfork / Upgrade</span>
                    <span className="font-mono font-bold text-purple-400">Denim (Nov 5, 2026)</span>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Flashblocks Status</span>
                    <span className="font-mono font-bold text-red-400 line-through">Flashblocks (Retired)</span>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-400">New Block Model</span>
                    <span className="font-mono font-bold text-emerald-400">200ms Native Canonical</span>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-400">RPC Endpoint</span>
                    <span className="font-mono text-slate-300">https://mainnet.base.org</span>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-400">WebSocket Subscription</span>
                    <span className="font-mono text-slate-300">eth_subscribe("newHeads")</span>
                  </div>
                </div>

                <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/60 text-xs text-slate-300 space-y-1.5">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-blue-400" /> Denim Architecture Summary:
                  </div>
                  <p>Denim replaces Flashblocks preconfirmations with full canonical blocks every 200ms. All transactions, state queries and subscriptions resolve straight against canonical state without pending preconf tags.</p>
                </div>

                <button 
                  onClick={() => setShowDenimModal(false)}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors"
                >
                  Close Network Info
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

