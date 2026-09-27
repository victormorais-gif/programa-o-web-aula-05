import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createModule(name: string, duration: number) {
  try {
    if (!name || typeof name !== "string") {
      throw new Error("Nome do módulo é obrigatório");
    }

    if (duration <= 0) {
      throw new Error("Duração deve ser maior que zero");
    }

    const module = await prisma.module.create({
      data: {
        name,
        duration,
      },
    });

    console.log("✅ Módulo criado com sucesso:");
    console.log(`   ID: ${module.id}`);
    console.log(`   Nome: ${module.name}`);
    console.log(`   Duração: ${module.duration} minutos`);
    
    return module;
  } catch (error: any) {
    if (error.code === "P2002") {
      console.error("❌ Um módulo com este nome já existe");
    } else {
      console.error("❌ Erro ao criar módulo:", error.message);
    }
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar script com exemplos
async function main() {
  await createModule("HTML Básico", 60);
  await createModule("CSS e Responsividade", 90);
  await createModule("JavaScript Fundamentals", 120);
}

main();
