const TestimonialsSection = ({ testimonials }) => (
  <section className="space-y-12 py-10">
    <div className="text-center">
      <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">What Our Patients Say</h2>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
        Real stories from people who have experienced a better way to hire skilled doctors with Perscripto.
      </p>
    </div>
    <div className="relative overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-20 before:bg-gradient-to-r before:from-slate-50 before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-20 after:bg-gradient-to-l after:from-slate-50 after:to-transparent">
      <div className="animate-marquee flex gap-8 py-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex gap-8">
            {testimonials.map((item, index) => (
              <div key={`${item.name}-${index}`} className="group relative flex w-[350px] flex-shrink-0 flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="absolute -top-4 -right-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-2xl text-white opacity-0 transition-opacity group-hover:opacity-100">
                  "
                </div>
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-2xl object-cover ring-4 ring-brand-50 transition-transform group-hover:scale-105"
                  />
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{item.name}</h4>
                    <p className="text-sm font-medium text-brand-600">{item.role}</p>
                  </div>
                </div>
                <div className="mt-6 flex gap-1 text-amber-400">
                  {[...Array(item.rating)].map((__, starIndex) => (
                    <span key={starIndex} className="text-xl">★</span>
                  ))}
                </div>
                <p className="mt-4 text-slate-600 leading-relaxed italic">"{item.content}"</p>
                <div className="mt-6 h-1 w-12 rounded-full bg-brand-100 transition-all group-hover:w-full group-hover:bg-brand-600" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
