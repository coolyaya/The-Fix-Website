const FAQ_ITEMS = [
  {
    question: "How long will my repair take?",
    answer:
      "Most screen and battery repairs are completed the same day\u2014often under an hour.",
  },
  {
    question: "Do you use quality parts?",
    answer:
      "Yes. We use high-quality parts and back our work with a parts & labor warranty.",
  },
  {
    question: "Do I need an appointment?",
    answer:
      "Walk-ins welcome. Booking online guarantees the fastest service.",
  },
] as const;

export function FAQ() {
  return (
    <section>
      <div className="container space-y-8 py-16 md:space-y-10 md:py-24">
        <div className="max-w-2xl space-y-4">
          <h2 className="text-3xl font-semibold md:text-4xl">Frequently asked questions</h2>
          <p className="text-lg text-fix-slate">
            Answers to the top questions we hear every day. Need something else? Reach out and our team will get back fast.
          </p>
        </div>
        <div className="grid gap-4">
          {FAQ_ITEMS.map(({ question, answer }) => (
            <div key={question} className="rounded-2xl bg-white p-6 shadow-soft">
              <h3 className="text-xl font-semibold text-fix-navy">{question}</h3>
              <p className="mt-2 text-sm text-fix-slate">{answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
