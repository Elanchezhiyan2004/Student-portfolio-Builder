import { Mail, Phone, MapPin, Globe, Github, Linkedin, Award } from 'lucide-react';
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

export function ProfessionalTheme({ portfolio, education, experience, projects, skills }: ThemeProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid lg:grid-cols-3 min-h-screen">
        <aside className="lg:col-span-1 bg-gradient-to-b from-green-700 to-green-900 text-white p-8 lg:p-12">
          <div className="sticky top-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <h1 className="text-3xl font-bold mb-2">{portfolio.profiles.full_name}</h1>
              {portfolio.tagline && (
                <p className="text-green-100 text-lg mb-6">{portfolio.tagline}</p>
              )}

              <div className="space-y-3 text-sm">
                {portfolio.profiles.email && (
                  <a href={`mailto:${portfolio.profiles.email}`} className="flex items-center space-x-2 hover:text-green-200 transition-colors">
                    <Mail className="h-4 w-4" />
                    <span>{portfolio.profiles.email}</span>
                  </a>
                )}
                {portfolio.phone && (
                  <a href={`tel:${portfolio.phone}`} className="flex items-center space-x-2 hover:text-green-200 transition-colors">
                    <Phone className="h-4 w-4" />
                    <span>{portfolio.phone}</span>
                  </a>
                )}
                {portfolio.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{portfolio.location}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                {portfolio.website && (
                  <a href={portfolio.website} target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors">
                    <Globe className="h-5 w-5" />
                  </a>
                )}
                {portfolio.github && (
                  <a href={portfolio.github} target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors">
                    <Github className="h-5 w-5" />
                  </a>
                )}
                {portfolio.linkedin && (
                  <a href={portfolio.linkedin} target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>

            {portfolio.bio && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
                <h2 className="text-lg font-bold mb-3 flex items-center space-x-2">
                  <span>About Me</span>
                </h2>
                <p className="text-green-50 leading-relaxed text-sm">{portfolio.bio}</p>
              </div>
            )}

            {skills.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Skills</span>
                </h2>
                <div className="space-y-4">
                  {Object.entries(
                    skills.reduce((acc, skill) => {
                      if (!acc[skill.category]) acc[skill.category] = [];
                      acc[skill.category].push(skill);
                      return acc;
                    }, {} as Record<string, Skill[]>)
                  ).map(([category, categorySkills]) => (
                    <div key={category}>
                      <h3 className="text-sm font-semibold text-green-100 mb-2">{category}</h3>
                      <div className="flex flex-wrap gap-2">
                        {categorySkills.map((skill) => (
                          <span key={skill.id} className="bg-white/20 px-2 py-1 rounded text-xs">
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        <main className="lg:col-span-2 p-8 lg:p-12">
          {experience.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-green-600">
                Professional Experience
              </h2>
              <div className="space-y-8">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative pl-8 before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-green-600 before:rounded-full">
                    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                          <p className="text-green-700 font-semibold">{exp.company}</p>
                        </div>
                        <span className="text-sm text-gray-500 mt-1 md:mt-0">
                          {exp.start_date} {exp.end_date && `- ${exp.end_date}`}
                        </span>
                      </div>
                      {exp.location && <p className="text-gray-600 text-sm mb-3">{exp.location}</p>}
                      {exp.description && <p className="text-gray-700 leading-relaxed">{exp.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-green-600">
                Projects
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{project.title}</h3>
                    {project.description && (
                      <p className="text-gray-700 mb-4 leading-relaxed text-sm">{project.description}</p>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech, idx) => (
                          <span key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-3 text-sm">
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-green-700 hover:text-green-800 font-medium">
                          View →
                        </a>
                      )}
                      {project.github_link && (
                        <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-700 font-medium">
                          GitHub →
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-green-600">
                Education
              </h2>
              <div className="space-y-6">
                {education.map((edu) => (
                  <div key={edu.id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{edu.degree} in {edu.field}</h3>
                        <p className="text-green-700 font-semibold">{edu.institution}</p>
                      </div>
                      <span className="text-sm text-gray-500 mt-1 md:mt-0">
                        {edu.start_date} {edu.end_date && `- ${edu.end_date}`}
                      </span>
                    </div>
                    {edu.description && <p className="text-gray-700 leading-relaxed mt-3">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
