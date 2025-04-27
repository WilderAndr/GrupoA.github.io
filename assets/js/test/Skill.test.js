describe('Modelo Skill', () => {
  // Datos de prueba
  const testSkillData = {
    id: 1,
    name: "JavaScript",
    level: "Avanzado",
    category: "Lenguajes",
    yearsOfExperience: 3
  };

  describe('Constructor', () => {
    it('debería crear instancias correctamente', () => {
      const skill = new Skill(testSkillData);
      
      expect(skill.id).toBe(1);
      expect(skill.name).toBe("JavaScript");
      expect(skill.level).toBe("Avanzado");
      expect(skill.category).toBe("Lenguajes");
      expect(skill.yearsOfExperience).toBe(3);
    });

    it('debería usar valores por defecto cuando corresponda', () => {
      const skill = new Skill({ id: 2 });
      
      expect(skill.name).toBe("Habilidad sin nombre");
      expect(skill.level).toBe("Básico");
      expect(skill.yearsOfExperience).toBe(0);
    });
  });

  describe('Métodos estáticos', () => {
    beforeEach(() => {
      // Configurar mock para estas pruebas
      fetch.and.returnValue(
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            skills: [testSkillData, {
              id: 2,
              name: "HTML",
              level: "Intermedio",
              category: "Frontend"
            }]
          })
        })
      );
    });

    it('all() debería retornar habilidades', async () => {
      const skills = await Skill.all();
      
      expect(skills.length).toBe(2);
      expect(skills[0]).toBeInstanceOf(Skill);
      expect(fetch).toHaveBeenCalledWith('{{ site.baseurl }}/assets/data/db.json');

    });

    it('findByCategory() debería filtrar correctamente', async () => {
      const skills = await Skill.findByCategory("Lenguajes");
      
      expect(skills.length).toBe(1);
      expect(skills[0].name).toBe("JavaScript");
    });

    it('findByLevel() debería filtrar por nivel', async () => {
      const skills = await Skill.findByLevel("Intermedio");
      
      expect(skills.length).toBe(1);
      expect(skills[0].name).toBe("HTML");
    });
  });

  describe('Manejo de errores', () => {
    it('debería manejar errores en all()', async () => {
      fetch.and.returnValue(Promise.reject(new Error("Network error")));
      
      try {
        await Skill.all();
        fail("Debería haber lanzado un error");
      } catch (error) {
        expect(error.message).toBeDefined();
      }
    });
  });
});
