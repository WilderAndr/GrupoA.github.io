class Skill {
  constructor(data = {}) {
    this.id = data.id || 0;
    this.name = data.name || 'Habilidad sin nombre';
    this.level = data.level || 'Básico';
    this.category = data.category || 'General';
    this.yearsOfExperience = data.yearsOfExperience || 0;
  }

  static async all() {
    try {
      const response = await fetch('/GrupoA.github.io/_data/db.json');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      if (!data.skills) throw new Error('Formato de datos inválido');
      
      return data.skills.map(skill => new Skill(skill));
    } catch (error) {
      console.error('Error en Skill.all():', error);
      throw error;
    }
  }

  static async findByCategory(category) {
    const skills = await this.all();
    return skills.filter(skill => skill.category === category);
  }

  static async findByLevel(level) {
    const skills = await this.all();
    return skills.filter(skill => skill.level === level);
  }

  // Método para uso en console.log
  toString() {
    return `Skill#${this.id} ${this.name} (${this.level})`;
  }
}

// Export para Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Skill;
}
