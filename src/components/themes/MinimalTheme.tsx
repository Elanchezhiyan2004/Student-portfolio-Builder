import { Mail, Phone, MapPin, Globe, Github, Linkedin } from 'lucide-react';
import { Database } from '../../lib/database.types';

type Portfolio = Database['public']['Tables']['portfolios']['Row'] & {
  profiles: { full_name: string; email: string };
};
type Education = Database['public']['Tables']['education']['Row'];
type Experience = Database['public']['Tables']['experience']['Row'];
type Project = Database['public']['Tables']['projects']['Row'];
type Skill = Database['public']['Tables']['skills']['Row'];

interface ThemeProps {
  portfolio: Portfolio;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: Skill[];
}

export function MinimalTheme({ portfolio, education, experience, projects, skills }: ThemeProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-16 pb-8 border-b-2 border-gray-900">
          <h1 className="text-6xl font-bold text-gray-900 mb-2">{portfolio.profiles.full_name}</h1>
          {portfolio.tagline && (
            <p className="text-xl text-gray-600 mb-6">{portfolio.tagline}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-6">
            {portfolio.profiles.email && (
              <a href={`mailto:${portfolio.profiles.email}`} className="flex items-center space-x-1 hover:text-gray-900">
                <Mail className="h-4 w-4" />
                <span>{portfolio.profiles.email}</span>
              </a>
            )}
            {portfolio.phone && (
              <a href={`tel:${portfolio.phone}`} className="flex items-center space-x-1 hover:text-gray-900">
                <Phone className="h-4 w-4" />
                <span>{portfolio.phone}</span>
              </a>
            )}
            {portfolio.location && (
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{portfolio.location}</span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {portfolio.website && (
              <a href={portfolio.website} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
                <Globe className="h-5 w-5" />
              </a>
            )}
            {portfolio.github && (
              <a href={portfolio.github} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
                <Github className="h-5 w-5" />
              </a>
            )}
            {portfolio.linkedin && (
              <a href={portfolio.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
                <Linkedin className="h-5 w-5" />
              </a>
            )}
          </div>
        </header>

        {portfolio.bio && (
          <section className="mb-12">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed">{portfolio.bio}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="mb-12">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Experience</h2>
            <div className="space-y-8">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                      <p className="text-gray-700">{exp.company}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {exp.start_date} {exp.end_date && `- ${exp.end_date}`}
                    </div>
                  </div>
                  {exp.location && <p className="text-sm text-gray-600 mb-2">{exp.location}</p>}
                  {exp.description && <p className="text-gray-700 leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section className="mb-12">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Projects</h2>
            <div className="space-y-8">
              {projects.map((project) => (
                <div key={project.id}>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{project.title}</h3>
                  {project.description && (
                    <p className="text-gray-700 leading-relaxed mb-3">{project.description}</p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Technologies:</span> {project.technologies.join(', ')}
                    </p>
                  )}
                  <div className="flex gap-4 text-sm">
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-gray-900 underline hover:no-underline">
                        View Project
                      </a>
                    )}
                    {project.github_link && (
                      <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="text-gray-900 underline hover:no-underline">
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section className="mb-12">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Education</h2>
            <div className="space-y-6">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{edu.degree} in {edu.field}</h3>
                      <p className="text-gray-700">{edu.institution}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {edu.start_date} {edu.end_date && `- ${edu.end_date}`}
                    </div>
                  </div>
                  {edu.description && <p className="text-gray-700 leading-relaxed">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section className="mb-12">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Skills</h2>
            <div className="space-y-4">
              {Object.entries(
                skills.reduce((acc, skill) => {
                  if (!acc[skill.category]) acc[skill.category] = [];
                  acc[skill.category].push(skill);
                  return acc;
                }, {} as Record<string, Skill[]>)
              ).map(([category, categorySkills]) => (
                <div key={category}>
                  <h3 className="font-bold text-gray-900 mb-2">{category}</h3>
                  <p className="text-gray-700">{categorySkills.map(s => s.name).join(' • ')}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
