const { PrismaClient } = require('@prisma/client');
const { config } = require('dotenv');

config({ path: 'src/config/.env' });
config();

const prisma = new PrismaClient();

const catalog = [
  {
    subject: {
      name: 'AI Engineering',
      description: 'Production-focused tracks for building, evaluating, and operating AI systems.',
    },
    topic: {
      name: 'Prompt Engineering',
      description: 'Practical prompting patterns for reliable LLM behavior.',
    },
    course: {
      title: 'Prompt Engineering Foundations',
      slug: 'prompt-engineering-foundations',
      stars: 5,
      description: 'Learn practical prompt structures, context design, and iteration techniques for building dependable LLM workflows.',
      priorKnowledge: ['Basic programming concepts', 'Interest in AI products'],
      learnObjectives: [
        'Structure prompts for clarity and repeatability',
        'Design context windows for better model responses',
        'Evaluate and iterate prompts with practical criteria',
      ],
    },
    modules: [
      {
        name: 'Prompting Fundamentals',
        slug: 'prompting-fundamentals',
        description: 'Core concepts for instructions, context, constraints, and examples.',
        order: 1,
        lessons: [
          {
            name: 'What Makes a Prompt Reliable',
            slug: 'what-makes-a-prompt-reliable',
            description: 'Understand the parts of a prompt that make model output more consistent.',
            order: 1,
            content: {
              overview: 'A reliable prompt gives the model a clear task, enough context, explicit constraints, and a target output shape.',
              body: 'A prompt is not just a question. In production workflows, a prompt is an interface between user intent, business rules, and model behavior.\n\nGood prompts define the role, task, context, constraints, and expected output. This reduces ambiguity and makes results easier to evaluate.\n\nStart simple, observe failures, then add only the constraints that improve behavior.',
              resources: ['Prompt structure checklist', 'Failure-mode notes'],
              exerciseCount: 2,
              durationMinutes: 18,
            },
          },
          {
            name: 'Instructions, Context, and Output Shape',
            slug: 'instructions-context-output-shape',
            description: 'Separate task instructions from background context and response formatting.',
            order: 2,
            content: {
              overview: 'Clear separation helps the model understand what to do, what information to use, and how to respond.',
              body: 'Instructions describe the action. Context provides the facts. Output shape defines how the answer should be returned.\n\nMixing these concerns makes prompts harder to debug. Keep each part explicit so you can adjust one piece without changing everything else.',
              resources: ['Prompt anatomy reference'],
              exerciseCount: 2,
              durationMinutes: 22,
            },
          },
        ],
      },
      {
        name: 'Prompt Evaluation',
        slug: 'prompt-evaluation',
        description: 'Test and improve prompts with expected outputs and edge cases.',
        order: 2,
        lessons: [
          {
            name: 'Testing Prompt Behavior',
            slug: 'testing-prompt-behavior',
            description: 'Create small test sets to compare prompt versions.',
            order: 1,
            content: {
              overview: 'Prompt quality should be measured with real examples, not only intuition.',
              body: 'Build a small set of representative inputs. Include common cases, edge cases, and known failure cases.\n\nCompare prompt versions against the same set. Track correctness, format compliance, latency, and cost.',
              resources: ['Prompt test-set template'],
              exerciseCount: 3,
              durationMinutes: 24,
            },
          },
        ],
      },
    ],
  },
  {
    subject: {
      name: 'AI Engineering',
      description: 'Production-focused tracks for building, evaluating, and operating AI systems.',
    },
    topic: {
      name: 'RAG Systems',
      description: 'Retrieval-augmented generation systems for grounded AI applications.',
    },
    course: {
      title: 'RAG Systems Essentials',
      slug: 'rag-systems-essentials',
      stars: 5,
      description: 'Build a foundation in retrieval, chunking, embeddings, ranking, and grounded generation for RAG applications.',
      priorKnowledge: ['Basic backend development', 'Basic LLM concepts'],
      learnObjectives: [
        'Explain the parts of a RAG pipeline',
        'Choose chunking and retrieval strategies',
        'Identify common RAG failure modes',
      ],
    },
    modules: [
      {
        name: 'Retrieval Pipeline',
        slug: 'retrieval-pipeline',
        description: 'Understand how documents move from source content to retrieved context.',
        order: 1,
        lessons: [
          {
            name: 'RAG Architecture Overview',
            slug: 'rag-architecture-overview',
            description: 'Map the major components of a retrieval-augmented generation system.',
            order: 1,
            content: {
              overview: 'RAG combines document retrieval with generation so answers can be grounded in external knowledge.',
              body: 'A basic RAG system ingests documents, chunks them, embeds them, stores vectors, retrieves relevant chunks, and passes those chunks to an LLM.\n\nEach stage affects answer quality. Weak chunking, poor metadata, or noisy retrieval can cause the model to answer with incomplete context.',
              resources: ['RAG pipeline diagram'],
              exerciseCount: 2,
              durationMinutes: 20,
            },
          },
          {
            name: 'Chunking and Metadata',
            slug: 'chunking-and-metadata',
            description: 'Learn why chunk size and metadata shape retrieval quality.',
            order: 2,
            content: {
              overview: 'Chunking controls what information can be retrieved together; metadata helps filter and explain results.',
              body: 'Chunks should be large enough to preserve meaning and small enough to retrieve precisely.\n\nMetadata such as source, section, date, and document type can improve filtering and make citations easier.',
              resources: ['Chunking strategy notes'],
              exerciseCount: 2,
              durationMinutes: 24,
            },
          },
        ],
      },
    ],
  },
  {
    subject: {
      name: 'Mathematics',
      description: 'Mathematical foundations for computing, AI, and data systems.',
    },
    topic: {
      name: 'Linear Algebra',
      description: 'Vectors, matrices, transformations, and the math behind modern AI.',
    },
    course: {
      title: 'Linear Algebra Basics',
      slug: 'linear-algebra-basics',
      stars: 5,
      description: 'Study vectors, matrices, systems of equations, and transformations with examples connected to computing and AI.',
      priorKnowledge: ['High-school algebra', 'Basic functions and graphs'],
      learnObjectives: [
        'Use vectors and matrices to represent data',
        'Solve basic systems of linear equations',
        'Connect linear transformations to practical computing examples',
      ],
    },
    modules: [
      {
        name: 'Vectors and Matrices',
        slug: 'vectors-and-matrices',
        description: 'Learn the basic objects of linear algebra and how they represent data.',
        order: 1,
        lessons: [
          {
            name: 'Vectors as Data',
            slug: 'vectors-as-data',
            description: 'Understand vectors as ordered lists of values with direction and magnitude.',
            order: 1,
            content: {
              overview: 'Vectors are a compact way to represent points, features, and directions.',
              body: 'A vector can represent a point in space, an image embedding, a product profile, or the features of a house.\n\nOperations such as addition and scaling help transform and compare these representations.',
              resources: ['Vector notation guide'],
              exerciseCount: 3,
              durationMinutes: 20,
            },
          },
          {
            name: 'Matrix Operations',
            slug: 'matrix-operations',
            description: 'Learn how matrices organize numbers and transform vectors.',
            order: 2,
            content: {
              overview: 'Matrices can store structured data and represent transformations.',
              body: 'A matrix is a table of numbers. In computing, matrices appear in graphics, neural networks, optimization, and data analysis.\n\nMatrix multiplication is especially important because it composes transformations.',
              resources: ['Matrix multiplication examples'],
              exerciseCount: 3,
              durationMinutes: 26,
            },
          },
        ],
      },
      {
        name: 'Linear Systems',
        slug: 'linear-systems',
        description: 'Represent and solve systems of equations with matrix notation.',
        order: 2,
        lessons: [
          {
            name: 'Systems in Matrix Form',
            slug: 'systems-in-matrix-form',
            description: 'Convert equations into AX = B notation.',
            order: 1,
            content: {
              overview: 'Matrix notation gives a compact way to represent many equations at once.',
              body: 'A system of linear equations can be written as AX = B, where A stores coefficients, X stores unknowns, and B stores outputs.\n\nThis form lets computers solve large systems efficiently.',
              resources: ['AX = B worksheet'],
              exerciseCount: 2,
              durationMinutes: 24,
            },
          },
        ],
      },
    ],
  },
];

