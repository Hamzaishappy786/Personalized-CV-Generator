import styled from 'styled-components';
import { Section, SectionTitle, DateRange, safeUrl } from '../../../utils/jsonresume-compat';
import type { TemplateProps } from '../../../types/jsonresume';

const BLUE = '#2563eb';

const Layout = styled.div`
  max-width: 900px; margin: 0 auto; padding: 40px 32px; background: white;
  font-family: 'Inter', -apple-system, sans-serif; color: #1f2937; font-size: 15px;
  @media print { padding: 24px; }
`;
const Header = styled.header`margin-bottom: 36px; border-bottom: 2px solid #e5e7eb; padding-bottom: 28px;`;
const Name = styled.h1`font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 32px; font-weight: 700; margin: 0 0 6px; color: #111827; letter-spacing: -0.5px;`;
const MonoLabel = styled.div`font-family: 'JetBrains Mono', monospace; font-size: 14px; color: ${BLUE}; font-weight: 600; margin-bottom: 14px;`;
const ContactWrap = styled.div`display: flex; flex-wrap: wrap; gap: 12px; font-size: 13px; color: #6b7280; a { color: ${BLUE}; text-decoration: none; }`;
const STitle = styled(SectionTitle)`
  font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700;
  color: #6b7280; margin: 36px 0 16px; text-transform: uppercase; letter-spacing: 1.2px;
`;
const WorkItem = styled.div`
  margin-bottom: 28px; padding-bottom: 28px; border-bottom: 1px solid #f3f4f6;
  &:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
`;
const WorkHeader = styled.div`display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 6px; margin-bottom: 4px;`;
const WorkTitle = styled.h3`font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 600; margin: 0; color: #111827;`;
const WorkMeta = styled.div`font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #6b7280;`;
const WorkCompany = styled.div`font-size: 14px; color: ${BLUE}; font-weight: 600; margin-bottom: 6px;`;
const ArrowList = styled.ul`margin: 10px 0 0; padding-left: 20px; list-style: none;
  li { margin-bottom: 7px; font-size: 14px; line-height: 1.6; color: #374151; padding-left: 14px; position: relative;
    &::before { content: '→'; position: absolute; left: 0; color: ${BLUE}; font-weight: 600; }
  }
`;
const SkillsGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px;`;
const SkillItem = styled.div`margin-bottom: 14px;`;
const SkillName = styled.h4`font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; margin: 0 0 8px; color: ${BLUE}; text-transform: uppercase; letter-spacing: 0.5px;`;
const CodeBlock = styled.div`font-family: 'JetBrains Mono', monospace; font-size: 12px; background: #f9fafb; padding: 10px; border-radius: 4px; border-left: 3px solid ${BLUE}; line-height: 1.6; color: #4b5563;`;
const EduItem = styled.div`margin-bottom: 20px;`;
const SummaryText = styled.p`font-size: 14px; line-height: 1.7; color: #374151; margin: 16px 0 0;`;

export function DeveloperMonoTemplate({ resume }: TemplateProps) {
  const { basics = {}, work = [], education = [], skills = [], projects = [] } = resume;

  return (
    <Layout id="resume-print-area">
      <Header>
        {basics.name && <Name>{basics.name}</Name>}
        {basics.label && <MonoLabel>{basics.label}</MonoLabel>}
        <ContactWrap>
          {basics.email && <a href={`mailto:${basics.email}`}>{basics.email}</a>}
          {basics.phone && <span>{basics.phone}</span>}
          {basics.location?.city && <span>{basics.location.city}</span>}
          {basics.url && <a href={safeUrl(basics.url)}>{basics.url.replace(/^https?:\/\//, '')}</a>}
          {basics.profiles?.map((p, i) => <a key={i} href={safeUrl(p.url ?? '')}>{p.network}</a>)}
        </ContactWrap>
        {basics.summary && <SummaryText>{basics.summary}</SummaryText>}
      </Header>

      {work.length > 0 && (
        <Section>
          <STitle>Experience</STitle>
          {work.map((job, i) => (
            <WorkItem key={i} data-print-block="">
              <WorkHeader>
                <WorkTitle>{job.position || job.name}</WorkTitle>
                <WorkMeta><DateRange startDate={job.startDate} endDate={job.endDate || undefined} /></WorkMeta>
              </WorkHeader>
              {job.name && <WorkCompany>{job.name}</WorkCompany>}
              {(job.highlights?.length ?? 0) > 0 && <ArrowList>{job.highlights!.map((h, j) => <li key={j}>{h}</li>)}</ArrowList>}
            </WorkItem>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section>
          <STitle>Skills</STitle>
          <SkillsGrid>
            {skills.map((sk, i) => (
              <SkillItem key={i}>
                <SkillName>{sk.name}</SkillName>
                <CodeBlock>{sk.keywords?.join(', ')}</CodeBlock>
              </SkillItem>
            ))}
          </SkillsGrid>
        </Section>
      )}

      {projects.length > 0 && (
        <Section>
          <STitle>Projects</STitle>
          {projects.map((proj, i) => (
            <WorkItem key={i} data-print-block="">
              <WorkHeader>
                <WorkTitle>{proj.name}</WorkTitle>
                {(proj.startDate || proj.endDate) && (
                  <WorkMeta><DateRange startDate={proj.startDate} endDate={proj.endDate} /></WorkMeta>
                )}
              </WorkHeader>
              {proj.url && <WorkCompany><a href={safeUrl(proj.url)} style={{ color: BLUE }}>{proj.url}</a></WorkCompany>}
              {proj.description && <SummaryText>{proj.description}</SummaryText>}
              {(proj.highlights?.length ?? 0) > 0 && <ArrowList>{proj.highlights!.map((h, j) => <li key={j}>{h}</li>)}</ArrowList>}
            </WorkItem>
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section>
          <STitle>Education</STitle>
          {education.map((edu, i) => (
            <EduItem key={i}>
              <WorkHeader>
                <WorkTitle>{edu.institution}</WorkTitle>
                <WorkMeta><DateRange startDate={edu.startDate} endDate={edu.endDate} /></WorkMeta>
              </WorkHeader>
              <WorkCompany>{edu.studyType} in {edu.area}{edu.score ? ` · GPA: ${edu.score}` : ''}</WorkCompany>
            </EduItem>
          ))}
        </Section>
      )}
    </Layout>
  );
}
