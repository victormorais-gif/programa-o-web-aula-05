import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function listModulesWithCourses() {
  try {
    // IMPORTANTE: usar include para trazer os cursos relacionados
    const modules = await prisma.module.findMany({
      include: {
        courses: {
          include: {
            course: true,
          },
        },
      },
    });

    if (modules.length === 0) {
      console.log("📭 Nenhum módulo cadastrado");
      return;
    }

    console.log(`\n📚 Total de módulos: ${modules.length}\n`);

    modules.forEach((module) => {
      console.log(`📕 Módulo: ${module.name}`);
      console.log(`   ID: ${module.id}`);
      console.log(`   Duração: ${module.duration} minutos`);
      console.log(`   Cursos que usam este módulo: ${module.courses.length}`);

      if (module.courses.length > 0) {
        module.courses.forEach((cm) => {
          console.log(`      ✓ ${cm.course.name}`);
        });
      }
      console.log("");
    });

    return modules;
  } catch (error: any) {
    console.error("❌ Erro ao listar módulos:", error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
listModulesWithCourses();
