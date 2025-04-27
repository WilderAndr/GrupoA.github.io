// _data/models/Project.js - Versión mejorada con validaciones completas
class Project {
  constructor(data = {}) {
    if (typeof data !== 'object') {
      throw new TypeError('Los datos del proyecto deben ser un objeto');
    }

    // Validación de ID
    this.id = Number.isInteger(data.id) && data.id > 0 ? data.id : 0;

    // Validación de título
    if (typeof data.title !== 'string' || data.title.trim() === '') {
      console.warn('Proyecto creado sin título válido');
      this.title = 'Sin título';
    } else {
      this.title = data.title.trim();
    }

    // Resto de propiedades con validaciones
    this.description = typeof data.description === 'string' ? data.description : '';
    this.technologies = Array.isArray(data.technologies) ? 
      data.technologies.filter(tech => typeof tech === 'string') : [];
    this.url = typeof data.url === 'string' && data.url.startsWith('http') ? 
      data.url : '#';
    this.createdAt = this.validateDate(data.createdAt);
  }

  validateDate(dateString) {
    if (!dateString) return new Date().toISOString();
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
  }

  static async all() {
    try {
      const response = await fetch('/GrupoA.github.io/_data/db.json');
      
      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data?.projects) {
        throw new Error('Formato de datos inválido: falta propiedad projects');
      }

      return data.projects.map(project => {
        try {
          return new Project(project);
        } catch (error) {
          console.error(`Error creando proyecto ${project.id}:`, error);
          return null;
        }
      }).filter(Boolean);

    } catch (error) {
      console.error('Error en Project.all():', error);
      throw new Error('No se pudieron cargar los proyectos');
    }
  }

  static async find(id) {
    if (!Number.isInteger(Number(id))) { // <- corregido
      throw new TypeError('El ID debe ser un número');
    }

    const projects = await this.all();
    return projects.find(project => project.id === Number(id)) || null;
  }

  static async filterByTechnology(tech) {
    if (typeof tech !== 'string' || tech.trim() === '') {
      throw new TypeError('La tecnología debe ser un string no vacío');
    }

    const projects = await this.all();
    return projects.filter(project => 
      project.technologies.some(
        t => t.toLowerCase() === tech.toLowerCase()
      )
    );
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      technologies: this.technologies,
      url: this.url,
      createdAt: this.createdAt
    };
  }

  toString() {
    return `Project#${this.id} "${this.title}" (${this.technologies.join(', ')})`;
  }
}

// Exportación universal

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Project;
}
if (typeof window !== 'undefined') {
  window.Project = Project;
}
