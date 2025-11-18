import { Mail, Phone, MapPin, Globe, Github, Linkedin, Briefcase, GraduationCap, FolderGit2, Award } from 'lucide-react';
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

export function ModernTheme({ portfolio, education, experience, projects, skills }: ThemeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">{portfolio.profiles.full_name}</h1>
            {portfolio.tagline && (
              <p className="text-2xl text-blue-100 mb-6">{portfolio.tagline}</p>
            )}
            {portfolio.bio && (
              <p className="text-lg text-blue-50 max-w-3xl mx-auto mb-8">{portfolio.bio}</p>
            )}
            <div className="flex flex-wrap justify-center gap-4">
              {portfolio.profiles.email && (
                <a href={`mailto:${portfolio.profiles.email}`} className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                  <Mail className="h-4 w-4" />
                  <span>{portfolio.profiles.email}</span>
                </a>
              )}
              {portfolio.phone && (
                <a href={`tel:${portfolio.phone}`} className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                  <Phone className="h-4 w-4" />
                  <span>{portfolio.phone}</span>
                </a>
              )}
              {portfolio.location && (
                <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
                  <MapPin className="h-4 w-4" />
                  <span>{portfolio.location}</span>
                </div>
              )}
            </div>
            <div className="flex justify-center gap-4 mt-6">
              {portfolio.website && (
                <a href={portfolio.website} target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors">
                  <Globe className="h-5 w-5" />
                </a>
              )}
              {portfolio.github && (
                <a href={portfolio.github} target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors">
                  <Github className="h-5 w-5" />
                </a>
              )}
              {portfolio.linkedin && (
                <a href={portfolio.linkedin} target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {skills.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center space-x-3 mb-8">
              <Award className="h-8 w-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">Skills</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(
                skills.reduce((acc, skill) => {
                  if (!acc[skill.category]) acc[skill.category] = [];
                  acc[skill.category].push(skill);
                  return acc;
                }, {} as Record<string, Skill[]>)
              ).map(([category, categorySkills]) => (
                <div key={category} className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="font-bold text-gray-900 mb-3">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill) => (
                      <span key={skill.id} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {experience.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center space-x-3 mb-8">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">Experience</h2>
            </div>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                      <p className="text-lg text-blue-600 font-medium">{exp.company}</p>
                    </div>
                    <div className="text-gray-500 text-sm mt-2 md:mt-0">
                      {exp.start_date} {exp.end_date && `- ${exp.end_date}`}
                    </div>
                  </div>
                  {exp.location && <p className="text-gray-600 mb-3">{exp.location}</p>}
                  {exp.description && <p className="text-gray-700 leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center space-x-3 mb-8">
              <FolderGit2 className="h-8 w-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">Projects</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h3>
                  {project.description && (
                    <p className="text-gray-700 mb-4 leading-relaxed">{project.description}</p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-3">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        View Project →
                      </a>
                    )}
                    {project.github_link && (
                      <a
                        href={project.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-700 font-medium text-sm"
                      >
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
          <section className="mb-16">
            <div className="flex items-center space-x-3 mb-8">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">Education</h2>
            </div>
            <div className="space-y-6">
              {education.map((edu) => (
                <div key={edu.id} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{edu.degree} in {edu.field}</h3>
                      <p className="text-lg text-blue-600 font-medium">{edu.institution}</p>
                    </div>
                    <div className="text-gray-500 text-sm mt-2 md:mt-0">
                      {edu.start_date} {edu.end_date && `- ${edu.end_date}`}
                    </div>
                  </div>
                  {edu.description && <p className="text-gray-700 leading-relaxed mt-3">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
