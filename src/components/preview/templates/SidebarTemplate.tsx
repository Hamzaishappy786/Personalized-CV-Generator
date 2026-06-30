import styled from 'styled-components';
import { safeUrl } from '../../../utils/jsonresume-compat';
import type { TemplateProps } from '../../../types/jsonresume';

const NAVY = '#1e3a52';

const Grid = styled.div`display: grid; grid-template-columns: 300px 1fr; min-height: 297mm; font-family: 'Segoe UI', sans-serif; font-size: 11pt; line-height: 1.6; @media print { min-height: auto; }`;
const Sidebar = styled.aside`background: ${NAVY}; color: #fff; padding: 40px 28px;`;
const Main = styled.main`background: #f5f2ed; padding: 50px 44px;`;
const SideTitle = styled.h2`font-size: 13pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 16px; padding-bottom: 8px; border-bottom: 2px solid rgba(255,255,255,0.25);`;
const SideSection = styled.div`margin-bottom: 32px;`;
const ContactItem = styled.div`margin-bottom: 12px; font-size: 10pt; a { color: #fff; text-decoration: none; word-break: break-word; } a:hover { text-decoration: underline; }`;
const SkillList = styled.ul`list-style: none; padding: 0; margin: 0; li { margin: 7px 0; padding-left: 14px; position: relative; font-size: 10pt; &::before { content: '▪'; position: absolute; left: 0; color: rgba(255,255,255,0.6); } }`;
const EduSide = styled.div`margin-bottom: 20px; h3 { font-size: 11pt; font-weight: 600; margin: 0 0 4px; } .dates { font-size: 10pt; opacity: 0.8; margin-bottom: 6px; }`;
const LangList = styled.ul`list-style: none; padding: 0; margin: 0; li { margin: 7px 0; font-size: 10pt; padding-left: 14px; position: relative; &::before { content: '▪'; position: absolute; left: 0; color: rgba(255,255,255,0.6); } }`;

// Main content
const NameBlock = styled.div`margin-bottom: 36px;`;
const Name = styled.h1`font-size: 30pt; font-weight: 700; margin: 0 0 6px; color: #2c2c2c;`;
const JobTitle = styled.div`font-size: 13pt; color: #666; text-transform: uppercase; letter-spacing: 2px; padding-bottom: 12px; border-bottom: 3px solid ${NAVY}; display: inline-block;`;
const MainSection = styled.div`margin-bottom: 36px;`;
const MainTitle = styled.h2`font-size: 14pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 20px; padding-bottom: 8px; border-bottom: 2px solid ${NAVY}; color: ${NAVY};`;
const ProfileText = styled.p`text-align: justify; line-height: 1.8; color: #4a4a4a;`;
const WorkItem = styled.div`margin-bottom: 26px; position: relative; padding-left: 22px;
  &::before { content: ''; position: absolute; left: 4px; top: 7px; width: 9px; height: 9px; background: ${NAVY}; border-radius: 50%; }
  &::after { content: ''; position: absolute; left: 8px; top: 18px; width: 2px; height: calc(100% - 10px); background: #d0d0d0; }
  &:last-child::after { display: none; }
`;
const WorkHeader = styled.div`display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px;`;
const WorkTitle = styled.h3`font-size: 12pt; font-weight: 700; margin: 0; color: #2c2c2c;`;
const WorkCompany = styled.div`font-size: 11pt; color: #666; margin-bottom: 8px;`;
const WorkDate = styled.div`font-size: 10pt; color: #666; white-space: nowrap; text-align: right;`;
const WorkDesc = styled.ul`margin: 8px 0 0; padding-left: 18px; color: #4a4a4a; li { margin: 5px 0; font-size: 10.5pt; }`;

function fmt(d?: string) {
  if (!d) return '';
  try { return new Date(d).getFullYear().toString(); } catch { return d; }
}

