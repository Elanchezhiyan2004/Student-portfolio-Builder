import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Save, Plus, X } from 'lucide-react';
import { Database } from '../lib/database.types';

type Portfolio = Database['public']['Tables']['portfolios']['Row'];
type Education = Database['public']['Tables']['education']['Row'];
type Experience = Database['public']['Tables']['experience']['Row'];
type Project = Database['public']['Tables']['projects']['Row'];
type Skill = Database['public']['Tables']['skills']['Row'];

interface PortfolioFormProps {
  onNavigate: (path: string) => void;
  isEdit?: boolean;
}

export function PortfolioForm({ onNavigate, isEdit = false }: PortfolioFormProps) {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState({
    username: '',
    tagline: '',
    bio: '',
    phone: '',
    location: '',
    website: '',
    github: '',
    linkedin: '',
    theme: 'modern' as 'modern' | 'minimal' | 'professional',
    is_public: true,
  });

  const [education, setEducation] = useState<Partial<Education>[]>([]);
  const [experience, setExperience] = useState<Partial<Experience>[]>([]);
  const [projects, setProjects] = useState<Partial<Project>[]>([]);
  const [skills, setSkills] = useState<Partial<Skill>[]>([]);
  const [error, setError] = useState('');
  const [portfolioId, setPortfolioId] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit) {
      loadExistingPortfolio();
    }
  }, [isEdit, profile]);

  async function loadExistingPortfolio() {
    if (!profile) return;

    try {
      const { data: portfolio, error: portfolioError } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', profile.id)
        .maybeSingle();

      if (portfolioError) throw portfolioError;
      if (!portfolio) {
        onNavigate('/portfolio/create');
        return;
      }

      setPortfolioId(portfolio.id);
      setPortfolioData({
        username: portfolio.username,
        tagline: portfolio.tagline,
        bio: portfolio.bio,
        phone: portfolio.phone,
        location: portfolio.location,
        website: portfolio.website,
        github: portfolio.github,
        linkedin: portfolio.linkedin,
        theme: portfolio.theme,
        is_public: portfolio.is_public,
      });

      const [eduData, expData, projData, skillData] = await Promise.all([
        supabase.from('education').select('*').eq('portfolio_id', portfolio.id),
        supabase.from('experience').select('*').eq('portfolio_id', portfolio.id),
        supabase.from('projects').select('*').eq('portfolio_id', portfolio.id),
        supabase.from('skills').select('*').eq('portfolio_id', portfolio.id),
      ]);

      if (eduData.data) setEducation(eduData.data);
      if (expData.data) setExperience(expData.data);
      if (projData.data) setProjects(projData.data);
      if (skillData.data) setSkills(skillData.data);
    } catch (error) {
      console.error('Error loading portfolio:', error);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setError('');
    setLoading(true);

    try {
      let currentPortfolioId = portfolioId;

      if (isEdit && portfolioId) {
        const { error: updateError } = await supabase
          .from('portfolios')
          .update({ ...portfolioData, updated_at: new Date().toISOString() })
          .eq('id', portfolioId);

        if (updateError) throw updateError;

        await supabase.from('education').delete().eq('portfolio_id', portfolioId);
        await supabase.from('experience').delete().eq('portfolio_id', portfolioId);
        await supabase.from('projects').delete().eq('portfolio_id', portfolioId);
        await supabase.from('skills').delete().eq('portfolio_id', portfolioId);
      } else {
        const { data: newPortfolio, error: insertError } = await supabase
          .from('portfolios')
          .insert({ ...portfolioData, user_id: profile.id })
          .select()
          .single();

        if (insertError) throw insertError;
        currentPortfolioId = newPortfolio.id;
      }

      if (currentPortfolioId) {
        const insertPromises = [];

        if (education.length > 0) {
          insertPromises.push(
            supabase.from('education').insert(
              education.map((edu) => ({ ...edu, portfolio_id: currentPortfolioId }))
            )
          );
        }

        if (experience.length > 0) {
          insertPromises.push(
            supabase.from('experience').insert(
              experience.map((exp) => ({ ...exp, portfolio_id: currentPortfolioId }))
            )
          );
        }

        if (projects.length > 0) {
          insertPromises.push(
            supabase.from('projects').insert(
              projects.map((proj) => ({ ...proj, portfolio_id: currentPortfolioId }))
            )
          );
        }

        if (skills.length > 0) {
          insertPromises.push(
            supabase.from('skills').insert(
              skills.map((skill) => ({ ...skill, portfolio_id: currentPortfolioId }))
            )
          );
        }

        await Promise.all(insertPromises);
      }

      onNavigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to save portfolio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEdit ? 'Edit Portfolio' : 'Create Portfolio'}
          </h1>
          <p className="text-gray-600">Fill in your details to build your professional portfolio</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username (for URL) *
                </label>
                <input
                  type="text"
                  value={portfolioData.username}
                  onChange={(e) =>
                    setPortfolioData({ ...portfolioData, username: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })
                  }
                  required
                  disabled={isEdit}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="johndoe"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your portfolio will be at: /portfolio/{portfolioData.username || 'username'}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                <input
                  type="text"
                  value={portfolioData.tagline}
                  onChange={(e) => setPortfolioData({ ...portfolioData, tagline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Full Stack Developer | Problem Solver"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={portfolioData.bio}
                  onChange={(e) => setPortfolioData({ ...portfolioData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={portfolioData.phone}
                  onChange={(e) => setPortfolioData({ ...portfolioData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={portfolioData.location}
                  onChange={(e) => setPortfolioData({ ...portfolioData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="New York, USA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={portfolioData.website}
                  onChange={(e) => setPortfolioData({ ...portfolioData, website: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                <input
                  type="url"
                  value={portfolioData.github}
                  onChange={(e) => setPortfolioData({ ...portfolioData, github: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                <input
                  type="url"
                  value={portfolioData.linkedin}
                  onChange={(e) => setPortfolioData({ ...portfolioData, linkedin: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                <select
                  value={portfolioData.theme}
                  onChange={(e) => setPortfolioData({ ...portfolioData, theme: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="modern">Modern</option>
                  <option value="minimal">Minimal</option>
                  <option value="professional">Professional</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={portfolioData.is_public}
                    onChange={(e) => setPortfolioData({ ...portfolioData, is_public: e.target.checked })}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Make portfolio public</span>
                </label>
              </div>
            </div>
          </div>

          <EducationSection education={education} setEducation={setEducation} />
          <ExperienceSection experience={experience} setExperience={setExperience} />
          <ProjectsSection projects={projects} setProjects={setProjects} />
          <SkillsSection skills={skills} setSkills={setSkills} />

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => onNavigate('/dashboard')}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>{loading ? 'Saving...' : 'Save Portfolio'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EducationSection({ education, setEducation }: any) {
  const addEducation = () => {
    setEducation([...education, { institution: '', degree: '', field: '', start_date: '', end_date: '', description: '' }]);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_: any, i: number) => i !== index));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Education</h2>
        <button
          type="button"
          onClick={addEducation}
          className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
        >
          <Plus className="h-5 w-5" />
          <span>Add</span>
        </button>
      </div>
      {education.map((edu: any, index: number) => (
        <div key={index} className="mb-6 pb-6 border-b last:border-b-0">
          <div className="flex justify-end mb-2">
            <button
              type="button"
              onClick={() => removeEducation(index)}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Institution *"
                value={edu.institution}
                onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input
              type="text"
              placeholder="Degree *"
              value={edu.degree}
              onChange={(e) => updateEducation(index, 'degree', e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Field of Study *"
              value={edu.field}
              onChange={(e) => updateEducation(index, 'field', e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Start Date"
              value={edu.start_date}
              onChange={(e) => updateEducation(index, 'start_date', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="End Date"
              value={edu.end_date}
              onChange={(e) => updateEducation(index, 'end_date', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <div className="md:col-span-2">
              <textarea
                placeholder="Description"
                value={edu.description}
                onChange={(e) => updateEducation(index, 'description', e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ExperienceSection({ experience, setExperience }: any) {
  const addExperience = () => {
    setExperience([...experience, { company: '', position: '', location: '', start_date: '', end_date: '', description: '' }]);
  };

  const removeExperience = (index: number) => {
    setExperience(experience.filter((_: any, i: number) => i !== index));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const updated = [...experience];
    updated[index] = { ...updated[index], [field]: value };
    setExperience(updated);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Experience</h2>
        <button
          type="button"
          onClick={addExperience}
          className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
        >
          <Plus className="h-5 w-5" />
          <span>Add</span>
        </button>
      </div>
      {experience.map((exp: any, index: number) => (
        <div key={index} className="mb-6 pb-6 border-b last:border-b-0">
          <div className="flex justify-end mb-2">
            <button
              type="button"
              onClick={() => removeExperience(index)}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Company *"
              value={exp.company}
              onChange={(e) => updateExperience(index, 'company', e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Position *"
              value={exp.position}
              onChange={(e) => updateExperience(index, 'position', e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Location"
              value={exp.location}
              onChange={(e) => updateExperience(index, 'location', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Start Date"
                value={exp.start_date}
                onChange={(e) => updateExperience(index, 'start_date', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="End Date"
                value={exp.end_date}
                onChange={(e) => updateExperience(index, 'end_date', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <textarea
                placeholder="Description"
                value={exp.description}
                onChange={(e) => updateExperience(index, 'description', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectsSection({ projects, setProjects }: any) {
  const addProject = () => {
    setProjects([...projects, { title: '', description: '', technologies: [], link: '', github_link: '' }]);
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_: any, i: number) => i !== index));
  };

  const updateProject = (index: number, field: string, value: string | string[]) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Projects</h2>
        <button
          type="button"
          onClick={addProject}
          className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
        >
          <Plus className="h-5 w-5" />
          <span>Add</span>
        </button>
      </div>
      {projects.map((proj: any, index: number) => (
        <div key={index} className="mb-6 pb-6 border-b last:border-b-0">
          <div className="flex justify-end mb-2">
            <button
              type="button"
              onClick={() => removeProject(index)}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Project Title *"
                value={proj.title}
                onChange={(e) => updateProject(index, 'title', e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <textarea
                placeholder="Description"
                value={proj.description}
                onChange={(e) => updateProject(index, 'description', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Technologies (comma-separated)"
                value={Array.isArray(proj.technologies) ? proj.technologies.join(', ') : ''}
                onChange={(e) => updateProject(index, 'technologies', e.target.value.split(',').map((t: string) => t.trim()))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input
              type="url"
              placeholder="Project Link"
              value={proj.link}
              onChange={(e) => updateProject(index, 'link', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="url"
              placeholder="GitHub Link"
              value={proj.github_link}
              onChange={(e) => updateProject(index, 'github_link', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function SkillsSection({ skills, setSkills }: any) {
  const addSkill = () => {
    setSkills([...skills, { name: '', category: 'Technical', proficiency: 'Intermediate' }]);
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_: any, i: number) => i !== index));
  };

  const updateSkill = (index: number, field: string, value: string) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], [field]: value };
    setSkills(updated);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Skills</h2>
        <button
          type="button"
          onClick={addSkill}
          className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
        >
          <Plus className="h-5 w-5" />
          <span>Add</span>
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {skills.map((skill: any, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Skill Name *"
              value={skill.name}
              onChange={(e) => updateSkill(index, 'name', e.target.value)}
              required
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={skill.category}
              onChange={(e) => updateSkill(index, 'category', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Technical">Technical</option>
              <option value="Soft Skills">Soft Skills</option>
              <option value="Languages">Languages</option>
              <option value="Other">Other</option>
            </select>
            <button
              type="button"
              onClick={() => removeSkill(index)}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
