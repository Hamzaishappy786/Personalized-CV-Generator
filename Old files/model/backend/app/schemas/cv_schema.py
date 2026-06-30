from pydantic import BaseModel, Field
from typing import List, Optional


class ContactInfo(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    linkedin: Optional[str] = None
    portfolio: Optional[str] = None


class EducationItem(BaseModel):
    degree: str
    institution: Optional[str] = None
    year: Optional[str] = None


class ExperienceItem(BaseModel):
    title: str
    company: str
    duration: Optional[str] = None
    location: Optional[str] = None
    bullets: List[str] = Field(default_factory=list)
    skills_used: List[str] = Field(default_factory=list)


class ProjectItem(BaseModel):
    name: str
    description: Optional[str] = None
    tech: List[str] = Field(default_factory=list)
    link: Optional[str] = None


class CVData(BaseModel):
    name: Optional[str] = None
    headline: Optional[str] = None
    summary: Optional[str] = None
    contact: Optional[ContactInfo] = None
    education: List[EducationItem] = Field(default_factory=list)
    experience: List[ExperienceItem] = Field(default_factory=list)
    projects: List[ProjectItem] = Field(default_factory=list)
    skills: List[str] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    awards: List[str] = Field(default_factory=list)
    languages: List[str] = Field(default_factory=list)

