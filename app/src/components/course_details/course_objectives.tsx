type CourseObjectivesProps = {
  objectives: string[];
  priorKnowledge: string[];
};

export default function CourseObjectives({ objectives, priorKnowledge }: CourseObjectivesProps) {
  const items = objectives.length > 0
    ? objectives
    : priorKnowledge.length > 0
      ? priorKnowledge
      : ['This course is ready for content authoring. Add learning objectives in the course record.'];

  return (
    <section className="course-objectives">
      <h2>Learning Objectives</h2>

      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
