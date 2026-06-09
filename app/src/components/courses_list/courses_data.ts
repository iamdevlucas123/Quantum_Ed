export type CourseCard = {
  id: string;
  title: string;
  subject: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  lessons: number;
  description: string;
  status: string;
};

export const courses: CourseCard[] = [
  {
    id: 'quantum-systems-boot-sequence',
    title: 'Quantum Systems Boot Sequence',
    subject: 'Quantum Labs',
    level: 'Beginner',
    duration: '12h',
    lessons: 18,
    description: 'Build first-principles intuition for qubits, gates, measurement and state evolution.',
    status: 'Core mission',
  },
  {
    id: 'linear-algebra-for-orbit-control',
    title: 'Linear Algebra for Orbit Control',
    subject: 'Mathematics',
    level: 'Intermediate',
    duration: '9h',
    lessons: 14,
    description: 'Use vectors, matrices and basis changes to support simulations and engineering models.',
    status: 'Navigation math',
  },
  {
    id: 'mechanics-and-field-dynamics',
    title: 'Mechanics and Field Dynamics',
    subject: 'Physics',
    level: 'Intermediate',
    duration: '16h',
    lessons: 24,
    description: 'Move from classical motion into fields, energy transfer and physical system reasoning.',
    status: 'Physics core',
  },
  {
    id: 'control-room-architecture',
    title: 'Control Room Architecture',
    subject: 'Software Systems',
    level: 'Advanced',
    duration: '15h',
    lessons: 20,
    description: 'Design robust product systems with state, APIs, observability and reliable feedback loops.',
    status: 'Command deck',
  },
  {
    id: 'probability-for-measurement-noise',
    title: 'Probability for Measurement Noise',
    subject: 'Mathematics',
    level: 'Beginner',
    duration: '8h',
    lessons: 12,
    description: 'Model uncertainty, distributions and inference for lab data and computational experiments.',
    status: 'Signal analysis',
  },
  {
    id: 'simulation-workbench-foundations',
    title: 'Simulation Workbench Foundations',
    subject: 'Software Systems',
    level: 'Intermediate',
    duration: '11h',
    lessons: 17,
    description: 'Create repeatable simulation tooling with modular code, visualization and experiment logs.',
    status: 'Lab tooling',
  },
  {
    id: 'electromagnetism-for-computing-systems',
    title: 'Electromagnetism for Computing Systems',
    subject: 'Physics',
    level: 'Advanced',
    duration: '18h',
    lessons: 26,
    description: 'Connect field theory to hardware constraints, signal propagation and system design tradeoffs.',
    status: 'Power systems',
  },
  {
    id: 'quantum-algorithm-primer',
    title: 'Quantum Algorithm Primer',
    subject: 'Quantum Labs',
    level: 'Advanced',
    duration: '10h',
    lessons: 15,
    description: 'Study canonical algorithm patterns and how they map onto circuit-level computation.',
    status: 'Advanced lab',
  },
];
