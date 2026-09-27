import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createCourse(name: string, description?: string) {
  try {
    const course = await prisma.course.create({
      data: {
        name,
        description,
      },
    });

    console.log("✅ Curso criado com sucesso:");
    console.log(`   ID: ${course.id}`);
    console.log(`   Nome: ${course.name}`);
    console.log(`   Descrição: ${course.description || "N/A"}`);
    
    return course;
  } catch (error: any) {
    if (error.code === "P2002") {
      console.error("❌ Um curso com este nome já existe");
    } else {
      console.error("❌ Erro ao criar curso:", error.message);
    }
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar script
createCourse(
  "Desenvolvimento Web",
  "Aprenda HTML, CSS, JavaScript e React"
);
