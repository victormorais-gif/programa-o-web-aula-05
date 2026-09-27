import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function listCoursesWithModules() {
  try {
    // IMPORTANTE: usar include para trazer os módulos relacionados
    const courses = await prisma.course.findMany({
      include: {
        modules: {
          include: {
            module: true,
          },
        },
      },
    });

    if (courses.length === 0) {
      console.log("📭 Nenhum curso cadastrado");
      return;
    }

    console.log(`\n📚 Total de cursos: ${courses.length}\n`);

    courses.forEach((course) => {
      console.log(`📌 Curso: ${course.name}`);
      console.log(`   ID: ${course.id}`);
      console.log(`   Descrição: ${course.description || "N/A"}`);
      console.log(`   Módulos associados: ${course.modules.length}`);

      if (course.modules.length > 0) {
        course.modules.forEach((cm) => {
          console.log(
            `      ✓ ${cm.module.name} (${cm.module.duration} min)`
          );
        });
      }
      console.log("");
    });

    return courses;
  } catch (error: any) {
    console.error("❌ Erro ao listar cursos:", error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
listCoursesWithModules();
