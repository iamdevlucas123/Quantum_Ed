import '../../styles/home_page_css/comments.css';

const testimonials = [
    {
        title: 'The roadmap feels operational',
        quote: 'QuantumEd made advanced topics feel like a mission log instead of a loose pile of tutorials.',
        name: 'Avery Brooks',
        role: 'Embedded systems student',
        initials: 'AB',
    },
    {
        title: 'Strong signal, low noise',
        quote: 'The lessons cut straight to the models and the exercises feel closer to real engineering work.',
        name: 'Camila Duarte',
        role: 'Physics undergrad',
        initials: 'CD',
    },
    {
        title: 'A better control panel for self-study',
        quote: 'I can track where I am, what to review next and which courses deserve deeper time.',
        name: 'Mason Lee',
        role: 'Software engineer',
        initials: 'ML',
    },
];

export default function Comments() {
    return (
        <section className="comments">
            <button className="comments__arrow comments__arrow--prev" type="button" aria-label="Previous testimonial">
                {'<'}
            </button>

            <div className="comments__track">
                {testimonials.map((testimonial) => (
                    <article className="comments__card" key={testimonial.name}>
                        <h3>{testimonial.title}</h3>
                        <p className="comments__quote">{testimonial.quote}</p>

                        <div className="comments__author">
                            <div className="comments__avatar" aria-hidden="true">
                                {testimonial.initials}
                            </div>
                            <div>
                                <p className="comments__name">{testimonial.name}</p>
                                <p className="comments__role">{testimonial.role}</p>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            <button className="comments__arrow comments__arrow--next" type="button" aria-label="Next testimonial">
                {'>'}
            </button>

            <div className="comments__pagination" aria-hidden="true">
                <span className="is-active" />
                <span />
                <span />
                <span />
                <span />
            </div>
        </section>
    );
}
