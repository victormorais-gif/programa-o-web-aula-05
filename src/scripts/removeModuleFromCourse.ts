import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function removeModuleFromCourse(courseId: number, moduleId: number) {
  try {
    // Verificar se a associação existe
    const association = await prisma.coursesOnModules.findUnique({
      where: {
        courseId_moduleId: {
          courseId,
          moduleId,
        },
      },
    });

    if (!association) {
      console.error(
        `❌ Este módulo não está associado a este curso`
      );
      return null;
    }

    // Deletar da tabela intermediária
    const deleted = await prisma.coursesOnModules.delete({
      where: {
        courseId_moduleId: {
          courseId,
          moduleId,
        },
      },
    });

    console.log("✅ Módulo removido do curso com sucesso!");
    console.log(`   Curso ID: ${deleted.courseId}`);
    console.log(`   Módulo ID: ${deleted.moduleId}`);
    console.log(`   Removido em: ${new Date().toLocaleString()}`);

    return deleted;
  } catch (error: any) {
    console.error("❌ Erro ao remover módulo:", error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar - substituir IDs reais
removeModuleFromCourse(1, 1);
