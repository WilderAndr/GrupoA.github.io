document.addEventListener('DOMContentLoaded', async () => {
  // Cargar proyectos
  try {
    const projects = await Project.all();
    const projectsContainer = document.getElementById('projects-container');
    
    projectsContainer.innerHTML = projects.map(project => `
      <div class="project">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <p>Tecnologías: ${project.technologies.join(', ')}</p>
        <a href="${project.url}" target="_blank">Ver proyecto</a>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading projects:', error);
  }

  // Cargar habilidades por categoría
  try {
    const skills = await Skill.all();
    const skillsByCategory = {};
    
    skills.forEach(skill => {
      if (!skillsByCategory[skill.category]) {
        skillsByCategory[skill.category] = [];
      }
      skillsByCategory[skill.category].push(skill);
    });

    const skillsContainer = document.getElementById('skills-container');
    
    skillsContainer.innerHTML = Object.entries(skillsByCategory).map(([category, skills]) => `
      <div class="skill-category">
        <h3>${category}</h3>
        <ul>
          ${skills.map(skill => `<li>${skill.name} (${skill.level})</li>`).join('')}
        </ul>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading skills:', error);
  }
});
