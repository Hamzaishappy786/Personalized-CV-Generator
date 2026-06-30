import type { TrackConfig } from '../types/onboarding';

export const TRACKS: TrackConfig[] = [
  { id: 'Web Frontend',       emoji: '🎨', label: 'Web Frontend',       tagline: 'React, Vue, Angular & more',          gradient: 'from-blue-400 to-cyan-400' },
  { id: 'Web Backend',        emoji: '⚙️', label: 'Web Backend',        tagline: 'Node.js, Python, Go, Java & more',    gradient: 'from-emerald-400 to-teal-500' },
  { id: 'Fullstack',          emoji: '🔮', label: 'Fullstack',          tagline: 'End-to-end web development',          gradient: 'from-violet-400 to-blue-500' },
  { id: 'React Native',       emoji: '📱', label: 'React Native',       tagline: 'Cross-platform mobile with JS/TS',    gradient: 'from-sky-400 to-blue-500' },
  { id: 'Flutter',            emoji: '🦋', label: 'Flutter',            tagline: 'Beautiful apps with Dart',            gradient: 'from-sky-300 to-cyan-500' },
  { id: 'Android (Kotlin)',   emoji: '🤖', label: 'Android (Kotlin)',   tagline: 'Modern Android with Jetpack',         gradient: 'from-green-400 to-emerald-500' },
  { id: 'Android (Java)',     emoji: '☕', label: 'Android (Java)',     tagline: 'Classic Android development',         gradient: 'from-orange-400 to-amber-500' },
  { id: 'iOS (Swift)',        emoji: '🍎', label: 'iOS (Swift)',        tagline: 'SwiftUI, UIKit & Apple frameworks',   gradient: 'from-rose-400 to-pink-500' },
  { id: 'iOS (Objective-C)', emoji: '📌', label: 'iOS (Objective-C)', tagline: 'Legacy & hybrid iOS development',     gradient: 'from-red-400 to-rose-500' },
  { id: 'DevOps / SRE',      emoji: '🚀', label: 'DevOps / SRE',      tagline: 'CI/CD, Kubernetes, infra & more',     gradient: 'from-slate-500 to-gray-600' },
  { id: 'Cloud Engineer',    emoji: '☁️', label: 'Cloud Engineer',    tagline: 'AWS, GCP, Azure & cloud-native',      gradient: 'from-sky-400 to-indigo-500' },
  { id: 'Data Engineer',     emoji: '📊', label: 'Data Engineer',     tagline: 'Pipelines, Spark, dbt & warehouses',  gradient: 'from-violet-400 to-purple-600' },
  { id: 'ML / AI Engineer',  emoji: '🧠', label: 'ML / AI Engineer',  tagline: 'PyTorch, TensorFlow & LLMs',          gradient: 'from-purple-400 to-indigo-600' },
  { id: 'Blockchain / Web3', emoji: '⛓️', label: 'Blockchain / Web3', tagline: 'Solidity, Ethereum & DeFi',           gradient: 'from-amber-400 to-orange-500' },
  { id: 'Game Developer',    emoji: '🎮', label: 'Game Developer',    tagline: 'Unity, Unreal, C# & C++',            gradient: 'from-indigo-400 to-purple-600' },
  { id: 'Embedded / IoT',   emoji: '🔌', label: 'Embedded / IoT',   tagline: 'C/C++, RTOS, Arduino & ESP32',        gradient: 'from-teal-400 to-cyan-600' },
];
