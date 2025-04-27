// Mock robusto de fetch para pruebas
beforeAll(function() {
  window.originalFetch = window.fetch;
  
  window.fetch = jasmine.createSpy('fetch').and.callFake(function() {
    return Promise.resolve({
      ok: true,
      json: function() {
        return Promise.resolve({
          projects: [
            { 
              id: 1, 
              title: "Project 1", 
              description: "A project", 
              technologies: ["JavaScript"], 
              url: "http://example.com", 
              createdAt: "2021-01-01" 
            },
            { 
              id: 2, 
              title: "Project 2", 
              description: "Another project", 
              technologies: ["HTML", "CSS"], 
              url: "http://example2.com", 
              createdAt: "2021-02-01" 
            }
          ]
        });
      }
    });
  });
});

// Restaura fetch después de las pruebas
afterAll(function() {
  window.fetch = window.originalFetch;
});

describe('Modelo Project', function() {
  // Verifica que Project esté disponible
  beforeAll(function() {
    if (typeof Project === 'undefined') {
      throw new Error('Project no está definido. Revisa la carga del archivo Project.js');
    }
  });

  describe('Métodos estáticos', function() {
    it('debería retornar proyectos', async function() {
      const projects = await Project.all();
      expect(projects).toBeDefined();
      expect(projects.length).toBe(2);
      expect(projects[0]).toEqual(jasmine.any(Project));
      expect(projects[0].title).toBe("Project 1");
    });

    it('debería encontrar por ID', async function() {
      const project = await Project.find(1);
      expect(project).toBeDefined();
      expect(project.id).toBe(1);
      expect(project.title).toBe("Project 1");
    });

    it('debería filtrar correctamente por tecnología', async function() {
      const projects = await Project.filterByTechnology("JavaScript");
      expect(projects.length).toBe(1);
      expect(projects[0].technologies).toContain("JavaScript");
    });
  });

  describe('Constructor', function() {
    it('debería usar valores por defecto cuando corresponda', function() {
      const project = new Project({});
      expect(project.title).toBe("Sin título");
      expect(project.url).toBe("#");
      expect(project.technologies).toEqual([]);
    });

    it('debería crear instancias correctamente', function() {
      const projectData = { 
        id: 1, 
        title: "Project 1", 
        description: "A project", 
        technologies: ["JavaScript"], 
        url: "http://example.com", 
        createdAt: "2021-01-01" 
      };
      const project = new Project(projectData);
      
      // Verificación mejorada que maneja tanto formato ISO como fecha simple
      const expectedData = {
        ...projectData,
        createdAt: jasmine.any(String) // Acepta cualquier string de fecha
      };
      
      expect(project.id).toBe(1);
      expect(project.title).toBe("Project 1");
      expect(project).toEqual(jasmine.objectContaining(expectedData));
      
      // Verificación específica para la fecha
      expect(project.createdAt).toMatch(/^2021-01-01($|T)/); // Acepta con o sin tiempo
    });
  });
});
