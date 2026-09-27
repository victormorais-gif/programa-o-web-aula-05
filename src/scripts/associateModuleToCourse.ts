import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function associateModuleToCourse(courseId: number, moduleId: number) {
  try {
    // Validar se course existe
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new Error(`Curso com ID ${courseId} não encontrado`);
    }

    // Validar se module existe
    const module = await prisma.module.findUnique({
      where: { id: moduleId },
    });

    if (!module) {
      throw new Error(`Módulo com ID ${moduleId} não encontrado`);
    }

    // Criar associação na tabela intermediária
    const association = await prisma.coursesOnModules.create({
      data: {
        courseId,
        moduleId,
      },
    });

    console.log("✅ Módulo associado ao curso com sucesso!");
    console.log(`   Curso ID: ${association.courseId}`);
    console.log(`   Módulo ID: ${association.moduleId}`);
    console.log(`   Associado em: ${association.createdAt}`);

    return association;
  } catch (error: any) {
    if (error.code === "P2002") {
      console.error("❌ Este módulo já está associado a este curso");
    } else {
      console.error("❌ Erro ao associar módulo:", error.message);
    }
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar - substituir IDs reais
associateModuleToCourse(1, 1);
