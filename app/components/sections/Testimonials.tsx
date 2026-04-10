import content from "@/app/data/content.json";
import Testimonial from "../ui/Testimonial";
import TestimonialsCarousel from "../ui/TestimonialCarousel";

const TestimonialsSection = () => {
  const testimonialsCopy = content.testimonials;
  const firstRow = testimonialsCopy.columns.slice(0, 3);
  const secondRow = testimonialsCopy.columns.slice(3, 6);

  return (
    <section
      id="testimonials"
      className="flex h-full flex-col py-6 pb-10 md:p-10 md:pb-32"
    >
      <div className="flex flex-col gap-8 md:hidden">
        <div className="heading-2 flex items-end px-6 whitespace-pre-line text-gray-300">
          <span
            dangerouslySetInnerHTML={{ __html: content.testimonials.heading }}
          />
        </div>
        <TestimonialsCarousel testimonials={testimonialsCopy.columns} />
      </div>
      {/* Desktop/tablet layout: previous two-row flex layout restored */}
      <div className="hidden h-full flex-col justify-center gap-6 md:flex">
        <div className="flex gap-6">
          <div className="heading-2 flex w-[380px] items-end p-8 whitespace-pre-line text-gray-300">
            <span
              dangerouslySetInnerHTML={{
                __html: content.testimonials.heading,
              }}
            />
          </div>
          {firstRow.map((col, idx) => (
            <Testimonial
              key={col.author + idx}
              author={col.author}
              role={col.role}
              quote={col.quote}
              image={col.image}
              className="h-full"
            />
          ))}
        </div>
        <div className="flex gap-6">
          {secondRow.map((col, idx) => (
            <Testimonial
              key={col.author + idx}
              author={col.author}
              role={col.role}
              quote={col.quote}
              image={col.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