const findOrCreateSubject = async (subject) => {
  const existingSubject = await prisma.subject.findFirst({
    where: { name: subject.name },
  });

  if (existingSubject) {
    return prisma.subject.update({
      where: { id: existingSubject.id },
      data: { description: subject.description },
    });
  }

  return prisma.subject.create({ data: subject });
};

const findOrCreateTopic = async (topic, subjectId) => {
  const existingTopic = await prisma.topic.findFirst({
    where: {
      name: topic.name,
      subjectId,
    },
  });

  if (existingTopic) {
    return prisma.topic.update({
      where: { id: existingTopic.id },
      data: { description: topic.description },
    });
  }

  return prisma.topic.create({
    data: {
      ...topic,
      subjectId,
    },
  });
};

const seedCourse = async (entry) => {
  const subject = await findOrCreateSubject(entry.subject);
  const topic = await findOrCreateTopic(entry.topic, subject.id);

  const course = await prisma.course.upsert({
    where: { slug: entry.course.slug },
    update: {
      title: entry.course.title,
      description: entry.course.description,
      stars: entry.course.stars,
      priorKnowledge: entry.course.priorKnowledge,
      learnObjectives: entry.course.learnObjectives,
      topicId: topic.id,
    },
    create: {
      ...entry.course,
      topicId: topic.id,
    },
  });

  await prisma.module.deleteMany({
    where: { courseId: course.id },
  });

  for (const module of entry.modules) {
    await prisma.module.create({
      data: {
        courseId: course.id,
        name: module.name,
        slug: module.slug,
        description: module.description,
        order: module.order,
        lessons: {
          create: module.lessons.map((lesson) => ({
            name: lesson.name,
            slug: lesson.slug,
            description: lesson.description,
            order: lesson.order,
            content: {
              create: lesson.content,
            },
          })),
        },
      },
    });
  }

  const lessonsCount = entry.modules.reduce((total, module) => total + module.lessons.length, 0);
  const totalMinutes = entry.modules.reduce((total, module) => {
    return total + module.lessons.reduce((moduleTotal, lesson) => moduleTotal + lesson.content.durationMinutes, 0);
  }, 0);

  await prisma.course.update({
    where: { id: course.id },
    data: {
      lessonsCount,
      hoursCount: Math.ceil(totalMinutes / 60),
    },
  });

  return course.slug;
};

const main = async () => {
  const seededSlugs = [];

  for (const entry of catalog) {
    seededSlugs.push(await seedCourse(entry));
  }

  console.log(`Seeded ${seededSlugs.length} courses: ${seededSlugs.join(', ')}`);
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
