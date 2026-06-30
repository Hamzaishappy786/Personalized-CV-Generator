import type { SkillDef } from '../../types/onboarding';
import type { DeveloperTrack } from '../../types/resume';
import { WEB_FRONTEND_SKILLS, WEB_BACKEND_SKILLS, FULLSTACK_SKILLS } from './web';
import { REACT_NATIVE_SKILLS, FLUTTER_SKILLS, ANDROID_KOTLIN_SKILLS, ANDROID_JAVA_SKILLS, IOS_SWIFT_SKILLS, IOS_OBJC_SKILLS } from './mobile';
import { DEVOPS_SKILLS, CLOUD_SKILLS, DATA_ENGINEERING_SKILLS, ML_AI_SKILLS } from './engineering';
import { BLOCKCHAIN_SKILLS, GAME_DEV_SKILLS, EMBEDDED_SKILLS } from './other';

export const TRACK_SKILLS: Record<DeveloperTrack, SkillDef[]> = {
  'Web Frontend':       WEB_FRONTEND_SKILLS,
  'Web Backend':        WEB_BACKEND_SKILLS,
  'Fullstack':          FULLSTACK_SKILLS,
  'React Native':       REACT_NATIVE_SKILLS,
  'Flutter':            FLUTTER_SKILLS,
  'Android (Kotlin)':   ANDROID_KOTLIN_SKILLS,
  'Android (Java)':     ANDROID_JAVA_SKILLS,
  'iOS (Swift)':        IOS_SWIFT_SKILLS,
  'iOS (Objective-C)':  IOS_OBJC_SKILLS,
  'DevOps / SRE':       DEVOPS_SKILLS,
  'Cloud Engineer':     CLOUD_SKILLS,
  'Data Engineer':      DATA_ENGINEERING_SKILLS,
  'ML / AI Engineer':   ML_AI_SKILLS,
  'Blockchain / Web3':  BLOCKCHAIN_SKILLS,
  'Game Developer':     GAME_DEV_SKILLS,
  'Embedded / IoT':     EMBEDDED_SKILLS,
};

export type { SkillDef };
