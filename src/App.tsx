/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Clock } from 'lucide-react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const EVENT_DETAILS = {
  date: "Wednesday 27th May 2026",
  time: "7.30 – 8.30pm BST",
  format: "Online. Accessible from any device, anywhere.",
};

const TARGET_DATE = new Date("2026-05-27T18:30:00Z");

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = TARGET_DATE.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft(null);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) return null;

  return (
    <div className="flex gap-4 md:gap-8 justify-center text-accent uppercase tracking-widest font-semibold text-[10px] md:text-xs">
      <div className="flex flex-col items-center">
        <span className="text-xl md:text-2xl font-serif text-page-text leading-none mb-1">{timeLeft.days}</span>
        <span>Days</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xl md:text-2xl font-serif text-page-text leading-none mb-1">{timeLeft.hours}</span>
        <span>Hrs</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xl md:text-2xl font-serif text-page-text leading-none mb-1">{timeLeft.minutes}</span>
        <span>Min</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xl md:text-2xl font-serif text-page-text leading-none mb-1">{timeLeft.seconds}</span>
        <span>Sec</span>
      </div>
    </div>
  );
}

// Simple form component for reuse
function RegistrationForm({ onSuccess }: { onSuccess: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorStatus(null);
    
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitting(false);
        onSuccess();
      } else {
        setErrorStatus(data.error || "Something went wrong. Please try again.");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setErrorStatus("Failed to connect to server. Please try again later.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="firstName" className="sr-only">First Name</label>
            <input
              id="firstName"
              type="text"
              required
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-page-text placeholder:text-gray-400"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              id="email"
              type="email"
              required
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-page-text placeholder:text-gray-400"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-lg"
        >
          {isSubmitting ? "Reserving..." : "Reserve My Free Spot"}
        </button>
      </form>
      {errorStatus && (
        <p className="mt-4 text-sm text-red-600 font-medium">{errorStatus}</p>
      )}
    </div>
  );
}

export default function App() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const registrationRef = useRef<HTMLDivElement>(null);

  const scrollToRegistration = () => {
    registrationRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* SECTION: HERO */}
      <section className="px-6 pt-20 pb-32 md:pt-32 md:pb-48 max-w-5xl mx-auto w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1 mb-6 text-sm font-medium tracking-widest uppercase border border-accent/20 text-accent bg-accent/5 rounded-full">
            Free Evening Workshop | Ajyle AI
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-8">
            You didn't start a business to work <span className="italic serif-italic">this hard.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto mb-8 leading-relaxed font-sans">
            One free evening. No jargon, no tech background required. Just the real picture of how AI helps you run your business without it running you.
          </p>

          <div className="flex flex-col items-center gap-4 mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/5 text-accent text-xs md:text-sm font-semibold tracking-wider uppercase rounded-full border border-accent/10">
              <Clock className="w-3 h-3 md:w-4 h-4" />
              <span>{EVENT_DETAILS.date} | {EVENT_DETAILS.time} | Online — any device, anywhere</span>
            </div>
            <CountdownTimer />
          </div>
          
          <div className="flex flex-col items-center gap-6" ref={registrationRef}>
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full flex flex-col items-center"
                >
                  <RegistrationForm onSuccess={() => setIsSubmitted(true)} />
                  <p className="mt-4 text-sm text-gray-500">
                    Free to attend. No card required. 30 seconds to register.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-accent/5 border border-accent/10 p-8 rounded-2xl flex flex-col items-center text-center max-w-md w-full"
                >
                  <CheckCircle2 className="w-12 h-12 text-accent mb-4" />
                  <div className="space-y-4 text-page-text">
                    <p className="text-xl font-medium">Check your inbox now for everything you need to get started.</p>
                    <div className="text-sm space-y-2 text-gray-600">
                      <p className="font-bold text-page-text">Can't find my email?</p>
                      <p>
                        Please check your Spam or Junk folders. And to make sure you never miss an update, 
                        add <span className="font-medium text-accent">aiworkshops@ajyle.ai</span> to your whitelist or "Safe Senders" list.
                      </p>
                    </div>
                    <p className="text-lg font-serif italic serif-italic pt-2">See you on the inside!</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* SECTION 1 — NAME THE FEELING */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-6 text-lg md:text-xl text-gray-800 leading-relaxed">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-page-text">There was a version of this that looked different in your head.</h2>
            
            <p>More control. A bit more money. Work that actually felt like yours.</p>

            <p>
              And then reality arrived. The invoices. The follow-ups. The admin you keep doing manually because
              you haven't found a better way yet. The emails at 10pm. The feeling that you're spinning fast
              and going nowhere.
            </p>

            <p>You're not failing. You're just doing everything yourself. And there's a ceiling on how far that gets you.</p>

            <p>
              The people who break through that ceiling aren't grinding harder. They've built something that works
              without them having to be in every single part of it.
            </p>

            <p>Not because they're smarter. Because they've got a better setup.</p>
          </div>
        </div>
      </section>

      <hr className="border-gray-100 max-w-5xl mx-auto w-full" />

      {/* SECTION 2 — THE REAL PROBLEM */}
      <section className="px-6 py-24">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-page-text">Most small business owners are trapped.</h2>
          <div className="space-y-6 text-lg md:text-xl text-gray-700 leading-relaxed">
            <p>
              There's a distinction that changes everything once you see it. A job pays you for your time.
              The moment you stop, the money stops.
            </p>

            <p>A business generates income from a setup that works whether you're there or not.</p>

            <p>
              Most people who "own a business" are still in the first category. Still trading time for money.
              Still the bottleneck in their own operation.
            </p>

            <p>That's not a character flaw. It's a setup problem.</p>

            <p className="font-medium text-page-text italic">The question is what it would actually take to fix it.</p>
          </div>
        </div>
      </section>

      {/* SECTION 3 — AND IF YOU'RE STILL IN A JOB */}
      <section className="px-6 py-24 bg-accent/5">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-page-text">And if you're still in a job</h2>
          <div className="space-y-6 text-lg md:text-xl text-gray-700 leading-relaxed">
            <p>You might be reading this thinking: that's not me. I'm employed.</p>

            <p className="font-medium text-page-text">Stay with it.</p>

            <p>
              The job market doesn't feel the same as it did two years ago. If you've been thinking about
              building something of your own, a side income, a business, something that doesn't depend on
              someone else's payroll decisions, you're not the only one.
            </p>

            <p>
              Most people don't know where to start. Or whether the timing is right. Or whether they've got
              what it takes.
            </p>

            <p>
              The starting point is closer than you think. And the tools available right now make it genuinely
              possible to build something real, without quitting tomorrow, without a big budget, and without
              a technical background.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4 — WHY AI CHANGES THIS */}
      <section className="px-6 py-24">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-page-text">AI doesn't do everything for you.</h2>
          <div className="space-y-6 text-lg md:text-xl text-gray-700 leading-relaxed">
            <p>
              But it handles the parts of your business that eat your time and block your thinking. The research.
              The first drafts. The follow-ups. The repetitive tasks you've been doing manually because there
              was no other option.
            </p>

            <p>
              The newer generation of AI tools, agents that run in the background, automations that don't need
              you touching them, that kind of setup used to be for businesses with proper teams. It's not anymore.
              It's available to anyone willing to learn how to use it.
            </p>

            <p className="font-medium text-page-text text-xl">That's what this workshop is about.</p>

            <p>
              Not theory. Not a demo of a chatbot. The actual tools, working in real time, so you can see
              what's possible and decide for yourself what to do with it.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5 — WHAT YOU'LL LEAVE WITH */}
      <section className="px-6 py-24 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <span className="block text-sm font-semibold tracking-widest uppercase text-accent mb-12">One evening. Here's what changes.</span>
          
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
            {[
              {
                title: "Which AI tools are actually worth your time.",
                desc: "There's a lot of noise. We'll cut through it. You'll know what does what, which ones suit your situation, and which ones to ignore."
              },
              {
                title: "How to use Claude as more than just a writing tool.",
                desc: "Most people use it to draft emails. That's scratching the surface. You'll see it used for planning, research, decision-making, and running parts of a business. Live, in the room."
              },
              {
                title: "What automation and AI agents actually mean in practice.",
                desc: "No jargon. No hype. A clear picture of what they can do, what they can't, and how a non-technical person sets one up."
              },
              {
                title: "Where AI fits in your specific situation.",
                desc: "Whether you've already got a business or you're building something from scratch. You won't leave with generic advice. You'll leave with a clear idea of your own next step."
              }
            ].map((item, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="font-serif text-2xl font-bold leading-tight">{item.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 flex flex-col items-center">
            <button
              onClick={scrollToRegistration}
              className="px-8 py-4 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-all text-xl shadow-lg shadow-accent/10"
            >
              Reserve My Free Spot
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 6 — WHO THIS IS FOR */}
      <section className="px-6 py-24">
        <div className="max-w-3xl mx-auto space-y-12">
          <h2 className="font-serif text-4xl font-bold text-center">This is for one of three people.</h2>
          
          <div className="space-y-8 text-lg md:text-xl text-gray-700 leading-relaxed">
            <div className="p-6 border-l-2 border-accent/20 bg-accent/[0.02]">
              <p>You're running your own business or working solo, and you're stretched. You know you need to work smarter but you haven't found the right way to do it yet.</p>
            </div>
            
            <div className="p-6 border-l-2 border-accent/20 bg-accent/[0.02]">
              <p>You're in a job that feels less certain than it used to. You want to build something on the side, but you're not sure where to start or whether AI would actually help you get there.</p>
            </div>
            
            <div className="p-6 border-l-2 border-accent/20 bg-accent/[0.02]">
              <p>You've tried a few AI tools and nothing's clicked. You haven't seen it do something genuinely useful for your type of work.</p>
            </div>

            <p className="text-center font-medium text-page-text pt-4">If any of that's true, this session's for you.</p>
          </div>
        </div>
      </section>

      {/* SECTION 7 — WHO IT'S NOT FOR */}
      <section className="px-6 py-24 bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold">Be honest with yourself.</h2>
          <div className="space-y-6 text-lg md:text-xl text-gray-300 leading-relaxed">
            <p>If you want a shortcut that requires nothing from you, this isn't it.</p>
            <p>
              But if you're willing to show up and think seriously about how you work, you'll leave with
              something many people spend months trying to figure out on their own.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 8 — ABOUT ADE */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20">
          <div className="w-full md:w-1/3">
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5">
              <img 
                src="/ade-shokoya.png" 
                alt="Ade Shokoya" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Ade+Shokoya&background=CC5500&color=fff&size=512";
                }}
              />
            </div>
          </div>
          <div className="w-full md:w-2/3 space-y-8">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-page-text">Why is this free?</h2>
            <div className="space-y-6 text-lg md:text-xl text-gray-700 leading-relaxed">
              <p>My name is Ade Shokoya. I'm the founder of Ajyle AI.</p>
              
              <p>
                I work with business owners, solopreneurs, and small teams to help them use AI in a way that
                actually makes a difference. Not surface level. Built into how they actually operate.
              </p>
  
              <p>
                I'm running this free because I think the conversation around AI has left too many people behind.
                It's either too technical, too hyped, or it's being sold to people in a way that doesn't
                actually help them.
              </p>
  
              <p>This is my way of showing you what it looks like. Practically. Honestly. In plain English.</p>
  
              <p className="font-medium text-page-text">Come and see it. Then decide what you want to do with it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9 — FINAL CTA */}
      <section className="px-6 py-32 md:py-48 bg-white text-center border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-gray-400 mb-6">
            {EVENT_DETAILS.date} | {EVENT_DETAILS.time} | Online
          </p>
          <h2 className="font-serif text-4xl md:text-6xl font-bold mb-8 leading-tight">The session is free.<br />The spot is yours.</h2>
          
          <p className="text-xl text-gray-700 mb-12 leading-relaxed">
            No hard sell. Just a practical evening that could change how you think
            about your business, or your next move.
            <br className="hidden md:block" />
            <span className="font-medium text-page-text">Register below. You'll get everything you need straight to your inbox.</span>
          </p>

          <div className="flex flex-col items-center gap-6">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="form-final"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full flex flex-col items-center"
                >
                  <RegistrationForm onSuccess={() => setIsSubmitted(true)} />
                  <p className="mt-4 text-sm text-gray-500">
                    Free to attend. No card required. 30 seconds to register.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="success-final"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-accent/5 border border-accent/10 p-8 rounded-2xl flex flex-col items-center text-center max-w-md w-full"
                >
                  <CheckCircle2 className="w-12 h-12 text-accent mb-4" />
                  <div className="space-y-4 text-page-text">
                    <p className="text-xl font-medium">Check your inbox now for everything you need to get started.</p>
                    <div className="text-sm space-y-2 text-gray-600">
                      <p className="font-bold text-page-text">Can't find my email?</p>
                      <p>
                        Please check your Spam or Junk folders. And to make sure you never miss an update, 
                        add <span className="font-medium text-accent">aiworkshops@ajyle.ai</span> to your whitelist or "Safe Senders" list.
                      </p>
                    </div>
                    <p className="text-lg font-serif italic serif-italic pt-2">See you on the inside!</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-12 px-6 text-center text-gray-400 text-sm border-t border-gray-50">
        <p>&copy; {new Date().getFullYear()} Ajyle AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
