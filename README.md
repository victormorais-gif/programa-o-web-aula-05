# Relacionamento N:N com Prisma.js

Projeto prático demonstrando **relacionamento muitos-para-muitos (N:N)** entre Courses (Cursos) e Modules (Módulos) usando Prisma.

## 📚 O que é um Relacionamento N:N?

Um relacionamento N:N significa:
- **Um Curso pode ter VÁRIOS Módulos**
- **Um Módulo pode estar em VÁRIOS Cursos**

Exemplo:
- O curso "Desenvolvimento Web" contém: HTML, CSS, JavaScript
- O curso "Desenvolvimento Mobile" também contém: JavaScript
- O módulo "JavaScript" é usado em 2 cursos

## 🏗️ Estrutura do Banco de Dados

### Tabelas

#### Course (Cursos)
```
id          | name                    | description
1           | Desenvolvimento Web     | Aprenda web...
2           | Desenvolvimento Mobile  | Aprenda apps...
```

#### Module (Módulos)
```
id | name                   | duration
1  | HTML Básico           | 60 min
2  | CSS e Responsividade  | 90 min
3  | JavaScript            | 120 min
```

#### CoursesOnModules (Tabela Intermediária)
```
courseId | moduleId | createdAt
1        | 1        | 2024-01-01
1        | 2        | 2024-01-01
1        | 3        | 2024-01-01
2        | 3        | 2024-01-01
```

## 🔑 Características da Tabela Intermediária

- `courseId` (FK) + `moduleId` (FK) = **Chave Primária Composta**
- `onDelete: Cascade` - Se deletar curso/módulo, remove automaticamente
- `createdAt` - Timestamp de quando foi associado

## 📦 Instalação

```bash
npm install
```

## 🗄️ Configurar Banco de Dados

```bash
npm run db:migrate
```

Isso cria:
- Arquivo `dev.db` (banco SQLite)
- Pasta `/prisma/migrations`

## 🚀 Executar Scripts

### Executar Demonstração Completa
```bash
npm run dev
```

Mostra o fluxo completo:
1. ✅ Cria 2 cursos
2. ✅ Cria 3 módulos
3. ✅ Associa módulos a cursos
4. ✅ Lista cursos com módulos (include)
5. ✅ Lista módulos com cursos (include)
6. ✅ Remove um módulo de um curso

### Executar Scripts Individuais

**Criar um Curso**
```bash
npm run create:course
```

**Criar um Módulo**
```bash
npm run create:module
```

**Associar Módulo a Curso**
```bash
npm run associate
```

**Listar Cursos com Módulos**
```bash
npm run list:courses
```

**Listar Módulos com Cursos**
```bash
npm run list:modules
```

**Remover Módulo de Curso**
```bash
npm run remove:module
```

## 🔍 Operações N:N Explicadas

### 1. Criar Associação (INSERT na tabela intermediária)

```typescript
await prisma.coursesOnModules.create({
  data: {
    courseId: 1,
    moduleId: 2,
  },
});
```

### 2. Listar com Include (READ com dados relacionados)

```typescript
// Buscar cursos COM seus módulos
const courses = await prisma.course.findMany({
  include: {
    modules: {
      include: {
        module: true, // Trazer dados do módulo
      },
    },
  },
});
```

### 3. Remover Associação (DELETE da tabela intermediária)

```typescript
await prisma.coursesOnModules.delete({
  where: {
    courseId_moduleId: {
      courseId: 1,
      moduleId: 2,
    },
  },
});
```

## 📋 Fluxo Completo (src/index.ts)

O arquivo `src/index.ts` demonstra:

1. **Criar dados**: 2 cursos + 3 módulos
2. **Associar**: Criar registros na tabela intermediária
3. **Include**: Buscar com dados relacionados
4. **Delete**: Remover uma associação
5. **Validar**: Verificar que a remoção funcionou

## 💡 Dificuldades Encontradas

### 1. Entender a Tabela Intermediária
A tabela `CoursesOnModules` é criada explicitamente no schema. Prisma não cria automaticamente em casos N:N.

### 2. Usar Include Corretamente
Para trazer os dados relacionados, é necessário:
```typescript
include: {
  modules: {
    include: {
      module: true // Nested include!
    }
  }
}
```

### 3. Deletar da Tabela Intermediária
A chave primária é composta, então:
```typescript
courseId_moduleId: {
  courseId: 1,
  moduleId: 2,
}
```

### 4. Evitar Duplicatas
Tentar associar o mesmo módulo 2x causará erro de chave primária.

## 📁 Estrutura do Projeto

```
src/
├── index.ts                              # Demo completa
└── scripts/
    ├── createCourse.ts                   # Criar curso
    ├── createModule.ts                   # Criar módulo
    ├── associateModuleToCourse.ts        # Associar (N:N)
    ├── listCoursesWithModules.ts         # Listar com include
    ├── listModulesWithCourses.ts         # Listar com include
    └── removeModuleFromCourse.ts         # Remover (delete)

prisma/
└── schema.prisma                         # Modelos N:N

migrations/
└── [pasta_migração]/
    └── migration.sql                     # Script SQL gerado
```

## 🔧 Comandos Úteis

```bash
npm run dev                 # Rodar demo completa
npm run db:migrate          # Criar/atualizar banco
npm run db:studio           # Interface visual (localhost:5555)
npm run create:course       # Criar curso
npm run create:module       # Criar módulo
npm run associate           # Associar módulo
npm run list:courses        # Listar cursos
npm run list:modules        # Listar módulos
npm run remove:module       # Remover associação
```

## 🎯 Aprendizados

✅ Como criar relacionamento N:N no Prisma
✅ Trabalhar com tabela intermediária
✅ Usar `include` para buscar dados relacionados
✅ Criar e deletar associações
✅ Validações na tabela intermediária

## 📝 Schema Resumido

```prisma
model Course {
  id      Int  @id @default(autoincrement())
  name    String @unique
  modules CoursesOnModules[]
}

model Module {
  id      Int  @id @default(autoincrement())
  name    String @unique
  duration Int
  courses CoursesOnModules[]
}

model CoursesOnModules {
  courseId  Int
  moduleId  Int
  course    Course @relation(fields: [courseId], references: [id], onDelete: Cascade)
  module    Module @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  
  @@id([courseId, moduleId])
}
```

## 🚀 Pronto!

O projeto está completo e pronto para enviar ao GitHub!

---

**Desenvolvido como atividade prática de N:N com Prisma.js** ✅
