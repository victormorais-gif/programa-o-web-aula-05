import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("=== Relacionamento N:N - Courses e Modules ===\n");

  try {
    // 1. Criar cursos
    console.log("--- 1. Criando cursos ---");
    const course1 = await prisma.course.create({
      data: {
        name: "Desenvolvimento Web",
        description: "Aprenda web development do zero",
      },
    });
    console.log(`✅ Curso criado: ${course1.name}`);

    const course2 = await prisma.course.create({
      data: {
        name: "Desenvolvimento Mobile",
        description: "Aprenda a criar apps mobile",
      },
    });
    console.log(`✅ Curso criado: ${course2.name}\n`);

    // 2. Criar módulos
    console.log("--- 2. Criando módulos ---");
    const module1 = await prisma.module.create({
      data: {
        name: "HTML Básico",
        duration: 60,
      },
    });
    console.log(`✅ Módulo criado: ${module1.name}`);

    const module2 = await prisma.module.create({
      data: {
        name: "CSS e Responsividade",
        duration: 90,
      },
    });
    console.log(`✅ Módulo criado: ${module2.name}`);

    const module3 = await prisma.module.create({
      data: {
        name: "JavaScript Fundamentals",
        duration: 120,
      },
    });
    console.log(`✅ Módulo criado: ${module3.name}\n`);

    // 3. Associar módulos a cursos (criar na tabela intermediária)
    console.log("--- 3. Associando módulos aos cursos ---");
    await prisma.coursesOnModules.create({
      data: {
        courseId: course1.id,
        moduleId: module1.id,
      },
    });
    console.log(
      `✅ ${module1.name} associado a ${course1.name}`
    );

    await prisma.coursesOnModules.create({
      data: {
        courseId: course1.id,
        moduleId: module2.id,
      },
    });
    console.log(
      `✅ ${module2.name} associado a ${course1.name}`
    );

    await prisma.coursesOnModules.create({
      data: {
        courseId: course1.id,
        moduleId: module3.id,
      },
    });
    console.log(
      `✅ ${module3.name} associado a ${course1.name}`
    );

    await prisma.coursesOnModules.create({
      data: {
        courseId: course2.id,
        moduleId: module3.id,
      },
    });
    console.log(
      `✅ ${module3.name} associado a ${course2.name}\n`
    );

    // 4. Listar cursos com seus módulos (include)
    console.log("--- 4. Listando cursos com módulos (include) ---");
    const coursesWithModules = await prisma.course.findMany({
      include: {
        modules: {
          include: {
            module: true,
          },
        },
      },
    });

    coursesWithModules.forEach((course) => {
      console.log(`\n📌 ${course.name}`);
      console.log(`   Módulos: ${course.modules.length}`);
      course.modules.forEach((cm) => {
        console.log(`      ✓ ${cm.module.name} (${cm.module.duration}min)`);
      });
    });

    console.log("");

    // 5. Listar módulos com seus cursos (include)
    console.log("--- 5. Listando módulos com seus cursos (include) ---");
    const modulesWithCourses = await prisma.module.findMany({
      include: {
        courses: {
          include: {
            course: true,
          },
        },
      },
    });

    modulesWithCourses.forEach((module) => {
      console.log(`\n📕 ${module.name}`);
      console.log(`   Cursos: ${module.courses.length}`);
      module.courses.forEach((cm) => {
        console.log(`      ✓ ${cm.course.name}`);
      });
    });

    console.log("");

    // 6. Remover um módulo de um curso (deletar da tabela intermediária)
    console.log("--- 6. Removendo módulo de um curso ---");
    await prisma.coursesOnModules.delete({
      where: {
        courseId_moduleId: {
          courseId: course1.id,
          moduleId: module2.id,
        },
      },
    });
    console.log(
      `✅ ${module2.name} removido de ${course1.name}`
    );

    // 7. Listar novamente para confirmar a remoção
    console.log("\n--- 7. Confirmando remoção ---");
    const updatedCourse = await prisma.course.findUnique({
      where: { id: course1.id },
      include: {
        modules: {
          include: {
            module: true,
          },
        },
      },
    });

    console.log(`\n📌 ${updatedCourse?.name}`);
    console.log(`   Módulos restantes: ${updatedCourse?.modules.length}`);
    updatedCourse?.modules.forEach((cm) => {
      console.log(`      ✓ ${cm.module.name}`);
    });

    console.log(
      "\n✅ Demonstração de N:N concluída com sucesso!"
    );
  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
