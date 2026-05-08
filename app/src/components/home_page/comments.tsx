
import '../../styles/home_page_css/comments.css';

const testimonials = [
    {
        title: 'Title of the testimonial',
        quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sapien eget nunc efficitur varius.',
        name: 'name of the person',
        role: 'role of the person',
        initials: 'AB',
    },
    {
        title: 'Title of the testimonial',
        quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sapien eget nunc efficitur varius.',
        name: 'name of the person',
        role: 'role of the person',
        initials: 'CD',
    },
    {
        title: 'Title of the testimonial',
        quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sapien eget nunc efficitur varius.',
        name: 'name of the person',
        role: 'role of the person',
        initials: 'AB',
    },
];

export default function Comments() {
    return (
        <section className="comments">
            <button className="comments__arrow comments__arrow--prev" type="button" aria-label="Previous testimonial">
                ‹
            </button>

            <div className="comments__track">
                {testimonials.map((testimonial) => (
                    <article className="comments__card" key={testimonial.name}>
                        <h3>{testimonial.title}</h3>
                        <p className="comments__quote">{testimonial.quote}</p>

                        <div className="comments__author">
                            <div className="" aria-hidden="true">
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
                ›
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
