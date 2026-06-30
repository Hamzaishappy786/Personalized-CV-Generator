import { useResumeStore } from '../../store/resumeStore';
import { FormField, Input, TextArea } from './FormField';

export function PersonalInfoForm() {
  const info = useResumeStore((s) => s.personalInfo);
  const track = useResumeStore((s) => s.track);
  const set = useResumeStore((s) => s.setPersonalInfo);

  const field = (key: keyof typeof info) => ({
    value: info[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      set({ [key]: e.target.value }),
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Full name" required>
          <Input placeholder="Muhammad Hamza" {...field('fullName')} />
        </FormField>
        <FormField label="Job title" hint="Auto-filled from your selected track">
          <Input readOnly value={track} className="bg-gray-50 cursor-default text-gray-500" onChange={() => {}} />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Email" required>
          <Input type="email" placeholder="you@example.com" {...field('email')} />
        </FormField>
        <FormField label="Phone">
          <Input type="tel" placeholder="+92 300 1234567" {...field('phone')} />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Location" hint="City, Country">
          <Input placeholder="Lahore, Pakistan" {...field('location')} />
        </FormField>
        <FormField label="Website / Portfolio">
          <Input type="url" placeholder="https://yourportfolio.dev" {...field('website')} />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="LinkedIn URL">
          <Input type="url" placeholder="https://linkedin.com/in/you" {...field('linkedin')} />
        </FormField>
        <FormField label="GitHub URL">
          <Input type="url" placeholder="https://github.com/you" {...field('github')} />
        </FormField>
      </div>

      <FormField label="Professional summary" hint="2-4 sentences. Keep it punchy.">
        <TextArea
          rows={4}
          placeholder="Fullstack engineer with 5 years shipping production apps…"
          {...field('summary')}
        />
      </FormField>
    </div>
  );
}