export function SidebarTemplate({ resume }: TemplateProps) {
  const { basics = {}, work = [], education = [], skills = [], projects = [], languages = [], awards = [] } = resume;

  return (
    <Grid id="resume-print-area">
      <Sidebar>
        {(basics.phone || basics.email || basics.url) && (
          <SideSection>
            <SideTitle>Contact</SideTitle>
            {basics.phone && <ContactItem>📞 {basics.phone}</ContactItem>}
            {basics.email && <ContactItem>✉ <a href={`mailto:${basics.email}`}>{basics.email}</a></ContactItem>}
            {basics.location?.city && <ContactItem>📍 {basics.location.city}</ContactItem>}
            {basics.url && <ContactItem>🌐 <a href={safeUrl(basics.url)}>{basics.url.replace(/^https?:\/\//, '')}</a></ContactItem>}
            {basics.profiles?.map((p, i) => (
              <ContactItem key={i}><a href={safeUrl(p.url ?? '')}>{p.network}: {p.username}</a></ContactItem>
            ))}
          </SideSection>
        )}

        {education.length > 0 && (
          <SideSection>
            <SideTitle>Education</SideTitle>
            {education.map((edu, i) => (
              <EduSide key={i}>
                <div className="dates">{fmt(edu.startDate)}{edu.endDate ? ` – ${fmt(edu.endDate)}` : ''}</div>
                <h3>{edu.institution}</h3>
                {edu.studyType && edu.area && <div style={{ fontSize: '10pt', opacity: 0.85 }}>{edu.studyType} of {edu.area}</div>}
              </EduSide>
            ))}
          </SideSection>
        )}

        {skills.length > 0 && (
          <SideSection>
            <SideTitle>Skills</SideTitle>
            <SkillList>
              {skills.flatMap((g) => (g.keywords ?? []).map((sk, j) => <li key={`${g.name}-${j}`}>{sk}</li>))}
            </SkillList>
          </SideSection>
        )}

        {languages.length > 0 && (
          <SideSection>
            <SideTitle>Languages</SideTitle>
            <LangList>
              {languages.map((l, i) => <li key={i}>{l.language}{l.fluency ? ` (${l.fluency})` : ''}</li>)}
            </LangList>
          </SideSection>
        )}
      </Sidebar>

      <Main>
        <NameBlock>
          <Name>{basics.name}</Name>
          {basics.label && <JobTitle>{basics.label}</JobTitle>}
        </NameBlock>

        {basics.summary && (
          <MainSection>
            <MainTitle>Profile</MainTitle>
            <ProfileText>{basics.summary}</ProfileText>
          </MainSection>
        )}

        {work.length > 0 && (
          <MainSection>
            <MainTitle>Work Experience</MainTitle>
            {work.map((job, i) => (
              <WorkItem key={i} data-print-block="">
                <WorkHeader>
                  <div><WorkTitle>{job.name}</WorkTitle><WorkCompany>{job.position}</WorkCompany></div>
                  <WorkDate>{fmt(job.startDate)}{job.startDate ? ` – ${job.endDate ? fmt(job.endDate) : 'Present'}` : ''}</WorkDate>
                </WorkHeader>
                {(job.highlights?.length ?? 0) > 0 && <WorkDesc>{job.highlights!.map((h, j) => <li key={j}>{h}</li>)}</WorkDesc>}
              </WorkItem>
            ))}
          </MainSection>
        )}

        {projects.length > 0 && (
          <MainSection>
            <MainTitle>Projects</MainTitle>
            {projects.map((proj, i) => (
              <WorkItem key={i} data-print-block="">
                <WorkHeader>
                  <div>
                    <WorkTitle>{proj.name}</WorkTitle>
                    {proj.url && <WorkCompany><a href={safeUrl(proj.url)} style={{ color: NAVY }}>{proj.url}</a></WorkCompany>}
                  </div>
                  {proj.startDate && <WorkDate>{fmt(proj.startDate)}</WorkDate>}
                </WorkHeader>
                {proj.description && <ProfileText style={{ marginTop: 6 }}>{proj.description}</ProfileText>}
                {(proj.highlights?.length ?? 0) > 0 && <WorkDesc>{proj.highlights!.map((h, j) => <li key={j}>{h}</li>)}</WorkDesc>}
              </WorkItem>
            ))}
          </MainSection>
        )}

        {awards.length > 0 && (
          <MainSection>
            <MainTitle>Awards & Honors</MainTitle>
            {awards.map((a, i) => (
              <WorkItem key={i} data-print-block="">
                <WorkTitle>{a.title}</WorkTitle>
                <WorkCompany>{a.awarder}{a.date ? `, ${fmt(a.date)}` : ''}</WorkCompany>
                {a.summary && <ProfileText style={{ marginTop: 6 }}>{a.summary}</ProfileText>}
              </WorkItem>
            ))}
          </MainSection>
        )}
      </Main>
    </Grid>
  );
}
