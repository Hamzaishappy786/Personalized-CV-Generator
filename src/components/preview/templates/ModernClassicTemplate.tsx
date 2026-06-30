import styled from 'styled-components';
import { Section, SectionTitle, DateRange } from '../../../utils/jsonresume-compat';
import type { TemplateProps } from '../../../types/jsonresume';

const Layout = styled.div`
  max-width: 850px; margin: 0 auto; padding: 60px 40px;
  background: white; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #1f2937; @media print { padding: 40px; }
`;
const Header = styled.header`
  margin-bottom: 40px; padding-bottom: 24px; border-bottom: 2px solid #e5e7eb;
`;
const Name = styled.h1`
  font-size: 36px; font-weight: 700; color: #111827; margin: 0 0 4px; letter-spacing: -0.5px;
`;
const Label = styled.div`font-size: 15px; color: #6b7280; margin-bottom: 14px; font-weight: 500;`;
const ContactRow = styled.div`display: flex; flex-wrap: wrap; gap: 10px 20px; font-size: 13px; color: #4b5563;
  a { color: #0066cc; text-decoration: none; }`;
const Summary = styled.p`font-size: 14px; line-height: 1.7; color: #4b5563; margin: 16px 0 0;`;
const STitle = styled(SectionTitle)`
  font-size: 17px; font-weight: 700; color: #111827; margin: 36px 0 16px;
  padding-bottom: 6px; border-bottom: 2px solid #0066cc;
`;
const WorkItem = styled.div`margin-bottom: 24px; &:last-child { margin-bottom: 0; }`;
const WorkHeader = styled.div`
  display: flex; justify-content: space-between; align-items: baseline; gap: 12px; margin-bottom: 4px;
  @media (max-width: 600px) { flex-direction: column; gap: 2px; }
`;
const Position = styled.h3`font-size: 15px; font-weight: 600; color: #111827; margin: 0;`;
const Company = styled.div`font-size: 14px; color: #0066cc; font-weight: 500; margin-top: 2px;`;
const DateText = styled.div`font-size: 13px; color: #6b7280; white-space: nowrap;`;
const Bullets = styled.ul`margin: 8px 0 0; padding-left: 18px; li { margin: 5px 0; color: #4b5563; font-size: 14px; line-height: 1.6; }`;
const EduItem = styled.div`margin-bottom: 18px; &:last-child { margin-bottom: 0; }`;
const Institution = styled.h3`font-size: 15px; font-weight: 600; color: #111827; margin: 0 0 3px;`;
const Degree = styled.div`font-size: 14px; color: #4b5563; margin-bottom: 2px;`;
const SkillsGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 14px;`;
const SkillBox = styled.div`padding: 12px; background: #f3f4f6; border-radius: 6px; border-left: 3px solid #0066cc;`;
const SkillName = styled.h4`font-size: 13px; font-weight: 600; color: #111827; margin: 0 0 5px;`;
const SkillList = styled.div`font-size: 13px; color: #6b7280; line-height: 1.5;`;

export function ModernClassicTemplate({ resume }: TemplateProps) {
  const { basics = {}, work = [], education = [], skills = [], projects = [] } = resume;

  return (
    <Layout id="resume-print-area">
      <Header>
        <Name>{basics.name}</Name>
        {basics.label && <Label>{basics.label}</Label>}
        <ContactRow>
          {basics.phone && <span>{basics.phone}</span>}
          {basics.email && <a href={`mailto:${basics.email}`}>{basics.email}</a>}
          {basics.location?.city && <span>{basics.location.city}</span>}
          {basics.url && <a href={basics.url}>{basics.url.replace(/^https?:\/\//, '')}</a>}
          {basics.profiles?.map((p, i) => (
            <a key={i} href={p.url}>{p.network}: {p.username}</a>
          ))}
        </ContactRow>
        {basics.summary && <Summary>{basics.summary}</Summary>}
      </Header>

      {education.length > 0 && (
        <Section>
          <STitle>Education</STitle>
          {education.map((edu, i) => (
            <EduItem key={i}>
              <WorkHeader>
                <Institution>{edu.institution}</Institution>
                <DateText><DateRange startDate={edu.startDate} endDate={edu.endDate} /></DateText>
              </WorkHeader>
              <Degree>{edu.studyType} in {edu.area}{edu.score ? ` • GPA: ${edu.score}` : ''}</Degree>
            </EduItem>
          ))}
        </Section>
      )}

      {work.length > 0 && (
        <Section>
          <STitle>Experience</STitle>
          {work.map((job, i) => (
            <WorkItem key={i} data-print-block="">
              <WorkHeader>
                <div><Position>{job.position}</Position><Company>{job.name}</Company></div>
                <DateText><DateRange startDate={job.startDate} endDate={job.endDate || undefined} /></DateText>
              </WorkHeader>
              {(job.highlights?.length ?? 0) > 0 && <Bullets>{job.highlights!.map((h, j) => <li key={j}>{h}</li>)}</Bullets>}
            </WorkItem>
          ))}
        </Section>
      )}

      {projects.length > 0 && (
        <Section>
          <STitle>Projects</STitle>
          {projects.map((proj, i) => (
            <WorkItem key={i} data-print-block="">
              <Position>{proj.name}{proj.url ? <span style={{ fontWeight: 400, fontSize: 13, color: '#0066cc', marginLeft: 8 }}>{proj.url}</span> : null}</Position>
              {proj.description && <Company style={{ color: '#4b5563', marginTop: 4 }}>{proj.description}</Company>}
              {(proj.highlights?.length ?? 0) > 0 && <Bullets>{proj.highlights!.map((h, j) => <li key={j}>{h}</li>)}</Bullets>}
            </WorkItem>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section>
          <STitle>Skills & Tools</STitle>
          <SkillsGrid>
            {skills.map((sk, i) => (
              <SkillBox key={i}>
                <SkillName>{sk.name}</SkillName>
                <SkillList>{sk.keywords?.join(', ')}</SkillList>
              </SkillBox>
            ))}
          </SkillsGrid>
        </Section>
      )}
    </Layout>
  );
}
